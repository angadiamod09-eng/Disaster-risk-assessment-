import React from "react";
import { RiskLevel } from "../utils/riskEngine";

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  disaster: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, disaster }) => {
  // Semi-circle gauge (180 degrees, from -90 to +90 or 180 to 360)
  // Angle for 0..100 -> -180 to 0 degrees in SVG coordinates
  const radius = 80;
  const strokeWidth = 14;
  const center = 100;
  const circumference = Math.PI * radius; // 180 deg arc length
  const progressOffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  let color = "#10B981"; // green
  if (level === "Moderate Risk") color = "#F59E0B";
  else if (level === "High Risk") color = "#F97316";
  else if (level === "Very High Risk") color = "#EF4444";

  // Needle angle: 0% is -90 deg (left), 100% is +90 deg (right)
  const needleAngle = -90 + (score / 100) * 180;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
      <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1">
        {disaster} Risk Gauge
      </div>

      <div className="relative w-56 h-36 flex items-center justify-center">
        <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="35%" stopColor="#FBBF24" />
              <stop offset="70%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Background track (semi-circle) */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active colored arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />

          {/* Threshold markers */}
          {/* 30% -> angle = -90 + 0.3*180 = -36 deg */}
          {/* 60% -> angle = -90 + 0.6*180 = +18 deg */}
          {/* 80% -> angle = -90 + 0.8*180 = +54 deg */}

          {/* Center needle pivot */}
          <circle cx={center} cy={100} r="6" fill="#1E293B" />
          
          {/* Needle */}
          <g transform={`rotate(${needleAngle} ${center} 100)`} className="transition-transform duration-500 ease-out">
            <line x1={center} y1={100} x2={center} y2={28} stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <polygon points={`${center},24 ${center-4},36 ${center+4},36`} fill="#1E293B" />
          </g>

          {/* Bottom Labels */}
          <text x="22" y="116" fontSize="9" fill="#64748B" textAnchor="middle">0%</text>
          <text x="100" y="70" fontSize="10" fill="#94A3B8" textAnchor="middle" fontWeight="bold">50%</text>
          <text x="178" y="116" fontSize="9" fill="#64748B" textAnchor="middle">100%</text>
        </svg>

        {/* Big Score Overlay */}
        <div className="absolute bottom-1 text-center">
          <span className="text-3xl font-black tracking-tight" style={{ color }}>
            {score}%
          </span>
        </div>
      </div>

      {/* Threshold Guide */}
      <div className="grid grid-cols-4 gap-1 w-full mt-2 text-[10px] text-center font-medium">
        <span className="text-emerald-700 bg-emerald-50 py-0.5 rounded border border-emerald-100">0-30% Low</span>
        <span className="text-amber-700 bg-amber-50 py-0.5 rounded border border-amber-100">31-60% Mod</span>
        <span className="text-orange-700 bg-orange-50 py-0.5 rounded border border-orange-100">61-80% High</span>
        <span className="text-red-700 bg-red-50 py-0.5 rounded border border-red-100">81-100% Very</span>
      </div>
    </div>
  );
};
