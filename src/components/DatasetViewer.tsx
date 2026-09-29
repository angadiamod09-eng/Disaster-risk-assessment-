import React, { useState, useMemo } from "react";
import { ALL_RECORDS, DisasterRecord } from "../data/recordsService";
import { Download, Search, Filter, Database, ArrowUpDown } from "lucide-react";

export const DatasetViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisaster, setSelectedDisaster] = useState<string>("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [sortField, setSortField] = useState<keyof DisasterRecord>("Risk_Score");
  const [sortAsc, setSortAsc] = useState(false);

  // Available options
  const districts = useMemo(() => {
    return Array.from(new Set(ALL_RECORDS.map((r) => r.District))).sort();
  }, []);

  const disasters = useMemo(() => {
    return Array.from(new Set(ALL_RECORDS.map((r) => r.Disaster_Type))).sort();
  }, []);

  const riskLevels = ["Low Risk", "Moderate Risk", "High Risk", "Very High Risk"];

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return ALL_RECORDS.filter((r) => {
      if (selectedDisaster !== "ALL" && r.Disaster_Type !== selectedDisaster) return false;
      if (selectedDistrict !== "ALL" && r.District !== selectedDistrict) return false;
      if (selectedLevel !== "ALL" && r.Risk_Level !== selectedLevel) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match =
          r.Village.toLowerCase().includes(q) ||
          r.Taluk.toLowerCase().includes(q) ||
          r.District.toLowerCase().includes(q) ||
          r.Date.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      let valA: string | number = a[sortField];
      let valB: string | number = b[sortField];

      if (sortField === "Risk_Score") {
        valA = parseFloat(valA as string) || 0;
        valB = parseFloat(valB as string) || 0;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [searchTerm, selectedDisaster, selectedDistrict, selectedLevel, sortField, sortAsc]);

  // Statistics
  const stats = useMemo(() => {
    if (filteredRecords.length === 0) return { avg: 0, highCount: 0 };
    const sum = filteredRecords.reduce((acc, r) => acc + (parseFloat(r.Risk_Score) || 0), 0);
    const avg = Math.round((sum / filteredRecords.length) * 10) / 10;
    const highCount = filteredRecords.filter(
      (r) => r.Risk_Level === "High Risk" || r.Risk_Level === "Very High Risk"
    ).length;
    return { avg, highCount };
  }, [filteredRecords]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(start, start + rowsPerPage);
  }, [filteredRecords, currentPage, rowsPerPage]);

  const handleSort = (field: keyof DisasterRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Country",
      "State",
      "District",
      "Taluk",
      "Village",
      "Date",
      "Disaster_Type",
      "Rainfall_mm",
      "Temperature_C",
      "Humidity_pct",
      "Soil_Moisture_pct",
      "Water_Level_m",
      "Wind_Speed_kmh",
      "Atmospheric_Pressure_hPa",
      "Slope_Degree",
      "Smoke_Level",
      "Risk_Score",
      "Risk_Level"
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.Country}"`,
      `"${r.State}"`,
      `"${r.District}"`,
      `"${r.Taluk}"`,
      `"${r.Village}"`,
      `"${r.Date}"`,
      `"${r.Disaster_Type}"`,
      r.Rainfall_mm ?? "",
      r.Temperature_C ?? "",
      r.Humidity_pct ?? "",
      r.Soil_Moisture_pct ?? "",
      r.Water_Level_m ?? "",
      r.Wind_Speed_kmh ?? "",
      r.Atmospheric_Pressure_hPa ?? "",
      r.Slope_Degree ?? "",
      r.Smoke_Level ?? "",
      r.Risk_Score,
      `"${r.Risk_Level}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `disaster_risk_dataset_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case "Low Risk":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Moderate Risk":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "High Risk":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Stats bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-base">
              Disaster Telemetry Dataset Explorer
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstration CSV & SQLite data covering Karnataka districts ({ALL_RECORDS.length} total synthetic records)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500">Filtered:</span>
            <strong className="text-slate-800">{filteredRecords.length}</strong>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Avg Risk:</span>
            <strong className="text-blue-700">{stats.avg}%</strong>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">High Risk:</span>
            <strong className="text-red-700">{stats.highCount}</strong>
          </div>

          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download Analyzed Results (CSV)
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search village, taluk..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-slate-800"
          />
        </div>

        <div>
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 bg-white"
          >
            <option value="ALL">All Districts ({districts.length})</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedDisaster}
            onChange={(e) => {
              setSelectedDisaster(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 bg-white"
          >
            <option value="ALL">All Hazards ({disasters.length})</option>
            {disasters.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-slate-800 bg-white"
          >
            <option value="ALL">All Risk Levels</option>
            {riskLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold sticky top-0 border-b border-slate-200 z-10">
              <tr>
                <th
                  className="px-3 py-2 cursor-pointer hover:bg-slate-200"
                  onClick={() => handleSort("Village")}
                >
                  <div className="flex items-center gap-1">
                    Village / Taluk
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="px-3 py-2 cursor-pointer hover:bg-slate-200"
                  onClick={() => handleSort("District")}
                >
                  <div className="flex items-center gap-1">
                    District
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="px-3 py-2 cursor-pointer hover:bg-slate-200"
                  onClick={() => handleSort("Disaster_Type")}
                >
                  <div className="flex items-center gap-1">
                    Hazard
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2 text-right">Rain (mm)</th>
                <th className="px-3 py-2 text-right">Temp (°C)</th>
                <th className="px-3 py-2 text-right">Humidity (%)</th>
                <th className="px-3 py-2 text-right">Soil Moist (%)</th>
                <th className="px-3 py-2 text-right">Water Lvl (m)</th>
                <th className="px-3 py-2 text-right">Wind (km/h)</th>
                <th
                  className="px-3 py-2 text-right cursor-pointer hover:bg-slate-200"
                  onClick={() => handleSort("Risk_Score")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Risk Score
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-3 py-2 text-center">Risk Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-slate-400">
                    No matching disaster records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 font-medium text-slate-900">
                      {row.Village}
                      <span className="text-[10px] text-slate-500 block">
                        {row.Taluk}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-700">{row.District}</td>
                    <td className="px-3 py-2 font-semibold text-slate-800">
                      {row.Disaster_Type}
                    </td>
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap">
                      {row.Date}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600">
                      {row.Rainfall_mm ? `${row.Rainfall_mm}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600">
                      {row.Temperature_C ? `${row.Temperature_C}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600">
                      {row.Humidity_pct ? `${row.Humidity_pct}%` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600">
                      {row.Soil_Moisture_pct ? `${row.Soil_Moisture_pct}%` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600">
                      {row.Water_Level_m ? `${row.Water_Level_m}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600">
                      {row.Wind_Speed_kmh ? `${row.Wind_Speed_kmh}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-slate-900">
                      {row.Risk_Score}%
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getBadgeStyle(
                          row.Risk_Level
                        )}`}
                      >
                        {row.Risk_Level}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, filteredRecords.length)} of{" "}
            {filteredRecords.length} records
          </div>

          <div className="flex items-center gap-2">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-slate-300 rounded bg-white text-xs"
            >
              <option value={10}>10 / page</option>
              <option value={15}>15 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>

            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 border border-slate-300 rounded bg-white disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
            >
              Prev
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 border border-slate-300 rounded bg-white disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
