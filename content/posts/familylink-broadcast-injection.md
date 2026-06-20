---
title: "The TestingTools That Never Left: Exported Debug BroadcastReceiver in Google Family Link"
date: "2026-05-26"
category: "Security"
tags: ["Google VRP", "Android", "BroadcastReceiver", "Mobile Security", "Bug Bounty", "GNP SDK"]
readingTime: "12 min read"
summary: "A production APK containing an exported, permission-less debug BroadcastReceiver from the GNP SDK's internal.debug namespace — 10 actions (3 hidden) providing read, write, delete, and sync access to GrowthKit state, gated only by a server-configurable Phenotype flag."
---

There is a class of vulnerability that does not require complex cryptographic inversions, nor does it demand deep protocol-level exploitation. It is the vulnerability of *something that should have been removed, but wasn't*. A debug switch left soldered to the production board. A test hook compiled into the release binary. A `TestingToolsBroadcastReceiver` sitting in `internal.debug`, exported to every application on the device, asking for no permission, waiting for a flag to flip.

I found it at 11:43 PM on May 26th, buried in the DEX of `com.google.android.apps.kids.familylink` — Google Family Link, the application that lets parents supervise their children's Android devices. The app that over 100 million families trust to enforce screen time boundaries, manage app installs, and track device location. The app whose security boundary is, presumably, designed with the gravity that protecting a child's digital experience demands.

The receiver's manifest declaration tells the story in four lines:

```xml
<receiver android:exported="true"
    android:name="com.google.android.libraries.internal.growth.growthkit
                  .internal.debug.TestingToolsBroadcastReceiver">
    <intent-filter>
        <action android:name="...ADD_PROMO"/>
```

Exported. No `android:permission`. Seven actions declared in the manifest. Three more concealed in the dispatch switch, invisible to surface auditing. All of them processing attacker-supplied protobuf payloads against persistent account-scoped storage.

---

## The Component: A Debug Console in Production Attire

Let me describe what this receiver actually exposes, because the surface area is surprisingly expansive for a component that was clearly intended for internal testing only.

The broadcast receiver handles seven manifest-declared actions and three hidden actions, organized into four operational categories:

### Read Surface — Confidentiality

Three actions return serialized internal state through `PendingResult.setResultExtras()`:

| Action | Data Exposed | Type |
|---|---|---|
| `GET_REGISTRATION_STATE` | FCM registration status codes + environment identifier strings | String extras |
| `FETCH_PROMOTIONS` | Serialized promotion/campaign protobufs (`eca` / `ebw` types) | Byte array via `Bundle.putByteArray()` |
| `FETCH_EVAL_RESULTS` | Serialized A/B test evaluation protobufs (`ebz` type) | Byte array |
| `FETCH_COUNTERS` (hidden) | Serialized analytics counters + visual element data (`eby` / `ecc` types) | Byte array |

The data returned from `FETCH_PROMOTIONS` and `FETCH_EVAL_RESULTS` is serialized protobuf — the raw bytes that Flow `PromotionStore` and `EvaluationResultStore` persist to disk. These are not summaries or redacted views. They are the complete internal representation of GrowthKit's campaign and experiment state, serialized at the protobuf boundary and handed to any caller who asks.

### Write Surface — Integrity

Two actions accept attacker-supplied protobuf payloads through the `"proto"` intent extra:

```java
// Handler i() — ADD_PROMO deserialization path (decompiled)
String account = intent.getStringExtra("account");
byte[] proto = Base64.decode(intent.getStringExtra("proto"), 0);
kaz p = kaz.p(jht.a, proto, 0, proto.length, kan.a);
kaz.F(p);                         // mergeFrom — protobuf deserialization
t(account, (jht) p, coroutine);   // persist to store
```

The `jht` protobuf — the internal representation of a promotion/campaign — is deserialized from attacker-controlled bytes and written to persistent account-scoped storage via `PromotionStore`:

```java
((egv) promotionsStore.i(account)).b(ibr.e(promoId, jhtProto));
((egv) presentedPromosStore.i(account)).a();
```

The deserialized protobuf survives the broadcast lifecycle, survives application restarts, and becomes resident in the GrowthKit persistence layer. It can then be read back via `FETCH_PROMOTIONS`, and crucially, it becomes eligible for inclusion in subsequent `SYNC`-triggered backend synchronization flows.

The `jht` protobuf schema contains approximately ten fields — message templates, campaign metadata, string identifiers, timestamps — indicating the data is architecturally positioned for downstream rendering or campaign processing pipelines.

### Destructive Surface — Availability

Three actions perform irreversible state deletion:

| Action | Target |
|---|---|
| `DELETE_PROMOS` | Removes promotions by ID list |
| `CLEAR_COUNTERS` | Clears analytics counters + visual element stores |
| `CLEAR_EVAL_RESULTS` (hidden) | Clears evaluation result data |

These actions accept no permission gate, no user confirmation dialog, no rate limiting. A malicious application on the device can systematically destroy Family Link's internal analytics and campaign state with a single broadcast.

### Hidden Actions — The Concealed Surface

