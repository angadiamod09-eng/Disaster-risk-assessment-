import React, { useState } from "react";
import {
  BookOpen,
  HelpCircle,
  CheckCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer
} from "lucide-react";

export const AcademicReport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"documentation" | "viva">("documentation");
  const [vivaSearch, setVivaSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const vivaQuestions = [
    {
      q: "Q1: What is the primary aim of this project?",
      a: "To assess localized multi-hazard natural disaster risk (Flood, Drought, Landslide, Forest Fire, Cyclone) for specific villages using an explainable, transparent rule-based mathematical model across a 5-level geographic hierarchy."
    },
    {
      q: "Q2: Why was a rule-based model chosen instead of Deep Learning or Neural Networks?",
      a: "Rule-based models provide 100% transparency and explainability. In disaster management, civil administrators must know exactly which physical parameter (e.g. river gauge level or slope degree) triggered an alert. Deep learning models act as black boxes and require extensive labeled training data."
    },
    {
      q: "Q3: What are the 5 disasters assessed by this system?",
      a: "1. Flood, 2. Drought, 3. Landslide, 4. Forest Fire, and 5. Cyclone."
    },
    {
      q: "Q4: Explain the geographic location hierarchy used in the system.",
      a: "The system implements a 5-tier cascading administrative hierarchy: Country → State → District → Taluk → Village. For demonstration, India → Karnataka is used with districts like Kalaburagi, Kodagu, Udupi, Uttara Kannada, Chikkamagaluru, Belagavi, and Raichur."
    },
    {
      q: "Q5: What are the four risk classification tiers and their numerical ranges?",
      a: "• 0% – 30%: Low Risk (Green)\n• 31% – 60%: Moderate Risk (Yellow/Amber)\n• 61% – 80%: High Risk (Orange)\n• 81% – 100%: Very High Risk (Red / Critical Emergency)"
    },
    {
      q: "Q6: How is the Flood Risk score calculated?",
      a: "Flood risk uses three normalized parameters:\n• Rainfall (weight 0.45)\n• River/Water Level (weight 0.35)\n• Soil Moisture Saturation (weight 0.20)\nFormula: Risk = (0.45 × S_rain + 0.35 × S_water + 0.20 × S_soil) × 100%."
    },
    {
      q: "Q7: How does the Drought calculation differ conceptually from other hazards?",
      a: "Drought is driven by deficit conditions rather than excess. Lower rainfall, lower soil moisture, and lower relative humidity paired with high ambient temperature trigger higher risk: Risk = (0.40 × S_rain_def + 0.25 × S_soil_def + 0.20 × S_temp + 0.15 × S_hum_def) × 100%."
    },
    {
      q: "Q8: What parameters indicate a Landslide hazard in the model?",
      a: "• Terrain Slope Degree (weight 0.35)\n• Continuous Rainfall (weight 0.30)\n• Saturated Soil Moisture (weight 0.20)\n• Ground Vibration / Inclinometer indicator (weight 0.15)."
    },
    {
      q: "Q9: What atmospheric conditions trigger a Cyclone warning?",
      a: "A steep drop in barometric pressure below 1013 hPa (weight 0.35), high sustained wind speed exceeding 60-120 km/h (weight 0.40), heavy squall rainfall (weight 0.15), and warm sea surface / air temperature (weight 0.10)."
    },
    {
      q: "Q10: What parameters contribute to Forest Fire risk?",
      a: "High ambient temperature (0.25), low relative humidity (0.25), brisk wind speeds (0.20), dryness/smoke index (0.20), and precipitation deficit (0.10)."
    },
    {
      q: "Q11: What software technologies and libraries are used in this project?",
      a: "Python 3, Streamlit (frontend interactive dashboard), Pandas (tabular manipulation), NumPy (numerical normalization), Plotly (interactive charts), SQLite (local database), and CSV (data interchange)."
    },
    {
      q: "Q12: Is the dataset comprised of real-time satellite data?",
      a: "No, the dataset is explicitly labeled as SIMULATED / DEMONSTRATION DATA designed to reflect regional meteorological characteristics across Karnataka for academic rule verification."
    },
    {
      q: "Q13: What happens when the risk score exceeds 60% (High Risk)?",
      a: "The system generates an alert warning message, flags immediate risk escalation, highlights the primary contributing parameters, and displays specific actionable mitigation recommendations (e.g. water rationing, slope restrictions, or evacuation planning)."
    },
    {
      q: "Q14: What is the benefit of having interactive sliders on the dashboard?",
      a: "The sliders allow emergency planners and academic evaluators to simulate 'What-If' scenarios (e.g., what happens if rainfall increases to 140 mm in Alura?) and immediately observe how the transparent rules reclassify the risk."
    },
    {
      q: "Q15: What are the primary future enhancements for this system?",
      a: "1. Connecting with live IoT LoRaWAN weather sensor hardware\n2. Real-time API synchronization with the Indian Meteorological Department (IMD)\n3. Automated SMS broadcasting to village panchayats\n4. GIS interactive map overlays."
    }
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredViva = vivaQuestions.filter(
    (item) =>
      item.q.toLowerCase().includes(vivaSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(vivaSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("documentation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "documentation"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            14 Project Documentation Sections
          </button>
          <button
            onClick={() => setActiveTab("viva")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "viva"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            15 Viva Questions & Answers
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          Print / Save PDF
        </button>
      </div>

      {activeTab === "documentation" ? (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-8 text-slate-800 leading-relaxed text-sm">
          {/* Section 1 */}
          <div className="border-b border-slate-100 pb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">1. Abstract</h3>
            <p className="text-slate-600">
              Natural hazards such as flash floods, prolonged droughts, landslides, wildfires, and cyclonic storms inflict severe humanitarian and economic devastation annually. Conventional disaster management often suffers from regional over-generalization, lacking granular taluk- and village-level sensitivity. Conversely, deep learning approaches suffer from opacity (&ldquo;black-box&rdquo; dilemma), requiring substantial computational resources and lacking explainability.
            </p>
            <p className="text-slate-600 mt-2">
              This project implements the <strong>Disaster Risk Assessment System</strong>, an explainable rule-based web platform utilizing weighted parameter evaluation. Using Karnataka, India as the primary demonstration location, the system processes environmental vectors (rainfall, river level, soil moisture, temperature, humidity, wind velocity, barometric pressure, slope angle, and smoke index) to calculate a 0–100% risk index across 4 standardized tiers (Low, Moderate, High, Very High).
            </p>
          </div>

          {/* Section 2 */}
          <div className="border-b border-slate-100 pb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">2. Problem Statement</h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Lack of Localized Granularity:</strong> Broad regional weather bulletins fail to capture localized micro-climate vulnerability at the village level.</li>
              <li><strong>Opacity in Automated Alerts:</strong> Emergency response personnel cannot audit neural network predictions to explain *why* an evacuation was triggered.</li>
              <li><strong>Prohibitive Compute Requirements:</strong> Machine learning models demand GPUs and large datasets, making deployment in rural administrative offices difficult.</li>
              <li><strong>Single-Hazard Isolation:</strong> Most disaster apps only focus on one threat (e.g. only flood or only wildfire) without a unified interface.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="border-b border-slate-100 pb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">3. Objectives</h3>
            <ol className="list-decimal pl-5 space-y-1 text-slate-600">
              <li>Establish a 5-tier location hierarchy: <strong>Country → State → District → Taluk → Village</strong> for Karnataka.</li>
              <li>Design calibrated rule-based models for 5 key disasters: Flood, Drought, Landslide, Forest Fire, and Cyclone.</li>
              <li>Implement standardized parameter normalization (0.0 to 1.0) and weighted sum aggregation.</li>
              <li>Classify vulnerability into 4 standard categories (Low 0-30%, Moderate 31-60%, High 61-80%, Very High 81-100%).</li>
              <li>Deliver interactive dashboards with live sliders, gauges, multi-hazard profiles, and 14-day trends.</li>
              <li>Provide exportable CSV analytics and SQLite relational storage for all assessments.</li>
            </ol>
          </div>

          {/* Section 4 */}
          <div className="border-b border-slate-100 pb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">4. Existing System vs. Proposed System</h3>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-800">
                  <tr>
                    <th className="p-2 border border-slate-200 text-left">Feature</th>
                    <th className="p-2 border border-slate-200 text-left">Existing Systems</th>
                    <th className="p-2 border border-slate-200 text-left">Proposed System</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="p-2 border font-medium">Model Architecture</td>
                    <td className="p-2 border">Opaque Black-Box Deep Learning / Neural Nets</td>
                    <td className="p-2 border text-blue-900 font-semibold">Transparent Rule-Based Weighted Multi-Criteria Model</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Explainability</td>
                    <td className="p-2 border">None; cannot verify factor weights</td>
                    <td className="p-2 border text-emerald-800 font-semibold">100% Explainable (Formula and weights visible on screen)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Granularity</td>
                    <td className="p-2 border">Zonal or State Level</td>
                    <td className="p-2 border font-semibold">5-Level Hierarchy down to Village Level</td>
                  </tr>
                  <tr>
                    <td className="p-2 border font-medium">Simulation Interactivity</td>
                    <td className="p-2 border">Static reports</td>
                    <td className="p-2 border font-semibold">Real-time dynamic parameter sliders with instant recalculation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5 & 6 */}
          <div className="border-b border-slate-100 pb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">5. Methodology & Workflow</h3>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-700 space-y-1">
              <div>Location Selection (Country → State → District → Taluk → Village)</div>
              <div className="text-slate-400">      ↓</div>
              <div>Select Disaster Type (Flood, Drought, Landslide, Forest Fire, Cyclone)</div>
              <div className="text-slate-400">      ↓</div>
              <div>Load Environmental Data (Preloaded simulated telemetry or user-adjusted sliders)</div>
              <div className="text-slate-400">      ↓</div>
              <div>Data Normalization (Transform raw measurements to normalized scalar S_i ∈ [0, 1])</div>
              <div className="text-slate-400">      ↓</div>
              <div>Weighted Aggregation: Risk Score = Σ (w_i × S_i) × 100%</div>
              <div className="text-slate-400">      ↓</div>
              <div>Risk Tier Classification (Low: ≤30%, Moderate: 31-60%, High: 61-80%, Very High: &gt;80%)</div>
              <div className="text-slate-400">      ↓</div>
              <div>Render Warning Message, Mitigation Checklist & Visual Analytics</div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="border-b border-slate-100 pb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">6. System Architecture</h3>
            <p className="text-slate-600 mb-3">
              The project is architected as a clean 3-tier modular system:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-bold text-blue-900 mb-1">Presentation Tier</div>
                <div className="text-slate-600">
                  Interactive Streamlit web app / React client with cascading select boxes, live sliders, SVG gauge meters, and Plotly charts.
                </div>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="font-bold text-emerald-900 mb-1">Application Tier</div>
                <div className="text-slate-600">
                  <code>risk_engine.py</code> containing mathematical normalization routines, domain weight matrices, risk classifier, and advisory generators.
                </div>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="font-bold text-purple-900 mb-1">Data Tier</div>
                <div className="text-slate-600">
                  <code>disaster_dataset.csv</code> (600+ records) and <code>database.db</code> (SQLite schema) populated via <code>generate_dataset.py</code>.
                </div>
              </div>
            </div>
          </div>

          {/* Section 8 & 9 */}
          <div className="border-b border-slate-100 pb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">7. Mathematical Formulations & Assigned Weights</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong className="text-blue-900">1. Flood Risk Formula:</strong>
                <div className="mt-1 font-mono text-slate-800">Risk = (0.45 × S_rain + 0.35 × S_water + 0.20 × S_soil) × 100%</div>
                <div className="text-slate-500 mt-1">Weights: Rainfall (0.45), River Water Level (0.35), Soil Moisture (0.20). Sum = 1.00</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong className="text-amber-900">2. Drought Risk Formula (Deficit-driven):</strong>
                <div className="mt-1 font-mono text-slate-800">Risk = (0.40 × S_rain_def + 0.25 × S_soil_def + 0.20 × S_temp + 0.15 × S_hum_def) × 100%</div>
                <div className="text-slate-500 mt-1">Weights: Rainfall Deficit (0.40), Soil Deficit (0.25), High Temperature (0.20), Humidity Deficit (0.15).</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong className="text-stone-900">3. Landslide Risk Formula:</strong>
                <div className="mt-1 font-mono text-slate-800">Risk = (0.35 × S_slope + 0.30 × S_rain + 0.20 × S_soil + 0.15 × S_vib) × 100%</div>
                <div className="text-slate-500 mt-1">Weights: Terrain Slope Degree (0.35), Rainfall (0.30), Soil Moisture (0.20), Vibration Indicator (0.15).</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong className="text-red-900">4. Forest Fire Risk Formula:</strong>
                <div className="mt-1 font-mono text-slate-800">Risk = (0.25 × S_temp + 0.25 × S_hum_def + 0.20 × S_wind + 0.20 × S_smoke + 0.10 × S_rain_def) × 100%</div>
                <div className="text-slate-500 mt-1">Weights: Temperature (0.25), Humidity Deficit (0.25), Wind Speed (0.20), Smoke/Dryness (0.20), Rain Deficit (0.10).</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <strong className="text-indigo-900">5. Cyclone Risk Formula:</strong>
                <div className="mt-1 font-mono text-slate-800">Risk = (0.40 × S_wind + 0.35 × S_press + 0.15 × S_rain + 0.10 × S_temp) × 100%</div>
                <div className="text-slate-500 mt-1">Weights: Wind Speed (0.40), Barometric Pressure Drop (0.35), Squall Rain (0.15), Temperature (0.10).</div>
              </div>
            </div>
          </div>

          {/* Section 10 */}
          <div className="border-b border-slate-100 pb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">8. Demonstration Case Study: Alura Village (Chittapur, Kalaburagi)</h3>
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1.5 text-slate-800">
              <div><strong>Hierarchy:</strong> India → Karnataka → Kalaburagi → Chittapur → Alura</div>
              <div><strong>Disaster:</strong> Drought</div>
              <div><strong>Environmental Values:</strong> Rainfall = 6.2 mm, Temp = 41.5 °C, Soil Moisture = 16.5%, Humidity = 26.0%</div>
              <div className="font-semibold text-orange-900">
                Calculated Risk Score: <strong>76.0% (HIGH RISK)</strong>
              </div>
              <div>
                <strong>Warning:</strong> &ldquo;Dry conditions detected. Water conservation and irrigation management are recommended.&rdquo;
              </div>
            </div>
          </div>

          {/* Section 11, 12, 13, 14 */}
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">9. Advantages</h4>
              <p className="text-slate-600 mt-1">
                Zero training time, instantaneous computation (&lt;10ms), full auditability for civil authorities, no expensive GPU hardware dependencies, and seamless exportability to CSV and SQLite.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm">10. Limitations</h4>
              <p className="text-slate-600 mt-1">
                Linear weighted approximations do not model non-linear geological compounding; current environmental values are generated via synthetic simulation rather than live satellite feeds.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm">11. Future Scope</h4>
              <p className="text-slate-600 mt-1">
                Integration with live physical LoRaWAN / ESP32 sensor hardware, real-time sync with Indian Meteorological Department (IMD) REST APIs, automated SMS broadcasts to village sarpanchs, and GIS choropleth mapping.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm">12. Conclusion</h4>
              <p className="text-slate-600 mt-1">
                The Disaster Risk Assessment System illustrates that transparent, mathematically grounded rule-based models offer a practical, dependable, and explainable paradigm for localized safety-critical decision support.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Viva Questions Tab */
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Search viva questions..."
              value={vivaSearch}
              onChange={(e) => setVivaSearch(e.target.value)}
              className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-500 whitespace-nowrap">
              Showing {filteredViva.length} of {vivaQuestions.length} Questions
            </span>
          </div>

          <div className="space-y-2">
            {filteredViva.map((item, idx) => {
              const isExpanded = expandedIndex === idx;
              const isCopied = copiedIndex === idx;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                        {item.q}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(`${item.q}\n\nAnswer: ${item.a}`, idx);
                        }}
                        title="Copy Question & Answer"
                        className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                      >
                        {isCopied ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      <div className="font-semibold text-blue-900 mb-1">
                        Model Viva Answer:
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800">
                        {item.a}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
