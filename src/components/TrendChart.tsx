import React, { useMemo } from "react";

interface TrendChartProps {
  village: string;
  disaster: string;
  currentScore: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({ village, disaster, currentScore }) => {
  // Generate deterministic 14 days historical trend ending at currentScore
  const trendData = useMemo(() => {
    const points = [];
    const seed = (village.length * 17 + disaster.length * 23) % 100;
    
    // 14 days back to today
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      
      let val;
      if (i === 0) {
        val = currentScore;
      } else {
        // Smooth random walk tethered to currentScore
        const offset = Math.sin((i + seed) * 0.8) * 12 + Math.cos((i * 2 + seed) * 0.5) * 6;
        val = Math.min(96, Math.max(8, Math.round(currentScore + offset)));
      }
      points.push({ day: dayLabel, score: val });
    }
    return points;
  }, [village, disaster, currentScore]);

  // SVG chart dimensions
  const width = 500;
  const height = 220;
  const padding = { top: 20, right: 25, bottom: 35, left: 40 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Scale functions
  const getY = (val: number) => padding.top + graphHeight - (val / 100) * graphHeight;
  const getX = (idx: number) => padding.left + (idx / (trendData.length - 1)) * graphWidth;

  const pointsString = trendData
    .map((p, idx) => `${getX(idx)},${getY(p.score)}`)
    .join(" ");

  const areaString = `${getX(0)},${padding.top + graphHeight} ${pointsString} ${getX(
    trendData.length - 1
  )},${padding.top + graphHeight}`;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-bold text-slate-800">
            14-Day Historical Risk Trend
          </h4>
          <p className="text-xs text-slate-500">
            {village} • {disaster} Risk Progression
          </p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          Simulated Telemetry
        </span>
      </div>

      <div className="relative w-full overflow-hidden flex-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-56">
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and risk zones */}
          {/* Low zone: 0 - 30 */}
          <rect x={padding.left} y={getY(30)} width={graphWidth} height={getY(0) - getY(30)} fill="#ECFDF5" opacity="0.6" />
          {/* Moderate zone: 30 - 60 */}
          <rect x={padding.left} y={getY(60)} width={graphWidth} height={getY(30) - getY(60)} fill="#FFFBEB" opacity="0.6" />
          {/* High zone: 60 - 80 */}
          <rect x={padding.left} y={getY(80)} width={graphWidth} height={getY(60) - getY(80)} fill="#FFF7ED" opacity="0.6" />
          {/* Very High zone: 80 - 100 */}
          <rect x={padding.left} y={padding.top} width={graphWidth} height={getY(80) - padding.top} fill="#FEF2F2" opacity="0.6" />

          {/* Reference threshold lines */}
          <line x1={padding.left} y1={getY(30)} x2={width - padding.right} y2={getY(30)} stroke="#10B981" strokeDasharray="3 3" strokeWidth="1" />
          <line x1={padding.left} y1={getY(60)} x2={width - padding.right} y2={getY(60)} stroke="#F59E0B" strokeDasharray="3 3" strokeWidth="1" />
          <line x1={padding.left} y1={getY(80)} x2={width - padding.right} y2={getY(80)} stroke="#EF4444" strokeDasharray="3 3" strokeWidth="1" />

          {/* Y-axis labels */}
          <text x={padding.left - 8} y={getY(0) + 3} fontSize="9" fill="#94A3B8" textAnchor="end">0%</text>
          <text x={padding.left - 8} y={getY(30) + 3} fontSize="9" fill="#10B981" textAnchor="end">30%</text>
          <text x={padding.left - 8} y={getY(60) + 3} fontSize="9" fill="#F59E0B" textAnchor="end">60%</text>
          <text x={padding.left - 8} y={getY(80) + 3} fontSize="9" fill="#EF4444" textAnchor="end">80%</text>
          <text x={padding.left - 8} y={padding.top + 3} fontSize="9" fill="#94A3B8" textAnchor="end">100%</text>

          {/* Shaded Area */}
          <polygon points={areaString} fill="url(#trendGradient)" />

          {/* Line Path */}
          <polyline
            fill="none"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsString}
          />

          {/* Points */}
          {trendData.map((p, idx) => {
            const isToday = idx === trendData.length - 1;
            return (
              <g key={idx}>
                <circle
                  cx={getX(idx)}
                  cy={getY(p.score)}
                  r={isToday ? 4.5 : 2.5}
                  fill={isToday ? "#DC2626" : "#2563EB"}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                {/* Show label every 3 days and on current */}
                {(idx % 3 === 0 || isToday) && (
                  <text
                    x={getX(idx)}
                    y={height - 12}
                    fontSize="8.5"
                    fill="#64748B"
                    textAnchor="middle"
                  >
                    {p.day}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          <span>Risk Level Trajectory</span>
        </div>
        <div>
          Current: <strong className="text-slate-800">{currentScore}%</strong>
        </div>
      </div>
    </div>
  );
};