Three actions — `DELETE_PROMOS`, `FETCH_COUNTERS`, and `CLEAR_EVAL_RESULTS` — are reachable through the receiver's dispatch switch but are **not declared** in the `AndroidManifest.xml` `<intent-filter>`. This means:

1. **Static analysis misses them.** Any automated manifest scanner enumerates only the seven declared actions.
2. **Implicit intent dispatch cannot reach them.** Only explicit intents (specifying the component class name) can invoke hidden actions.
3. **They are nonetheless fully functional.** The dispatch switch evaluates the action string regardless of manifest declaration.

This is security-by-obscurity applied to attack surface reduction, and it fails the moment an attacker enumerates the dispatch switch through DEX decompilation — which is precisely what this research did.

---

## The Phenotype Flag: A Server-Controlled Circuit Breaker

The receiver's execution is gated by a Phenotype flag — Google's server-side configuration system that delivers boolean toggles to Android applications at runtime:

```java
// krz.java
static { c = kkxVar.t("45628136", false); }  // default: false
```

The flag check in `ebo.bI()`:

```java
if (!krx.c()) {
    pendingResult.setResultCode(-2);  // flag disabled
    pendingResult.finish();
    return;
}
```

When the flag is `false` (current production state), every action returns `resultCode = -2` and terminates. The receiver is effectively inert.

But here is the critical architectural observation: **this is a server-configurable exposure, not a build-time-disarmed debug component**. The receiver exists in every production Family Link APK. Its behavior is determined not by a `BuildConfig.DEBUG` check compiled into the bytecode, but by a remote configuration server that Google controls. If that flag value is ever changed — through a configuration error, a staging-to-production promotion mistake, or an intentional operational decision — every Family Link installation on every device becomes exploitable simultaneously, without any application update.

The difference between `android:exported="false"` and a Phenotype flag is the difference between a locked door and a door that appears locked but whose key hangs on a hook in another room — a room whose door is also unlocked.

---

## The Proof of Concept

The attack primitive is minimal. Three ADB commands demonstrate the full inject-inspect lifecycle:

### Step 1: Verify Component Reachability

```bash
adb shell pm list packages | grep familylink
```

### Step 2: Inject Arbitrary Promotion Protobuf

```bash
adb shell am broadcast \
  -a com.google.android.libraries.internal.growth.growthkit.ADD_PROMO \
  -n com.google.android.apps.kids.familylink/.libraries.internal.growth.\
     growthkit.internal.debug.TestingToolsBroadcastReceiver \
  --es account "target@account.com" \
  --es proto "CgYIARICIAAqDAoGCAoSAjAAGAEiAA=="
```

### Step 3: Read Back Injected Data

```bash
adb shell am broadcast \
  -a com.google.android.libraries.internal.growth.growthkit.FETCH_PROMOTIONS \
  -n ...TestingToolsBroadcastReceiver \
  --es account "target@account.com"
```

The `proto` parameter is a Base64-encoded serialized `jht` protobuf. The deserialization path (`mergeFrom` → persist) will accept any valid protobuf of the expected type, regardless of field population. Empty fields, malformed timestamps, out-of-range enum values — all are accepted and persisted.

### Additional Operations

```bash
# Destroy analytics state
adb shell am broadcast \
  -a com.google.android.libraries.internal.growth.growthkit.CLEAR_COUNTERS \
  -n ...TestingToolsBroadcastReceiver

# Remove promotions by ID
adb shell am broadcast \
  -a com.google.android.libraries.internal.growth.growthkit.DELETE_PROMOS \
  -n ...TestingToolsBroadcastReceiver \
  --es account "target@account.com" \
  --esal promo_ids "promo_id_1,promo_id_2"

# Trigger backend sync
adb shell am broadcast \
  -a com.google.android.libraries.internal.growth.growthkit.SYNC \
  -n ...TestingToolsBroadcastReceiver
```

---

## Impact Analysis: Defense in Depth

Let me calibrate the severity precisely, because this finding sits at an interesting intersection of *limited direct impact* and *significant architectural concern*.

### Demonstrated Impact (when flag is `true`)

| Category | Impact |
|---|---|
| **Confidentiality** | FCM registration metadata exposure (environment identifiers, registration status codes). Internal promotion/campaign data exfiltration. Analytics counter and visual element data disclosure. |
| **Integrity** | Persistent arbitrary protobuf injection into app-internal stores via `ADD_PROMO`/`ADD_PREVIEW_PROMO`. Destructive operations (`CLEAR_COUNTERS`, `DELETE_PROMOS`, `CLEAR_EVAL_RESULTS`) without user consent. Injected data becomes eligible for backend sync. |
| **Availability** | Not demonstrated — exceptions are caught, no crash observed. |

### Defense-in-Depth Significance

What makes this finding architecturally significant is not the data exposure in isolation, but the composite risk surface:

1. **Namespace betrayal.** The component resides in `internal.debug` — a namespace explicitly intended for debug and testing functionality. Its presence in a production APK represents a failure of build configuration, ProGuard stripping rules, or SDK integration practices.

2. **Permission absence.** No `android:permission` attribute protects any of the ten actions. A zero-permission application on the device can invoke any action. In Android's permission model, this is the equivalent of an unauthenticated endpoint.

