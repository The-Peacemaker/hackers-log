---
title: "Predicting the Unpredictable: Building a Production ML System for Visa Processing Time Estimation"
date: "2026-07-21"
category: "Open Source"
tags: ["Python", "Machine Learning", "React", "Flask", "Random Forest", "Deployment"]
readingTime: "14 min read"
summary: "A comprehensive machine learning system deployed to production that predicts visa application processing times from 12 applicant attributes — trained on 25,480 historical records, achieving R² 0.87 with a Random Forest regressor, served through a React SPA on Netlify with a Flask inference API on Vercel."
---

Visa applicants face a uniquely opaque uncertainty: *how long will it take?* The answer depends on a tangled web of factors — continent of origin, education level, employer characteristics, wage category, seasonal processing volumes — that no single applicant can quantify. The US Department of State publishes aggregate processing times by visa category, but these averages obscure the variance driven by applicant-specific attributes.

I wanted to build something that dissolves that opacity. A system where an applicant enters their profile once and receives a data-driven estimate grounded in 25,480 historical records, with confidence intervals, trend visualizations, and continental comparisons — all served through a polished React SPA connected to a serverless ML inference pipeline.

The result is **Visa Status Prediction**, deployed at [visa-status-prediction.netlify.app](https://visa-status-prediction.netlify.app/) with a live API at [visa-status-prediction.vercel.app](https://visa-status-prediction.vercel.app/).

> **Source code**: [github.com/The-Peacemaker/VISA-STATUS-PREDICTION](https://github.com/The-Peacemaker/VISA-STATUS-PREDICTION) — MIT license. Full-stack ML project with React frontend, Flask API, and scikit-learn model.

---

## The Dataset: 25,480 Records of Institutional Knowledge

The foundation is the EasyVisa public dataset — 25,480 historical visa application records with 12 input attributes spanning applicant demographics, employer context, and job characteristics. The original dataset contained categorical attributes but no explicit processing time target. I synthesized a realistic `processing_time_days` variable through a domain-aware generative process that encodes known biases in the immigration system:

- **Continental baselines**: Asia and Africa receive baseline processing times 15–25 days longer than Europe or North America, reflecting known consular processing capacity disparities
- **Education weighting**: Master's and PhD applicants receive a 5–10 day reduction, modeling the premium for advanced degrees in certain visa categories
- **Wage effects**: Higher prevailing wages correlate with faster processing in employment-based categories
- **Temporal noise**: Seasonal variations encoded through monthly sinusoidal components
- **Stochastic variance**: Log-normal noise preserves the heavy-tailed distribution characteristic of real processing times

The synthetic target is not a perfect substitute for ground-truth data, but it captures the *relative structure* of processing time determinants — which is sufficient for building and evaluating a predictive system architecture.

```
Dataset/
├── EasyVisa.csv                   # 25,480 records, 12 features
├── visa_data_preprocessed.csv      # Cleaned, missing values handled
└── visa_data_encoded.csv          # One-hot + label encoded for ML
```

---

## Feature Engineering: Extracting Signal from Institutional Data

Raw categorical attributes cannot be fed directly into a regression model. The feature engineering pipeline constructed 23 columns across three transformation categories:

### Temporal Features

$$\text{application\_month} = \text{month}(\text{application\_date})$$

$$\text{season} = \begin{cases} \text{Winter} & \text{if month} \in \{12,1,2\} \\ \text{Spring} & \text{if month} \in \{3,4,5\} \\ \text{Summer} & \text{if month} \in \{6,7,8\} \\ \text{Fall} & \text{if month} \in \{9,10,11\} \end{cases}$$

### Geographical Baselines

$$\text{continent\_avg} = \frac{1}{|C|} \sum_{i \in C} \text{processing\_time\_days}_i$$

$$\text{education\_avg} = \frac{1}{|E|} \sum_{i \in E} \text{processing\_time\_days}_i$$

These baseline encodings inject global statistical context into each individual prediction — the model learns not just that an applicant is from Asia, but that Asian applicants experience a specific *average* processing delay relative to the global mean.

### Economic Indicators

$$\text{wage\_category\_index} = \lfloor \log_{10}(\text{prevailing\_wage}) \rfloor$$

The wage category index bins prevailing wages into logarithmic buckets, capturing the non-linear relationship between income and processing priority in employment-based visa categories.

---

## Model Selection: Random Forest Regressor

Three candidate architectures were evaluated across 5-fold cross-validation:

| Model | MAE (days) | RMSE (days) | R² |
|---|---|---|---|
| Linear Regression | 7.8 | 11.2 | 0.52 |
| Random Forest (50 estimators) | 4.5 | 6.8 | 0.84 |
| Random Forest (200 estimators) | 4.2 | 6.1 | 0.87 |

The Random Forest regressor with 200 estimators was selected as the production champion. Its advantage over linear regression is structural: visa processing times exhibit non-linear interactions between categorical variables that a linear decision boundary cannot capture. A Master's degree from Asia has a different effect than a Master's degree from Europe — the Random Forest's ensemble of decision trees naturally models these interaction effects without explicit feature engineering.

The selected model achieves:

- **MAE: ~4.2 days** — average prediction error is under a work week
- **RMSE: ~6.1 days** — penalizes larger outliers appropriately
- **R²: 0.87** — explains 87% of variance in historical processing times
- **5-fold CV stability**: Standard deviation of R² across folds < 0.03

### Feature Importance

```
Continent (Asia/Africa/Europe)       0.31  ← Regional processing capacity
Education level                      0.18  ← Degree-based prioritization
Wage category                        0.15  ← Economic indicator
Application month                    0.12  ← Seasonal volume patterns
Company establishment year           0.10  ← Organizational maturity
Region of employment                 0.08  ← Local USCIS workload
Number of employees                  0.06  ← Company size effects
```

The dominance of continent as a predictive feature is not noise — it reflects a structural reality of global immigration processing. Consular capacity, bilateral relations, and per-country visa quotas create systematic processing time differentials that no individual applicant attribute can overcome. The model learns this from the data, which is exactly what makes it useful: it tells applicants the truth about systemic delays rather than promising a processing time that ignores geopolitical reality.

---

## System Architecture: Full-Stack ML Deployment

The system follows a modern three-tier architecture:

```
┌──────────────────────────────────────────────────────┐
│              User Browser (React SPA)                  │
│  https://visa-status-prediction.netlify.app            │
│                                                        │
│  • React 18 + Vite SPA                                 │
│  • Tailwind CSS + Framer Motion                        │
│  • Recharts visualization (confidence gauge, trends)   │
│  • localStorage prediction history                     │
└──────────────────────┬─────────────────────────────────┘
                       │ POST /api/predict (CORS)
                       ↓
┌──────────────────────────────────────────────────────┐
│        Vercel Serverless (Flask API)                   │
│  https://visa-status-prediction.vercel.app             │
│                                                        │
│  • Flask microservice (Python 3.11)                    │
│  • scikit-learn inference pipeline                     │
│  • Cold-start optimized (<500ms warm latency)          │
│  • Auto-scaling serverless functions                   │
└──────────────────────┬─────────────────────────────────┘
                       │ Model loading
                       ↓
┌──────────────────────────────────────────────────────┐
│        ML Model Layer (joblib)                         │
│                                                        │
│  • best_model.joblib (Random Forest, 200 estimators)   │
│  • scaler.joblib (StandardScaler, fitted)              │
│  • Feature engineering pipeline (pandas transforms)    │
└──────────────────────────────────────────────────────┘
```

### Frontend: React + Vite SPA

The frontend is a single-page application with three primary routes:

**HomePage** — Product landing page with feature highlights, system architecture diagram, and call-to-action leading to the prediction dashboard.

**DashboardPage** — The core prediction interface. A multi-field form captures the 12 applicant attributes. On submission, the form data is serialized to JSON and POSTed to the Vercel API endpoint. The response renders three visualization components:

- **Confidence Gauge**: A circular gauge (Recharts) displaying the prediction in days with a confidence band
- **Trend Chart**: Month-by-month processing time forecast for the applicant's profile
- **Continental Comparison**: Bar chart comparing the predicted processing time across continents for the same applicant profile

```jsx
// Prediction submission flow (DashboardPage.jsx)
const handleSubmit = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  const result = await response.json();
  setPrediction(result.predicted_days);
  setConfidence(result.confidence_score);
};
```

**HistoryPage** — All prior predictions are stored in `localStorage` and displayed in a searchable, filterable table with export capability.

### Backend: Flask Serverless on Vercel

The API is a minimal Flask application deployed as a Vercel serverless function:

```python
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = engineer_features(data)  # pandas transformation
    scaled = scaler.transform(features)
    prediction = model.predict(scaled)[0]
    confidence = compute_confidence(prediction, model)
    return jsonify({
        'predicted_days': round(prediction, 1),
        'confidence_score': round(confidence, 2),
        'trend': generate_trend(data, model, scaler),
        'regional_comparison': compare_regions(data, model, scaler)
    })
```

The `predictor.py` module contains all feature engineering logic — identical transformations applied during training and inference, ensuring prediction consistency.

The API response includes not just the point estimate but three additional analytical dimensions:

- **`trend`**: Month-by-month predictions showing how processing time varies seasonally for the given profile
- **`regional_comparison`**: What-if analysis showing predicted times if the applicant were from each continent
- **`confidence_score`**: Uncertainty quantification based on the model's forest variance

### Deployment Topology

| Layer | Platform | Configuration |
|---|---|---|
| Static assets | Netlify CDN | Global edge network, instantaneous cache invalidation |
| Frontend | Netlify | `netlify.toml` with SPA redirect rules |
| API | Vercel | Serverless functions, `vercel.json` with Python runtime |
| Model artifacts | Vercel | Included in deployment bundle (< 50 MB) |
| Environment | Vercel | `VITE_API_BASE_URL` injected at build time |

---

## The API Contract

```bash
curl -X POST https://visa-status-prediction.vercel.app/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "continent": "Asia",
    "education_of_employee": "Master'\''s",
    "has_job_experience": "Y",
    "requires_job_training": "N",
    "no_of_employees": 500,
    "yr_of_estab": 2010,
    "region_of_employment": "West",
    "prevailing_wage": 4200,
    "unit_of_wage": "Month",
    "full_time_position": "Y",
    "application_month": 5
  }'
```

```json
{
  "predicted_days": 187.3,
  "confidence_score": 0.84,
  "trend": [
    {"month": "Jan", "days": 178},
    {"month": "Feb", "days": 182},
    {"month": "Mar", "days": 185},
    {"month": "Apr", "days": 187},
    {"month": "May", "days": 191},
    {"month": "Jun", "days": 195}
  ],
  "regional_comparison": [
    {"continent": "Asia", "days": 187},
    {"continent": "Africa", "days": 201},
    {"continent": "Europe", "days": 112},
    {"continent": "North America", "days": 94},
    {"continent": "South America", "days": 134},
    {"continent": "Australia", "days": 108}
  ]
}
```

The API returns a prediction of 187 days for a Master's-level applicant from Asia — a value grounded in the historical distribution and contextualized through trend and regional comparison. The confidence score of 0.84 tells the applicant that the model has high (but not absolute) certainty in this estimate, deriving from the forest's consensus across its 200 constituent trees.

---

## Testing: The Unit Test Plan

Every component of the system is validated through a structured unit test plan:

- **Data Pipeline Tests**: Feature engineering consistency across training and inference paths
- **Model Tests**: Prediction determinism, shape correctness, value range validation
- **API Tests**: HTTP status codes, response schema, error handling for malformed inputs
- **Frontend Tests**: Component rendering state management

The test plan is documented in `Documents/Unit_Test_Plan_v0.1.xlsx` with 42 individual test cases spanning all four testing quadrants.

---

## The Agile Documentation

The project was developed across four milestones following an Agile methodology:

| Milestone | Duration | Deliverables |
|---|---|---|
| M1: Data Preprocessing | 2 weeks | Cleaned dataset, synthetic target generation |
| M2: EDA & Feature Engineering | 2 weeks | 7+ visualizations, 23 engineered columns |
| M3: Model Building | 2 weeks | Random Forest champion, 5-fold CV evaluation |
| M4: Web Application | 3 weeks | React SPA, Flask API, Netlify + Vercel deployment |

The Agile documentation (`Documents/Benedict_Agile_Documentation.xls`) captures sprint planning, task tracking, velocity metrics, and retrospective insights across all four milestones.

---

## What Building This Taught Me

**1. Synthetic targets are a research tool, not a production data source.** The synthesized `processing_time_days` captures relative structure but cannot substitute for ground-truth USCIS processing data. The model's R² of 0.87 measures how well it predicts the synthetic target — actual performance on real processing times would need validation against official data.

**2. Serverless ML inference forces uncomfortable tradeoffs.** The Vercel serverless cold start adds ~500ms to every prediction after idle periods. For a visa prediction tool used sporadically, this means most users experience the cold-start latency. A warm provisioned concurrency (AWS Lambda SnapStart or GCP Cloud Run min instances) would eliminate this, but adds operational cost and complexity.

**3. The model encodes institutional bias.** Continent is the dominant feature because the data reflects a system that processes applicants differently based on nationality. A model that predicts processing times with high accuracy is, by construction, a model that reproduces the structural disparities in the training data. The system does not attempt to correct for this — it reports it transparently through the regional comparison visualization, allowing applicants to see the systemic differences rather than hiding them behind a single number.

---

## References

[1] Breiman, L. (2001). Random Forests. *Machine Learning*, 45(1), 5–32.

[2] US Department of State. (2024). Visa Processing Time Estimates. *travel.state.gov*.

[3] EasyVisa Dataset. Public domain visa application records.

[4] scikit-learn developers. (2023). Random Forest Regressor documentation. *scikit-learn.org*.
