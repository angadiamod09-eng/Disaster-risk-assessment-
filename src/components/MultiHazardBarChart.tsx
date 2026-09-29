import React from "react";
import { DISASTER_TYPES, DisasterType } from "../data/locations";

interface MultiHazardBarChartProps {
  currentDisaster: string;
  currentScore: number;
  district: string;
  village: string;
}

export const MultiHazardBarChart: React.FC<MultiHazardBarChartProps> = ({
  currentDisaster,
  currentScore,
  district,
  village
}) => {
  // Approximate scores for other hazards in this district
  const getHazardScore = (hazard: DisasterType) => {
    if (hazard === currentDisaster) return currentScore;
    
    // Sensible domain baselines per district
    if (district === "Kalaburagi" || district === "Raichur") {
      if (hazard === "Drought") return currentScore;
      if (hazard === "Forest Fire") return 48;
      if (hazard === "Flood") return 18;
      if (hazard === "Landslide") return 8;
      return 14;
    } else if (district === "Kodagu" || district === "Chikkamagaluru") {
      if (hazard === "Landslide") return 74;
      if (hazard === "Flood") return 62;
      if (hazard === "Forest Fire") return 40;
      if (hazard === "Cyclone") return 22;
      return 15;
    } else if (district === "Udupi" || district === "Uttara Kannada") {
      if (hazard === "Cyclone") return 72;
      if (hazard === "Flood") return 68;
      if (hazard === "Landslide") return 38;
      if (hazard === "Forest Fire") return 25;
      return 12;
    } else {
      // Belagavi
      if (hazard === "Flood") return 70;
      if (hazard === "Drought") return 35;
      if (hazard === "Landslide") return 20;
      if (hazard === "Forest Fire") return 25;
      return 15;
    }
  };

  const data = DISASTER_TYPES.map((h) => ({
    name: h,
    score: getHazardScore(h),
    isSelected: h === currentDisaster
  }));

  const getColor = (score: number) => {
    if (score <= 30) return "#10B981"; // green
    if (score <= 60) return "#F59E0B"; // amber
    if (score <= 80) return "#F97316"; // orange
    return "#EF4444"; // red
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-800">
            Multi-Disaster Risk Comparison
          </h4>
          <p className="text-xs text-slate-500">
            Hazard susceptibility overview for {village}
          </p>
        </div>
        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          5 Hazards Profile
        </span>
      </div>

      <div className="space-y-3 flex-1 justify-center flex flex-col">
        {data.map((item) => {
          const color = getColor(item.score);
          return (
            <div key={item.name} className="group">
              <div className="flex justify-between items-center text-xs mb-1">
                <span
                  className={`font-semibold flex items-center gap-1.5 ${
                    item.isSelected ? "text-blue-900" : "text-slate-700"
                  }`}
                >
                  {item.isSelected && (
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  )}
                  {item.name}
                  {item.isSelected && (
                    <span className="text-[10px] font-normal text-blue-600">(Current)</span>
                  )}
                </span>
                <span className="font-bold" style={{ color }}>
                  {item.score}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, item.score)}%`,
                    backgroundColor: color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Risk Threshold:</span>
        <div className="flex gap-2">
          <span className="text-emerald-700 font-medium">&lt;30% Low</span>
          <span className="text-amber-700 font-medium">31-60% Mod</span>
          <span className="text-red-700 font-medium">&gt;60% High</span>
        </div>
      </div>
    </div>
  );
};