3. **Mutable gate.** Runtime security depends entirely on a single server-delivered Phenotype flag rather than compile-time component removal or Android permission enforcement. The flag's default value is `false`, which means the receiver is inert in production — but the inertness is a server configuration, not an architectural guarantee.

4. **Hidden operations.** Three actions exist outside the manifest's intent-filter declaration. They are invisible to standard surface auditing tools (`aapt`, `androidmanifest-parser`, etc.) yet fully functional through explicit intent dispatch.

5. **Simultaneous exposure surface.** If the flag value changes server-side, every Family Link installation becomes exploitable simultaneously without any application update. There is no gradual rollout, no version-gated deployment — the flag is read at runtime and applies to all clients equally.

### CVSS Score

```
CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N
Base Score: 6.1 (MEDIUM)
Vector: Local, Low Complexity, No Privileges, No User Interaction,
        Low Confidentiality, Low Integrity
```

The Medium severity reflects the local attack vector and the flag-gated execution. However, if the data injection can be shown to affect app UI or backend sync behavior, the Integrity sub-score would increase. The combination of persistent write + read + delete capabilities across multiple data stores makes this a composite integrity concern beyond a single read-only exposure.

---

## Root Cause Analysis

The root cause can be traced to a single build configuration decision: **a debug/testing component from the GNP SDK's `internal.debug` namespace was not stripped from the release build.**

The remediation path is well-understood within Android security engineering:

1. **Immediate**: Set `android:exported="false"` on `TestingToolsBroadcastReceiver`
2. **Short-term**: Add a signature-level permission (`android:protectionLevel="signature"`) to control access
3. **Medium-term**: Strip all `internal.debug` components from release builds via build configuration or ProGuard rules (`-assumenosideeffects` + `-whyareyoukeeping` analysis)
4. **Architectural**: Audit GNP SDK configuration to prevent debug components from reaching release APKs — this is a supply-chain integration failure
5. **Hidden surface**: Remove hidden actions or declare them in the manifest with appropriate protection levels
6. **Defense in depth**: Add a `BuildConfig.DEBUG` runtime guard in `onReceive()` as a second layer of defense

---

## Methodology

The finding emerged from a systematic audit of exported broadcast receivers in the top 50 Google Play applications. The approach:

1. **APK extraction**: Pulled `com.google.android.apps.kids.familylink` via `adb shell pm path`
2. **Manifest analysis**: Enumerated all exported receivers, activities, and providers via `aapt dump xmltree`
3. **DEX decompilation**: Disassembled the primary DEX container with `jadx`, focusing on receiver dispatch logic
4. **Action enumeration**: Traced the `onReceive()` switch statement to identify both declared and hidden actions
5. **Protobuf schema recovery**: Reconstructed the `jht` promotion protobuf schema through field reference tracing in decompiled bytecode
6. **Flag identification**: Located the Phenotype flag check (`krz.java`) and traced the flag key to `"45628136"`

**Testing Environment**: Samsung SM-N986W (Android 13, API 33), Family Link version current as of May 2026.

---

## What This Report Does Not Claim

I want to be precise about the boundaries of this finding. This report does **not** demonstrate:

- Access to children's GPS location, browsing history, account credentials, contacts, or screen time settings
- FCM push message interception or token theft
- UI rendering of injected content within the app
- Backend acceptance of injected protobufs
- Cross-account or multi-profile state corruption
- Privilege escalation beyond the app's existing permissions
- Crash or denial-of-service via malformed protobuf

The finding is a **debug surface exposure** — a component that should not exist in production builds, guarded by a mutable remote flag rather than architectural isolation. The impact is real if the flag flips, but the flag has not flipped. Yet.

---

## The Server Flip Problem

There is a class of vulnerability that haunts large-scale distributed systems: the **server flip**. A configuration key changed in a staging environment that propagates to production. A canary rollout that reaches 100% before the monitoring alert fires. A default value that a developer sets to `true` for local testing and accidentally commits.

Phenotype flags are Google's mechanism for gradual feature rollout and A/B testing. They are powerful, flexible, and operationally essential. But when a security control depends on a flag — when the difference between "secure" and "exploitable" is a single boolean toggled on a server — the system has substituted *architectural security* for *operational configuration*.

The TestingToolsBroadcastReceiver is not vulnerable today because a flag says it shouldn't be. But flags change. Configurations drift. Staging environments leak into production. The component itself is the vulnerability; the flag is merely the deferral.

I submitted this finding to Google's Mobile VRP at 11:43 PM on May 26th. Triaged within minutes. Duplicate on June 20th — someone else had already traced the same receiver, documented the same actions, and flagged the same Phenotype dependency.

The debug console is still in the APK. The flag is still false. The testing tools never left.

---

## References

[1] Google. (2023). Phenotype: Server-side configuration for Android applications. *Google internal documentation*.

[2] Android Open Source Project. (2024). BroadcastReceiver security guidelines. *developer.android.com/guide/components/broadcasts*.

[3] Multiple researchers. (2026). GNP SDK debug component findings in Google Family Link. *Google VRP*.
