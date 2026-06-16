import { campaignBars, revenueSeries, sourceBreakdown } from "./data";

const toneColors: Record<string, string> = {
  gold: "#f2b84b",
  violet: "#9b5cff",
  blue: "#6688ff",
  mint: "#5ce0bd",
  orange: "#ff7b32",
  rose: "#f24f87",
};

export function Sparkline({ points, tone = "gold" }: { points: number[]; tone?: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const path = points.map((point, index) => {
    const x = (index / (points.length - 1)) * 100;
    const y = 34 - ((point - min) / Math.max(1, max - min)) * 28;
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
  const color = toneColors[tone] ?? toneColors.gold;

  return (
    <svg viewBox="0 0 100 38" className="h-12 w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`spark-${tone}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L100 38 L0 38 Z`} fill={`url(#spark-${tone})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, index) => {
        if (index !== points.length - 1 && index !== 4) return null;
        const x = (index / (points.length - 1)) * 100;
        const y = 34 - ((point - min) / Math.max(1, max - min)) * 28;
        return <circle key={`${tone}-${index}`} cx={x} cy={y} r="1.8" fill={color} />;
      })}
    </svg>
  );
}

export function RevenueLineChart() {
  const max = 65000;
  const revenuePath = revenueSeries.map((item, index) => {
    const x = 34 + index * 75;
    const y = 164 - (item.revenue / max) * 132;
    return `${index === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`;
  }).join(" ");
  const profitPath = revenueSeries.map((item, index) => {
    const x = 34 + index * 75;
    const y = 164 - (item.profit / max) * 132;
    return `${index === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`;
  }).join(" ");

  return (
    <div className="relative h-[260px] w-full overflow-hidden rounded-b-[22px]">
      <svg viewBox="0 0 540 220" className="h-full w-full" aria-label="Revenue and profit line chart">
        <defs>
          <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f2b84b" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#f2b84b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => (
          <line key={line} x1="34" x2="500" y1={32 + line * 44} y2={32 + line * 44} stroke="rgba(246,238,222,0.07)" />
        ))}
        {["€60K", "€40K", "€20K", "€0"].map((label, index) => (
          <text key={label} x="0" y={36 + index * 44} fill="rgba(246,238,222,0.68)" fontSize="11">{label}</text>
        ))}
        <path d={`${revenuePath} L484 178 L34 178 Z`} fill="url(#revenueFill)" />
        <path d={revenuePath} fill="none" stroke="#f2b84b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={profitPath} fill="none" stroke="rgba(211,187,139,0.55)" strokeWidth="1.7" strokeDasharray="5 5" strokeLinecap="round" strokeLinejoin="round" />
        {revenueSeries.map((item, index) => (
          <g key={item.day}>
            <circle cx={34 + index * 75} cy={164 - (item.revenue / max) * 132} r="3.2" fill="#f2b84b" />
            <text x={21 + index * 75} y="207" fill="rgba(246,238,222,0.62)" fontSize="11">{item.day}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function DonutChart() {
  const radius = 43;
  const circumference = 2 * Math.PI * radius;
  const segments = sourceBreakdown.map((item, index) => {
    const previous = sourceBreakdown.slice(0, index).reduce((sum, segment) => sum + segment.value, 0);
    return { ...item, offset: 25 + (previous / 100) * circumference };
  });

  return (
    <div className="relative grid min-h-[235px] grid-cols-[170px_1fr] items-center gap-6 max-sm:grid-cols-1">
      <div className="relative mx-auto h-[168px] w-[168px]">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-label="Revenue by source donut chart">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(246,238,222,0.08)" strokeWidth="20" />
          {segments.map((item) => {
            const dash = (item.value / 100) * circumference;
            return (
              <circle
                key={item.label}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="20"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-item.offset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <strong className="text-2xl text-[#fbf5ea]">€48,529</strong>
          <span className="text-xs text-[#8f969f]">Total</span>
        </div>
      </div>
      <div className="space-y-4">
        {sourceBreakdown.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 text-sm text-[#f7efe2]">
            <span className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</span>
            <span>{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CampaignChart() {
  const maxRevenue = Math.max(...campaignBars.map((item) => item.revenue));
  const maxConversions = Math.max(...campaignBars.map((item) => item.conversions));
  const linePath = campaignBars.map((item, index) => {
    const x = 35 + index * 57;
    const y = 116 - (item.conversions / maxConversions) * 86;
    return `${index === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 420 150" className="h-[205px] w-full" aria-label="Campaign analytics bar and line chart">
      {[0, 1, 2].map((line) => <line key={line} x1="28" x2="400" y1={34 + line * 42} y2={34 + line * 42} stroke="rgba(246,238,222,0.07)" />)}
      {campaignBars.map((item, index) => {
        const height = (item.revenue / maxRevenue) * 62;
        const x = 25 + index * 57;
        return (
          <g key={item.day}>
            <rect x={x} y={116 - height} width="20" height={height} rx="3" fill="#d9a641" opacity="0.9" />
            <text x={x - 5} y="140" fill="rgba(246,238,222,0.64)" fontSize="10">{item.day}</text>
          </g>
        );
      })}
      <path d={linePath} fill="none" stroke="#8f4ed7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {campaignBars.map((item, index) => <circle key={`${item.day}-point`} cx={35 + index * 57} cy={116 - (item.conversions / maxConversions) * 86} r="3" fill="#8f4ed7" />)}
    </svg>
  );
}
