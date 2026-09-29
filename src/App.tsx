import React, { useState, useMemo } from "react";
import {
  KARNATAKA_LOCATION_DATA,
  DISASTER_TYPES,
  DisasterType
} from "./data/locations";
import {
  calculateFloodRisk,
  calculateDroughtRisk,
  calculateLandslideRisk,
  calculateForestFireRisk,
  calculateCycloneRisk,
  RiskAssessmentResult
} from "./utils/riskEngine";
import { getRecordForVillage } from "./data/recordsService";
import { RiskGauge } from "./components/RiskGauge";
import { TrendChart } from "./components/TrendChart";
import { MultiHazardBarChart } from "./components/MultiHazardBarChart";
import { TalukComparisonChart } from "./components/TalukComparisonChart";
import { DatasetViewer } from "./components/DatasetViewer";
import { AcademicReport } from "./components/AcademicReport";
import { ProjectFilesViewer } from "./components/ProjectFilesViewer";
import {
  ShieldAlert,
  Sliders,
  RotateCcw,
  Sparkles,
  Download,
  MapPin,
  Flame,
  Droplets,
  Mountain,
  Sun,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Info
} from "lucide-react";

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "analytics" | "dataset" | "academics" | "sourcecode"
  >("dashboard");

  // Location hierarchy state
  const selectedCountry = "India";
  const selectedState = "Karnataka";
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Kalaburagi");
  const [selectedTaluk, setSelectedTaluk] = useState<string>("Chittapur");
  const [selectedVillage, setSelectedVillage] = useState<string>("Alura");
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterType>("Drought");

  // Environmental parameter sliders state
  const [rainfall, setRainfall] = useState<number>(6.2);
  const [waterLevel, setWaterLevel] = useState<number>(1.2);
  const [soilMoisture, setSoilMoisture] = useState<number>(16.5);
  const [temperature, setTemperature] = useState<number>(41.5);
  const [humidity, setHumidity] = useState<number>(26.0);
  const [windSpeed, setWindSpeed] = useState<number>(18.0);
  const [pressure, setPressure] = useState<number>(1010.0);
  const [slope, setSlope] = useState<number>(12.0);
  const [smokeLevel, setSmokeLevel] = useState<number>(2.0);

  // Geographic helpers
  const currentDistrictData = useMemo(() => {
    return (
      KARNATAKA_LOCATION_DATA.find((d) => d.district === selectedDistrict) ||
      KARNATAKA_LOCATION_DATA[0]
    );
  }, [selectedDistrict]);

  const availableTaluks = useMemo(() => {
    return currentDistrictData.taluks.map((t) => t.taluk);
  }, [currentDistrictData]);

  const currentTalukData = useMemo(() => {
    return (
      currentDistrictData.taluks.find((t) => t.taluk === selectedTaluk) ||
      currentDistrictData.taluks[0]
    );
  }, [currentDistrictData, selectedTaluk]);

  const availableVillages = useMemo(() => {
    return currentTalukData.villages;
  }, [currentTalukData]);

  // Handle District Change
  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const newDist = KARNATAKA_LOCATION_DATA.find((d) => d.district === distName)!;
    const firstTaluk = newDist.taluks[0];
    setSelectedTaluk(firstTaluk.taluk);
    setSelectedVillage(firstTaluk.villages[0]);
    loadDefaultEnvValues(firstTaluk.villages[0], firstTaluk.taluk, distName, selectedDisaster);
  };

  // Handle Taluk Change
  const handleTalukChange = (talukName: string) => {
    setSelectedTaluk(talukName);
    const talukObj = currentDistrictData.taluks.find((t) => t.taluk === talukName);
    if (talukObj) {
      setSelectedVillage(talukObj.villages[0]);
      loadDefaultEnvValues(talukObj.villages[0], talukName, selectedDistrict, selectedDisaster);
    }
  };

  // Handle Village Change
  const handleVillageChange = (villageName: string) => {
    setSelectedVillage(villageName);
    loadDefaultEnvValues(villageName, selectedTaluk, selectedDistrict, selectedDisaster);
  };

  // Handle Disaster Change
  const handleDisasterChange = (disasterName: DisasterType) => {
    setSelectedDisaster(disasterName);
    loadDefaultEnvValues(selectedVillage, selectedTaluk, selectedDistrict, disasterName);
  };

  // Load default simulated sensor readings
  const loadDefaultEnvValues = (
    vName: string,
    tName: string,
    dName: string,
    disaster: DisasterType
  ) => {
    // Check if matching record exists in preloaded dataset
    const rec = getRecordForVillage(dName, tName, vName, disaster);
    if (rec) {
      if (rec.Rainfall_mm) setRainfall(parseFloat(rec.Rainfall_mm) || 20);
      if (rec.Water_Level_m) setWaterLevel(parseFloat(rec.Water_Level_m) || 1.5);
      if (rec.Soil_Moisture_pct) setSoilMoisture(parseFloat(rec.Soil_Moisture_pct) || 30);
      if (rec.Temperature_C) setTemperature(parseFloat(rec.Temperature_C) || 32);
      if (rec.Humidity_pct) setHumidity(parseFloat(rec.Humidity_pct) || 45);
      if (rec.Wind_Speed_kmh) setWindSpeed(parseFloat(rec.Wind_Speed_kmh) || 15);
      if (rec.Atmospheric_Pressure_hPa) setPressure(parseFloat(rec.Atmospheric_Pressure_hPa) || 1010);
      if (rec.Slope_Degree) setSlope(parseFloat(rec.Slope_Degree) || 15);
      if (rec.Smoke_Level) setSmokeLevel(parseFloat(rec.Smoke_Level) || 1.5);
      return;
    }

    // Default domain fallbacks
    if (disaster === "Drought") {
      if (dName === "Kalaburagi" && vName === "Alura") {
        setRainfall(6.2);
        setTemperature(41.5);
        setSoilMoisture(16.5);
        setHumidity(26.0);
      } else {
        setRainfall(10.0);
        setTemperature(38.0);
        setSoilMoisture(22.0);
        setHumidity(32.0);
      }
    } else if (disaster === "Flood") {
      setRainfall(95.0);
      setWaterLevel(4.2);
      setSoilMoisture(85.0);
    } else if (disaster === "Landslide") {
      setRainfall(120.0);
      setSoilMoisture(90.0);
      setSlope(45.0);
      setSmokeLevel(6.0);
    } else if (disaster === "Forest Fire") {
      setTemperature(42.0);
      setHumidity(18.0);
      setWindSpeed(42.0);
      setSmokeLevel(7.5);
      setRainfall(2.0);
    } else if (disaster === "Cyclone") {
      setWindSpeed(92.0);
      setPressure(975.0);
      setRainfall(130.0);
      setTemperature(29.0);
    }
  };

  // Quick preset: Alura (Chittapur, Kalaburagi) Drought Demo (76% High Risk)
  const loadAluraDemo = () => {
    setSelectedDistrict("Kalaburagi");
    setSelectedTaluk("Chittapur");
    setSelectedVillage("Alura");
    setSelectedDisaster("Drought");
    setRainfall(6.2);
    setTemperature(41.5);
    setSoilMoisture(16.5);
    setHumidity(26.0);
  };

  // Calculate risk using the rule-based engine
  const assessment: RiskAssessmentResult = useMemo(() => {
    switch (selectedDisaster) {
      case "Flood":
        return calculateFloodRisk(rainfall, waterLevel, soilMoisture);
      case "Drought":
        return calculateDroughtRisk(rainfall, temperature, soilMoisture, humidity);
      case "Landslide":
        return calculateLandslideRisk(rainfall, soilMoisture, slope, smokeLevel);
      case "Forest Fire":
        return calculateForestFireRisk(temperature, humidity, rainfall, windSpeed, smokeLevel);
      case "Cyclone":
        return calculateCycloneRisk(windSpeed, pressure, rainfall, temperature);
    }
  }, [
    selectedDisaster,
    rainfall,
    waterLevel,
    soilMoisture,
    temperature,
    humidity,
    windSpeed,
    pressure,
    slope,
    smokeLevel
  ]);

  // Get hazard icon
  const getDisasterIcon = (d: DisasterType) => {
    switch (d) {
      case "Flood":
        return <Droplets className="w-4 h-4 text-blue-600" />;
      case "Drought":
        return <Sun className="w-4 h-4 text-amber-600" />;
      case "Landslide":
        return <Mountain className="w-4 h-4 text-stone-600" />;
      case "Forest Fire":
        return <Flame className="w-4 h-4 text-orange-600" />;
      case "Cyclone":
        return <Wind className="w-4 h-4 text-indigo-600" />;
    }
  };

  const downloadAnalysisSummary = () => {
    const summary = {
      project: "Disaster Risk Assessment System",
      date: new Date().toISOString(),
      location: {
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
        taluk: selectedTaluk,
        village: selectedVillage
      },
      disaster: selectedDisaster,
      riskPercentage: assessment.riskScore,
      riskLevel: assessment.riskLevel,
      warning: assessment.warning,
      recommendations: assessment.recommendations,
      parameters: assessment.parameters,
      formula: assessment.formula,
      dataNote: "SIMULATED / DEMONSTRATION DATA"
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `risk_assessment_${selectedVillage}_${selectedDisaster}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Top Academic Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Disaster Risk Assessment System
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  CSE 7th-Sem Project
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Rule-Based Multi-Hazard Risk Evaluation Engine • Transparent &amp; Explainable Model
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Simulation tag */}
            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300">
              SIMULATED / DEMO DATA
            </span>

            {/* Prompt Example Button */}
            <button
              onClick={loadAluraDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Loads Country: India -> State: Karnataka -> District: Kalaburagi -> Taluk: Chittapur -> Village: Alura (Drought Risk ~76% High Risk)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Load Alura Demo Case (76%)
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === "dashboard"
                ? "border-blue-600 text-blue-600 bg-blue-50/40"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            🎯 Risk Assessment Dashboard
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === "analytics"
                ? "border-blue-600 text-blue-600 bg-blue-50/40"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            📈 Trends &amp; Multi-Hazard Analytics
          </button>
          <button
            onClick={() => setActiveTab("dataset")}
            className={`px-4 py-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === "dataset"
                ? "border-blue-600 text-blue-600 bg-blue-50/40"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            📊 Dataset Explorer (650+ records)
          </button>
          <button
            onClick={() => setActiveTab("academics")}
            className={`px-4 py-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === "academics"
                ? "border-blue-600 text-blue-600 bg-blue-50/40"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            📚 Academic Report &amp; Viva Q&amp;A
          </button>
          <button
            onClick={() => setActiveTab("sourcecode")}
            className={`px-4 py-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === "sourcecode"
                ? "border-blue-600 text-blue-600 bg-blue-50/40"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            💻 Python Code &amp; ZIP Download
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 space-y-5">
        {activeTab === "dashboard" && (
          <div className="space-y-5">
            {/* Location & Disaster Selector Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  5-Level Administrative Location Hierarchy
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {selectedCountry} &rarr; {selectedState} &rarr; {selectedDistrict} &rarr; {selectedTaluk} &rarr; <span className="font-bold text-blue-700">{selectedVillage}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                {/* 1. Country */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    1. Country
                  </label>
                  <select
                    disabled
                    value={selectedCountry}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-medium"
                  >
                    <option value="India">India</option>
                  </select>
                </div>

                {/* 2. State */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    2. State
                  </label>
                  <select
                    disabled
                    value={selectedState}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-medium"
                  >
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>

                {/* 3. District */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    3. District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {KARNATAKA_LOCATION_DATA.map((d) => (
                      <option key={d.district} value={d.district}>
                        {d.district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Taluk */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    4. Taluk
                  </label>
                  <select
                    value={selectedTaluk}
                    onChange={(e) => handleTalukChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {availableTaluks.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Village */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    5. Village
                  </label>
                  <select
                    value={selectedVillage}
                    onChange={(e) => handleVillageChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {availableVillages.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Disaster Type */}
                <div>
                  <label className="block text-[11px] font-semibold text-blue-900 mb-1">
                    6. Disaster Hazard
                  </label>
                  <select
                    value={selectedDisaster}
                    onChange={(e) => handleDisasterChange(e.target.value as DisasterType)}
                    className="w-full px-2.5 py-1.5 border border-blue-400 rounded-lg bg-blue-50 text-blue-950 font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {DISASTER_TYPES.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Assessment Grid: Inputs on Left, Gauge & Warning on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Environmental Parameter Controls (7 cols) */}
              <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-800 text-sm">
                      Current Environmental Parameters ({selectedDisaster})
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      loadDefaultEnvValues(
                        selectedVillage,
                        selectedTaluk,
                        selectedDistrict,
                        selectedDisaster
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 cursor-pointer"
                    title="Reset to typical village simulated values"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Baseline
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  Adjust sliders to test dynamic &ldquo;What-If&rdquo; conditions. Risk score updates instantly using transparent weighted linear formulas.
                </p>

                {/* Dynamic Parameter Sliders */}
                <div className="space-y-4 pt-1">
                  {selectedDisaster === "Flood" && (
                    <>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Rainfall (Weight: 45%)
                          </span>
                          <span className="font-mono font-bold text-blue-700">
                            {rainfall} mm
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="250"
                          step="1"
                          value={rainfall}
                          onChange={(e) => setRainfall(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>0 mm (Dry)</span>
                          <span>100 mm (Heavy)</span>
                          <span>250 mm (Extreme)</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            River / Water Gauge Level (Weight: 35%)
                          </span>
                          <span className="font-mono font-bold text-blue-700">
                            {waterLevel} m
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="8"
                          step="0.1"
                          value={waterLevel}
                          onChange={(e) => setWaterLevel(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>0 m (Dry bed)</span>
                          <span>3.5 m (Warning level)</span>
                          <span>8.0 m (Spillover)</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Soil Moisture Saturation (Weight: 20%)
                          </span>
                          <span className="font-mono font-bold text-blue-700">
                            {soilMoisture}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={soilMoisture}
                          onChange={(e) => setSoilMoisture(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>0% (Arid)</span>
                          <span>50% (Damp)</span>
                          <span>100% (Fully Saturated)</span>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedDisaster === "Drought" && (
                    <>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Precipitation / Rainfall (Deficit Weight: 40%)
                          </span>
                          <span className="font-mono font-bold text-amber-700">
                            {rainfall} mm
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="150"
                          step="0.5"
                          value={rainfall}
                          onChange={(e) => setRainfall(Number(e.target.value))}
                          className="w-full accent-amber-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>0 mm (Severe drought)</span>
                          <span>50 mm (Deficit)</span>
                          <span>150 mm (Adequate)</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Soil Moisture Volumetric (Deficit Weight: 25%)
                          </span>
                          <span className="font-mono font-bold text-amber-700">
                            {soilMoisture}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={soilMoisture}
                          onChange={(e) => setSoilMoisture(Number(e.target.value))}
                          className="w-full accent-amber-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>0% (Bone dry)</span>
                          <span>30% (Stress threshold)</span>
                          <span>100% (Hydrated)</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Ambient Temperature (Weight: 20%)
                          </span>
                          <span className="font-mono font-bold text-amber-700">
                            {temperature} °C
                          </span>
                        </div>
                        <input
                          type="range"
                          min="15"
                          max="50"
                          step="0.5"
                          value={temperature}
                          onChange={(e) => setTemperature(Number(e.target.value))}
                          className="w-full accent-amber-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>15 °C (Cool)</span>
                          <span>35 °C (Warm)</span>
                          <span>50 °C (Severe heatwave)</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Relative Humidity (Deficit Weight: 15%)
                          </span>
                          <span className="font-mono font-bold text-amber-700">
                            {humidity}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="100"
                          step="1"
                          value={humidity}
                          onChange={(e) => setHumidity(Number(e.target.value))}
                          className="w-full accent-amber-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>5% (Arid)</span>
                          <span>50% (Comfortable)</span>
                          <span>100% (Saturated)</span>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedDisaster === "Landslide" && (
                    <>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Terrain Slope Inclination (Weight: 35%)
                          </span>
                          <span className="font-mono font-bold text-stone-700">
                            {slope}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="70"
                          step="1"
                          value={slope}
                          onChange={(e) => setSlope(Number(e.target.value))}
                          className="w-full accent-stone-700"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>0° (Flat)</span>
                          <span>30° (Moderate)</span>
                          <span>70° (Steep cliff)</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Precipitation / Rainfall (Weight: 30%)
                          </span>
                          <span className="font-mono font-bold text-stone-700">
                            {rainfall} mm
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="250"
                          step="1"
                          value={rainfall}
                          onChange={(e) => setRainfall(Number(e.target.value))}
                          className="w-full accent-stone-700"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Soil Moisture Saturation (Weight: 20%)
                          </span>
                          <span className="font-mono font-bold text-stone-700">
                            {soilMoisture}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={soilMoisture}
                          onChange={(e) => setSoilMoisture(Number(e.target.value))}
                          className="w-full accent-stone-700"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Ground Vibration / Tilt Indicator (Weight: 15%)
                          </span>
                          <span className="font-mono font-bold text-stone-700">
                            {smokeLevel} / 10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.1"
                          value={smokeLevel}
                          onChange={(e) => setSmokeLevel(Number(e.target.value))}
                          className="w-full accent-stone-700"
                        />
                      </div>
                    </>
                  )}

                  {selectedDisaster === "Forest Fire" && (
                    <>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Temperature (Weight: 25%)
                          </span>
                          <span className="font-mono font-bold text-orange-700">
                            {temperature} °C
                          </span>
                        </div>
                        <input
                          type="range"
                          min="15"
                          max="50"
                          step="0.5"
                          value={temperature}
                          onChange={(e) => setTemperature(Number(e.target.value))}
                          className="w-full accent-orange-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Relative Humidity (Deficit Weight: 25%)
                          </span>
                          <span className="font-mono font-bold text-orange-700">
                            {humidity}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="100"
                          step="1"
                          value={humidity}
                          onChange={(e) => setHumidity(Number(e.target.value))}
                          className="w-full accent-orange-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Wind Speed (Weight: 20%)
                          </span>
                          <span className="font-mono font-bold text-orange-700">
                            {windSpeed} km/h
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="90"
                          step="1"
                          value={windSpeed}
                          onChange={(e) => setWindSpeed(Number(e.target.value))}
                          className="w-full accent-orange-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Dryness / Smoke Index (Weight: 20%)
                          </span>
                          <span className="font-mono font-bold text-orange-700">
                            {smokeLevel} / 10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="0.1"
                          value={smokeLevel}
                          onChange={(e) => setSmokeLevel(Number(e.target.value))}
                          className="w-full accent-orange-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Rainfall (Deficit Weight: 10%)
                          </span>
                          <span className="font-mono font-bold text-orange-700">
                            {rainfall} mm
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="80"
                          step="1"
                          value={rainfall}
                          onChange={(e) => setRainfall(Number(e.target.value))}
                          className="w-full accent-orange-600"
                        />
                      </div>
                    </>
                  )}

                  {selectedDisaster === "Cyclone" && (
                    <>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Sustained Wind Speed (Weight: 40%)
                          </span>
                          <span className="font-mono font-bold text-indigo-700">
                            {windSpeed} km/h
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="180"
                          step="1"
                          value={windSpeed}
                          onChange={(e) => setWindSpeed(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Barometric Pressure (Drop Weight: 35%)
                          </span>
                          <span className="font-mono font-bold text-indigo-700">
                            {pressure} hPa
                          </span>
                        </div>
                        <input
                          type="range"
                          min="920"
                          max="1030"
                          step="1"
                          value={pressure}
                          onChange={(e) => setPressure(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>920 hPa (Super Cyclone)</span>
                          <span>980 hPa (Depression)</span>
                          <span>1013 hPa (Normal)</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Squall Rainfall (Weight: 15%)
                          </span>
                          <span className="font-mono font-bold text-indigo-700">
                            {rainfall} mm
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="250"
                          step="1"
                          value={rainfall}
                          onChange={(e) => setRainfall(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700">
                            Sea / Ambient Temp (Weight: 10%)
                          </span>
                          <span className="font-mono font-bold text-indigo-700">
                            {temperature} °C
                          </span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="40"
                          step="0.5"
                          value={temperature}
                          onChange={(e) => setTemperature(Number(e.target.value))}
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Risk Output, Warning & Actions (5 cols) */}
              <div className="lg:col-span-5 space-y-4 flex flex-col">
                {/* Radial Gauge */}
                <RiskGauge
                  score={assessment.riskScore}
                  level={assessment.riskLevel}
                  disaster={selectedDisaster}
                />

                {/* Risk Level Badge & Warning Card */}
                <div
                  className={`p-4 rounded-xl border ${assessment.theme.border} ${assessment.theme.bgCard} shadow-xs space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Assessed Risk Level
                    </span>
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${assessment.theme.bgBadge} ${assessment.theme.textBadge} border-current`}
                    >
                      {assessment.riskLevel}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <AlertTriangle
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: assessment.theme.color }}
                    />
                    <div className="text-xs text-slate-800 leading-snug">
                      <strong className="block font-semibold">Warning Advisory:</strong>
                      {assessment.warning}
                    </div>
                  </div>
                </div>

                {/* Action Protocols */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex-1">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Recommended Mitigation Protocols
                    </h4>
                    <button
                      onClick={downloadAnalysisSummary}
                      className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer font-medium"
                      title="Download JSON assessment report"
                    >
                      <Download className="w-3 h-3" />
                      Export
                    </button>
                  </div>

                  <ul className="space-y-2 text-xs">
                    {assessment.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-slate-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Transparent Mathematical Formula Breakdown Table */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-800 text-sm">
                    Transparent Mathematical Model &amp; Weights Breakdown
                  </h3>
                </div>
                <div className="font-mono text-xs text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  {assessment.formula}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5 border-b">Parameter Name</th>
                      <th className="p-2.5 border-b text-right">Measured Telemetry</th>
                      <th className="p-2.5 border-b text-right">Normalized Score (S_i)</th>
                      <th className="p-2.5 border-b text-right">Assigned Weight (w_i)</th>
                      <th className="p-2.5 border-b text-right">Weight Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assessment.parameters.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-medium text-slate-800">{p.name}</td>
                        <td className="p-2.5 text-right font-mono text-slate-700">
                          {p.measuredValue} {p.unit}
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-600">
                          {p.normalizedScore.toFixed(3)}
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-600">
                          {p.weight.toFixed(2)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-blue-700">
                          {p.weightedContribution.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold text-slate-900">
                      <td colSpan={3} className="p-2.5 text-right">
                        Final Aggregated Risk Score:
                      </td>
                      <td className="p-2.5 text-right font-mono">1.00</td>
                      <td
                        className="p-2.5 text-right font-mono text-sm"
                        style={{ color: assessment.theme.color }}
                      >
                        {assessment.riskScore}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Visual Trends Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TrendChart
                village={selectedVillage}
                disaster={selectedDisaster}
                currentScore={assessment.riskScore}
              />
              <MultiHazardBarChart
                currentDisaster={selectedDisaster}
                currentScore={assessment.riskScore}
                district={selectedDistrict}
                village={selectedVillage}
              />
            </div>

            {/* Taluk-level comparison */}
            <TalukComparisonChart
              districtData={currentDistrictData}
              disaster={selectedDisaster}
              currentTaluk={selectedTaluk}
            />
          </div>
        )}

        {/* Tab 2: Visual Analytics & Trends */}
        {activeTab === "analytics" && (
          <div className="space-y-5">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Comprehensive Visual Analytics ({selectedVillage}, {selectedDistrict})
                </h3>
                <p className="text-xs text-slate-500">
                  Time-series progression, multi-hazard vulnerabilities, and sub-district comparisons
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                Plotly Analytics Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TrendChart
                village={selectedVillage}
                disaster={selectedDisaster}
                currentScore={assessment.riskScore}
              />
              <MultiHazardBarChart
                currentDisaster={selectedDisaster}
                currentScore={assessment.riskScore}
                district={selectedDistrict}
                village={selectedVillage}
              />
            </div>

            <TalukComparisonChart
              districtData={currentDistrictData}
              disaster={selectedDisaster}
              currentTaluk={selectedTaluk}
            />
          </div>
        )}

        {/* Tab 3: Dataset Explorer */}
        {activeTab === "dataset" && <DatasetViewer />}

        {/* Tab 4: Academic Report & Viva */}
        {activeTab === "academics" && <AcademicReport />}

        {/* Tab 5: Python Project Code & ZIP Download */}
        {activeTab === "sourcecode" && <ProjectFilesViewer />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            CSE 7th Semester Academic Major/Minor Project &bull; <strong>Disaster Risk Assessment System</strong>
          </span>
          <span className="font-mono text-slate-400">
            India &rarr; Karnataka Demonstrator &bull; Python &bull; Streamlit &bull; Pandas &bull; Plotly
          </span>
        </div>
      </footer>
    </div>
  );
}
