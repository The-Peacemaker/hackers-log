'use client';

export default function TopBar() {
  return (
    <div
      className="px-4 py-2 text-xs flex justify-between items-center select-none transition-all duration-500"
      style={{
        backgroundColor: 'var(--curr-line)',
        borderBottom: '1px solid var(--bg)',
      }}
    >
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--red)' }}></div>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--yellow)' }}></div>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--green)' }}></div>
      </div>
      <div className="opacity-50 font-bold">ranger :: root@benedict</div>
      <div className="text-[10px] opacity-50">/var/logs/public</div>
    </div>
  );
}
