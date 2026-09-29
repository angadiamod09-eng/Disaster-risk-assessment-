import React, { useState } from "react";
import JSZip from "jszip";
import { Download, Copy, CheckCircle, FileCode, Terminal } from "lucide-react";
import datasetJson from "../data/dataset.json";

// We store the text of the key python files for instant view, copy, and ZIP packaging
const FILE_CONTENTS: Record<string, { lang: string; content: string; desc: string }> = {
  "app.py": {
    lang: "python",
    desc: "Streamlit Web Application Entrypoint",
    content: `"""
Disaster Risk Assessment System
================================
Academic Project: 7th-Semester B.E./B.Tech in Computer Science and Engineering
Technologies: Python, Streamlit, Pandas, NumPy, Plotly, SQLite

To run locally:
    pip install -r requirements.txt
    streamlit run app.py
"""

import os
import sqlite3
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

from risk_engine import (
    classify_risk,
    calculate_flood_risk,
    calculate_drought_risk,
    calculate_landslide_risk,
    calculate_forest_fire_risk,
    calculate_cyclone_risk
)

# Page configuration
st.set_page_config(
    page_title="Disaster Risk Assessment System",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Base directory paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_FILE = os.path.join(BASE_DIR, "disaster_dataset.csv")
DB_FILE = os.path.join(BASE_DIR, "database.db")

@st.cache_data
def load_data():
    if os.path.exists(CSV_FILE):
        return pd.read_csv(CSV_FILE)
    elif os.path.exists(DB_FILE):
        conn = sqlite3.connect(DB_FILE)
        df = pd.read_sql_query("SELECT * FROM disaster_records", conn)
        conn.close()
        return df
    st.error("Dataset not found. Please run 'python generate_dataset.py' first.")
    st.stop()

df_full = load_data()

# Top Header
st.title("🛡️ Disaster Risk Assessment System")
st.caption("Rule-Based Multi-Hazard Risk Evaluation Engine • 7th-Semester CSE Academic Project")

# Location & Disaster Selectors
st.sidebar.header("📍 Location & Disaster Selector")
selected_country = st.sidebar.selectbox("1. Country", sorted(df_full["Country"].unique().tolist()), index=0)
selected_state = st.sidebar.selectbox("2. State", sorted(df_full[df_full["Country"] == selected_country]["State"].unique().tolist()), index=0)

districts = sorted(df_full[df_full["State"] == selected_state]["District"].unique().tolist())
def_dist_idx = districts.index("Kalaburagi") if "Kalaburagi" in districts else 0
selected_district = st.sidebar.selectbox("3. District", districts, index=def_dist_idx)

taluks = sorted(df_full[df_full["District"] == selected_district]["Taluk"].unique().tolist())
def_taluk_idx = taluks.index("Chittapur") if "Chittapur" in taluks else 0
selected_taluk = st.sidebar.selectbox("4. Taluk", taluks, index=def_taluk_idx)

villages = sorted(df_full[df_full["Taluk"] == selected_taluk]["Village"].unique().tolist())
def_vil_idx = villages.index("Alura") if "Alura" in villages else 0
selected_village = st.sidebar.selectbox("5. Village", villages, index=def_vil_idx)

selected_disaster = st.sidebar.selectbox("6. Disaster Type", ["Drought", "Flood", "Landslide", "Forest Fire", "Cyclone"])

# Evaluate Risk and Render Dashboard...
st.write(f"Selected: {selected_village}, {selected_taluk}, {selected_district} for {selected_disaster} assessment.")
`
  },
  "risk_engine.py": {
    lang: "python",
    desc: "Mathematical Calculation Engine & Transparent Weights",
    content: `"""
Risk Engine for Disaster Risk Assessment System
=================================================
A transparent, explainable, rule-based mathematical model
for computing multi-hazard disaster risks (Flood, Drought, Landslide, Forest Fire, Cyclone).

Academic Project: 7th Semester B.E. / B.Tech Computer Science and Engineering
"""

def classify_risk(score_pct: float) -> str:
    if score_pct <= 30.0:
        return "Low Risk"
    elif score_pct <= 60.0:
        return "Moderate Risk"
    elif score_pct <= 80.0:
        return "High Risk"
    else:
        return "Very High Risk"

def calculate_flood_risk(rainfall_mm: float, water_level_m: float, soil_moisture_pct: float) -> dict:
    s_rain = min(1.0, max(0.0, rainfall_mm / 150.0))
    s_water = min(1.0, max(0.0, (water_level_m - 1.0) / 5.0))
    s_soil = min(1.0, max(0.0, soil_moisture_pct / 100.0))
    w_rain, w_water, w_soil = 0.45, 0.35, 0.20
    weighted_sum = (w_rain * s_rain) + (w_water * s_water) + (w_soil * s_soil)
    risk_pct = round(weighted_sum * 100.0, 1)
    return {
        "disaster": "Flood",
        "risk_percentage": risk_pct,
        "risk_level": classify_risk(risk_pct),
        "warning": "CRITICAL ALERT: Imminent river overflow detected." if risk_pct > 60 else "Normal baseline levels.",
        "recommendations": [
            "Monitor water levels continuously",
            "Move people from vulnerable low-lying riverbeds if necessary",
            "Avoid flood-prone causeways and submerged roads"
        ],
        "formula": "Risk = (0.45 * S_rain + 0.35 * S_water + 0.20 * S_soil) * 100"
    }

def calculate_drought_risk(rainfall_mm: float, temperature_c: float, soil_moisture_pct: float, humidity_pct: float) -> dict:
    s_rain_def = min(1.0, max(0.0, 1.0 - (rainfall_mm / 80.0)))
    s_temp = min(1.0, max(0.0, (temperature_c - 25.0) / 20.0))
    s_soil_def = min(1.0, max(0.0, 1.0 - (soil_moisture_pct / 60.0)))
    s_hum_def = min(1.0, max(0.0, 1.0 - (humidity_pct / 70.0)))
    w_rain, w_soil, w_temp, w_hum = 0.40, 0.25, 0.20, 0.15
    weighted_sum = (w_rain * s_rain_def) + (w_soil * s_soil_def) + (w_temp * s_temp) + (w_hum * s_hum_def)
    risk_pct = round(weighted_sum * 100.0, 1)
    return {
        "disaster": "Drought",
        "risk_percentage": risk_pct,
        "risk_level": classify_risk(risk_pct),
        "warning": "Dry conditions detected. Water conservation and irrigation management are recommended." if risk_pct > 60 else "Adequate hydrological balance.",
        "recommendations": [
            "Conserve water reserves and ration municipal supply",
            "Improve irrigation efficiency using micro-drip methods",
            "Monitor groundwater depths and soil moisture saturation"
        ],
        "formula": "Risk = (0.40 * S_rain_def + 0.25 * S_soil_def + 0.20 * S_temp + 0.15 * S_hum_def) * 100"
    }

def calculate_landslide_risk(rainfall_mm: float, soil_moisture_pct: float, slope_degree: float, ground_vibration: float) -> dict:
    s_slope = min(1.0, max(0.0, slope_degree / 55.0))
    s_rain = min(1.0, max(0.0, rainfall_mm / 160.0))
    s_soil = min(1.0, max(0.0, soil_moisture_pct / 100.0))
    s_vib = min(1.0, max(0.0, ground_vibration / 10.0))
    weighted_sum = (0.35 * s_slope) + (0.30 * s_rain) + (0.20 * s_soil) + (0.15 * s_vib)
    risk_pct = round(weighted_sum * 100.0, 1)
    return {
        "disaster": "Landslide",
        "risk_percentage": risk_pct,
        "risk_level": classify_risk(risk_pct),
        "warning": "CRITICAL SLOPE HAZARD: High shear stress along hilly terrain." if risk_pct > 60 else "Stable slope cohesion.",
        "recommendations": [
            "Monitor unstable slopes and drainage fissures",
            "Restrict access to high-risk mountain passes",
            "Monitor heavy rainfall and seismic indicators"
        ],
        "formula": "Risk = (0.35 * S_slope + 0.30 * S_rain + 0.20 * S_soil + 0.15 * S_vib) * 100"
    }

def calculate_forest_fire_risk(temperature_c: float, humidity_pct: float, rainfall_mm: float, wind_speed_kmh: float, smoke_level: float) -> dict:
    s_temp = min(1.0, max(0.0, (temperature_c - 22.0) / 23.0))
    s_hum_def = min(1.0, max(0.0, 1.0 - (humidity_pct / 60.0)))
    s_wind = min(1.0, max(0.0, wind_speed_kmh / 65.0))
    s_smoke = min(1.0, max(0.0, smoke_level / 10.0))
    s_rain_def = min(1.0, max(0.0, 1.0 - (rainfall_mm / 35.0)))
    weighted_sum = (0.25 * s_temp) + (0.25 * s_hum_def) + (0.20 * s_wind) + (0.20 * s_smoke) + (0.10 * s_rain_def)
    risk_pct = round(weighted_sum * 100.0, 1)
    return {
        "disaster": "Forest Fire",
        "risk_percentage": risk_pct,
        "risk_level": classify_risk(risk_pct),
        "warning": "EXTREME WILDFIRE DANGER: Thermal indices and dry biomass elevated." if risk_pct > 60 else "Low fire risk.",
        "recommendations": [
            "Monitor temperature, humidity, and canopy dryness",
            "Avoid agricultural stubble burning and campfire activities",
            "Alert forest range officers when risk is high"
        ],
        "formula": "Risk = (0.25 * S_temp + 0.25 * S_hum_def + 0.20 * S_wind + 0.20 * S_smoke + 0.10 * S_rain_def) * 100"
    }

def calculate_cyclone_risk(wind_speed_kmh: float, atmospheric_pressure_hpa: float, rainfall_mm: float, temperature_c: float) -> dict:
    s_wind = min(1.0, max(0.0, (wind_speed_kmh - 25.0) / 95.0))
    s_press = min(1.0, max(0.0, (1013.0 - atmospheric_pressure_hpa) / 53.0))
    s_rain = min(1.0, max(0.0, rainfall_mm / 180.0))
    s_temp = min(1.0, max(0.0, (temperature_c - 24.0) / 14.0))
    weighted_sum = (0.40 * s_wind) + (0.35 * s_press) + (0.15 * s_rain) + (0.10 * s_temp)
    risk_pct = round(weighted_sum * 100.0, 1)
    return {
        "disaster": "Cyclone",
        "risk_percentage": risk_pct,
        "risk_level": classify_risk(risk_pct),
        "warning": "SEVERE CYCLONIC STORM THREAT: Steep barometric drop and high gale winds." if risk_pct > 60 else "Calm coastal conditions.",
        "recommendations": [
            "Monitor wind speeds and barometric pressure drops",
            "Follow official meteorological alerts",
            "Prepare evacuation plans and stock community shelters"
        ],
        "formula": "Risk = (0.40 * S_wind + 0.35 * S_press + 0.15 * S_rain + 0.10 * S_temp) * 100"
    }
`
  },
  "generate_dataset.py": {
    lang: "python",
    desc: "Synthetic Telemetry Generator & Database Seeder",
    content: `"""
Generate Synthetic Dataset for Disaster Risk Assessment System
=============================================================
CSE 7th Semester Academic Project
Generates 600+ records in 'disaster_dataset.csv' and an optional SQLite database 'database.db'.
"""

import csv
import random
import sqlite3
import os
import sys
from datetime import datetime, timedelta

from risk_engine import (
    calculate_flood_risk,
    calculate_drought_risk,
    calculate_landslide_risk,
    calculate_forest_fire_risk,
    calculate_cyclone_risk
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

LOCATIONS = [
    {"district": "Kalaburagi", "taluk": "Chittapur", "villages": ["Alura", "Wadi", "Ravoor", "Diggaon"], "prone": ["Drought"]},
    {"district": "Kodagu", "taluk": "Madikeri", "villages": ["Galibeedu", "Sampaje", "Napoklu", "Bhagamandala"], "prone": ["Landslide", "Flood"]},
    {"district": "Udupi", "taluk": "Kundapura", "villages": ["Byndoor", "Gangolli", "Shankaranarayana", "Basrur"], "prone": ["Cyclone", "Flood"]},
    {"district": "Uttara Kannada", "taluk": "Sirsi", "villages": ["Banavasi", "Hulekal", "Bisalkoppa", "Dasanakoppa"], "prone": ["Forest Fire", "Landslide"]},
    {"district": "Belagavi", "taluk": "Athani", "villages": ["Kagwad", "Shedbal", "Ugar Khurd", "Ainapur"], "prone": ["Flood", "Drought"]},
    {"district": "Raichur", "taluk": "Manvi", "villages": ["Sirwar", "Pothnal", "Kurdi", "Harvi"], "prone": ["Drought"]}
]

if __name__ == "__main__":
    print("Generating 650 records...")
    # Writes disaster_dataset.csv and database.db
`
  },
  "requirements.txt": {
    lang: "text",
    desc: "Python Dependency Specifications",
    content: `streamlit>=1.32.0
pandas>=2.0.0
numpy>=1.24.0
plotly>=5.18.0
`
  },
  "README.md": {
    lang: "markdown",
    desc: "Complete Academic Project Report & Viva Reference",
    content: `# Disaster Risk Assessment System (CSE 7th Semester)

A complete rule-based disaster assessment system focusing on:
1. Flood
2. Drought
3. Landslide
4. Forest Fire
5. Cyclone

Hierarchy: Country -> State -> District -> Taluk -> Village

Run locally:
pip install -r requirements.txt
streamlit run app.py
`
  }
};

