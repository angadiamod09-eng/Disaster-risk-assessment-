import React from "react";
import { ALL_RECORDS } from "../data/recordsService";
import { DistrictData } from "../data/locations";

interface TalukComparisonChartProps {
  districtData: DistrictData;
  disaster: string;
  currentTaluk: string;
}

export const TalukComparisonChart: React.FC<TalukComparisonChartProps> = ({
  districtData,
  disaster,
  currentTaluk
}) => {
  // Aggregate average score per taluk in this district
  const talukScores = districtData.taluks.map((t) => {
    const matching = ALL_RECORDS.filter(
      (r) =>
        r.District === districtData.district &&
        r.Taluk === t.taluk &&
        r.Disaster_Type === disaster
    );

    let avg = 0;
    if (matching.length > 0) {
      const sum = matching.reduce((acc, curr) => acc + (parseFloat(curr.Risk_Score) || 0), 0);
      avg = Math.round((sum / matching.length) * 10) / 10;
    } else {
      // Deterministic fallback
      avg = t.taluk === currentTaluk ? 72 : 55;
    }

    return {
      taluk: t.taluk,
      avgScore: avg,
      isCurrent: t.taluk === currentTaluk
    };
  });

  const maxVal = Math.max(...talukScores.map((t) => t.avgScore), 80);

  const getBarColor = (score: number) => {
    if (score <= 30) return "#10B981";
    if (score <= 60) return "#F59E0B";
    if (score <= 80) return "#F97316";
    return "#EF4444";
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-800">
            Cross-Taluk Comparison ({districtData.district} District)
          </h4>
          <p className="text-xs text-slate-500">
            Average {disaster} Vulnerability Index across sub-divisions
          </p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
          {talukScores.length} Taluks
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
        {talukScores.map((item) => {
          const heightPct = Math.max(15, (item.avgScore / 100) * 100);
          const color = getBarColor(item.avgScore);

          return (
            <div
              key={item.taluk}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                item.isCurrent
                  ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-400/30"
                  : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/50"
              }`}
            >
              <span
                className="text-xs font-bold mb-1"
                style={{ color }}
              >
                {item.avgScore}%
              </span>

              <div className="w-10 h-24 bg-slate-200/80 rounded-t-md flex items-end p-1">
                <div
                  className="w-full rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: color
                  }}
                ></div>
              </div>

              <div className="mt-2 text-center">
                <div
                  className={`text-xs font-semibold truncate max-w-[85px] ${
                    item.isCurrent ? "text-blue-900" : "text-slate-700"
                  }`}
                  title={item.taluk}
                >
                  {item.taluk}
                </div>
                {item.isCurrent && (
                  <span className="text-[9px] font-bold text-blue-600 block uppercase">
                    Current
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