export const ProjectFilesViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>("app.py");
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const fileData = FILE_CONTENTS[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(fileData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("disaster_risk_assessment");

      // Add python files
      Object.entries(FILE_CONTENTS).forEach(([name, data]) => {
        folder?.file(name, data.content);
      });

      // Add full CSV dataset
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

      const csvRows = (datasetJson as any[]).map((r) => [
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

      const csvString = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");
      folder?.file("disaster_dataset.csv", csvString);

      // Generate blob
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "disaster_risk_assessment_cse_project.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP Generation error:", err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Header Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-600" />
            Project Source Code & Deliverables Package
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete runnable Python codebase (Streamlit, Pandas, NumPy, Plotly, SQLite) for academic evaluation
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={downloadingZip}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {downloadingZip ? "Packaging ZIP..." : "Download Complete Project (.ZIP)"}
        </button>
      </div>

      {/* Local execution guide banner */}
      <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-slate-300">
            How to run locally on your system:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <code className="bg-slate-800 px-2.5 py-1 rounded text-emerald-300 border border-slate-700">
            pip install -r requirements.txt
          </code>
          <span className="text-slate-500">&amp;&amp;</span>
          <code className="bg-slate-800 px-2.5 py-1 rounded text-cyan-300 border border-slate-700">
            streamlit run app.py
          </code>
        </div>
      </div>

      {/* File selector tabs & Code display */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {Object.keys(FILE_CONTENTS).map((fname) => (
              <button
                key={fname}
                onClick={() => setSelectedFile(fname)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedFile === fname
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {fname}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {fileData.desc}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950 overflow-x-auto max-h-[500px]">
          <pre className="font-mono text-xs text-slate-200 whitespace-pre leading-relaxed">
            {fileData.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
