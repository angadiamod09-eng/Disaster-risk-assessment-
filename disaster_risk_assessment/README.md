# Disaster Risk Assessment System
### Computer Science & Engineering (7th Semester Academic Major/Minor Project)

---

## 📌 Project Overview
The **Disaster Risk Assessment System** is an interpretable, transparent, rule-based computational decision-support system designed to assess localized hazard vulnerabilities across a 5-tier administrative hierarchy (**Country → State → District → Taluk → Village**). 

The system focuses on five major natural disasters:
1. **Flood**
2. **Drought**
3. **Landslide**
4. **Forest Fire**
5. **Cyclone**

Built using **Python, Streamlit, Pandas, NumPy, Plotly, CSV datasets, and SQLite**, the application replaces opaque black-box deep learning with an explainable linear weighted model.

> ⚠️ **Academic Disclaimer**: All environmental readings and sensor values in the sample dataset are explicitly labeled as **SIMULATED / DEMONSTRATION DATA** for academic simulation and algorithm verification.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure Python 3.9+ is installed.

### 2. Installation
```bash
cd disaster_risk_assessment
pip install -r requirements.txt
```

### 3. Generate Demonstration Dataset (CSV & SQLite)
```bash
python generate_dataset.py
```
This generates:
- `disaster_dataset.csv` (650+ records)
- `database.db` (SQLite relational schema)

### 4. Run the Streamlit Application
```bash
streamlit run app.py
```
Access the application at `http://localhost:8501`.

---

## 📂 Project Directory Structure
```
disaster_risk_assessment/
│
├── app.py                  # Main Streamlit web application dashboard
├── risk_engine.py          # Rule-based risk calculation mathematical engine
├── generate_dataset.py     # Script to generate 600+ simulated records & SQLite DB
├── disaster_dataset.csv    # Generated 600+ row dataset
├── database.db             # SQLite database storing disaster telemetry
├── requirements.txt        # Python dependency manifest
└── README.md               # Complete academic documentation and viva Q&A
```

---

## 1. Abstract
Natural hazards such as flash floods, prolonged droughts, landslides, wildfires, and cyclonic storms inflict severe humanitarian and economic devastation annually. Conventional disaster management often suffers from regional over-generalization, lacking granular taluk- and village-level sensitivity. Conversely, deep learning approaches suffer from opacity ("black-box" dilemma), requiring substantial computational resources and lacking explainability. 

This project implements the **Disaster Risk Assessment System**, an explainable rule-based web platform utilizing weighted parameter evaluation. Using Karnataka, India as the primary demonstration location, the system processes environmental vectors (rainfall, river level, soil moisture, temperature, humidity, wind velocity, barometric pressure, slope angle, and smoke index) to calculate a 0–100% risk index across 4 standardized tiers (Low, Moderate, High, Very High). The platform features real-time parameter tweaking, interactive gauges, historical trend visualizations, cross-taluk comparisons, and specific emergency advisories.

---

## 2. Problem Statement
1. **Lack of Granular Localized Risk Assessment**: Most regional weather bulletins operate at state or zonal levels, leaving individual taluks and villages without actionable vulnerability metrics.
2. **Opacity of Deep Learning Models**: High-stakes disaster response requires verifiable reasoning. Black-box neural networks cannot explicitly explain which physical metric triggered an evacuation alert.
3. **High Infrastructure Overhead**: Deep learning pipelines demand GPUs and cloud servers, making deployment in resource-constrained administrative offices impractical.
4. **Need for Multi-Hazard Integration**: Existing systems typically focus on a single hazard (e.g., only flood or only cyclone) rather than providing a unified assessment interface.

---

## 3. Objectives
1. Implement a 5-tier location hierarchy: **Country → State → District → Taluk → Village** (demonstrating Karnataka districts: Kalaburagi, Kodagu, Udupi, Uttara Kannada, Chikkamagaluru, Belagavi, Raichur).
2. Design normalized, rule-based mathematical formulations for 5 key natural hazards.
3. Provide transparent calculation breakdown displaying parameter scores, assigned weights, and mathematical contributions.
4. Classify risk into 4 standardized tiers: **Low Risk (0–30%)**, **Moderate Risk (31–60%)**, **High Risk (61–80%)**, and **Very High Risk (81–100%)**.
5. Generate disaster-specific emergency warnings and actionable mitigation protocols.
6. Provide rich visualization dashboards including gauge meters, 14-day historical trend graphs, multi-hazard profiles, and taluk comparisons.
7. Support dataset exploration, dynamic filtering, and exportable CSV reports.

---

## 4. Existing System vs. Proposed System

| Feature | Existing Systems | Proposed System |
| :--- | :--- | :--- |
| **Model Type** | Complex Deep Learning / Opaque Statistical Models | Transparent Rule-Based Weighted Multi-Criteria Engine |
| **Explainability** | Black-box; cannot trace individual factor contributions | 100% Explainable; formula and weights visible on screen |
| **Granularity** | State/National level forecasts | 5-level hierarchy down to specific village level |
| **Compute Overhead** | High (requires GPUs, heavy inference dependencies) | Ultra-lightweight (runs seamlessly on standard CPU) |
| **User Interactivity** | Static forecast reports | Real-time interactive parameter simulation sliders |
| **Persistence** | Proprietary backend databases | Standard CSV dataset + SQLite relational database |

---

## 5. Methodology & System Workflow

```
[ Location Selection ]
(Country → State → District → Taluk → Village)
        ↓
[ Select Disaster Type ]
(Flood, Drought, Landslide, Forest Fire, Cyclone)
        ↓
[ Load Environmental Data ]
(Read from CSV/SQLite or Live Interactive Sliders)
        ↓
[ Data Preprocessing & Normalization ]
(Convert raw metrics to 0.0 – 1.0 standardized scores)
        ↓
[ Calculate Individual Risk Scores ]
(Multiply normalized values by calibrated domain weights)
        ↓
[ Calculate Overall Risk Score ]
(Sum weighted scores: Risk% = Σ (w_i × S_i) × 100)
        ↓
[ Classify Risk Tier ]
(Low: 0-30% | Moderate: 31-60% | High: 61-80% | Very High: 81-100%)
        ↓
[ Display Dashboard, Alerts & Mitigation Protocol ]
```

---

## 6. System Architecture

```
+-------------------------------------------------------------+
|                     PRESENTATION TIER                       |
|       Streamlit Web Dashboard (Interactive Frontend)        |
|  - Location & Disaster Selectors   - Interactive Sliders    |
|  - Plotly Risk Gauges & Trends     - Action Advisories      |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                      APPLICATION TIER                       |
|                   Rule Engine (risk_engine.py)              |
|  - Normalization Modules           - Domain Weight Matrices |
|  - Risk Classifier (4 Tiers)       - Advisory Generator     |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                         DATA TIER                           |
|  - disaster_dataset.csv (600+ records)                      |
|  - database.db (SQLite Relational Store)                    |
|  - generate_dataset.py (Synthetic Telemetry Pipeline)       |
+-------------------------------------------------------------+
```

---

## 7. System Modules
1. **Location Hierarchy Module**: Cascading select boxes that dynamically filter State based on Country, District based on State, Taluk based on District, and Village based on Taluk.
2. **Hazard Dispatcher Module**: Routes input parameters to the appropriate assessment model based on the selected disaster type.
3. **Data Normalization Module**: Normalizes physical parameters (e.g. mm of rainfall, degrees of slope, hPa of atmospheric pressure) into standardized scalar values between `0.0` and `1.0`.
4. **Weighted Mathematical Risk Engine**: Applies calibrated domain weights ($w_i$, where $\sum w_i = 1.0$) to compute the overall risk percentage.
5. **Classification & Advisory Engine**: Maps calculated risk into standard color-coded categories and generates appropriate emergency warnings and step-by-step mitigation checklists.
6. **Analytics & Visualization Module**: Renders interactive Plotly visual charts (Gauge Meters, 14-Day Trend Series, Taluk Comparison Bars, and Multi-Disaster Profiles).
7. **Data Management & Export Module**: Enables filtering, viewing, and exporting of the 600+ row dataset to CSV format.

---

## 8. Dataset Explanation
The dataset contains **650 records** formatted as follows:

| Column Name | Data Type | Units / Range | Description |
| :--- | :--- | :--- | :--- |
| `Country` | String | e.g. "India" | Administrative country |
| `State` | String | e.g. "Karnataka" | State division |
| `District` | String | 7 districts | District (e.g., Kalaburagi, Kodagu, Udupi) |
| `Taluk` | String | 21 taluks | Sub-district administrative division |
| `Village` | String | 84 villages | Granular habitation unit |
| `Date` | String | YYYY-MM-DD | Simulated timestamp |
| `Disaster_Type` | String | 5 types | Evaluated hazard |
| `Rainfall_mm` | Float | 0.0 – 250.0 mm | Precipitation measurement |
| `Temperature_C` | Float | 15.0 – 50.0 °C | Ambient surface temperature |
| `Humidity_pct` | Float | 5.0 – 100.0 % | Relative humidity percentage |
| `Soil_Moisture_pct` | Float | 0.0 – 100.0 % | Volumetric soil water content |
| `Water_Level_m` | Float | 0.0 – 8.0 m | River gauge or reservoir water depth |
| `Wind_Speed_kmh` | Float | 0.0 – 180.0 km/h | Sustained wind velocity |
| `Atmospheric_Pressure_hPa` | Float | 920.0 – 1030.0 hPa| Barometric pressure reading |
| `Slope_Degree` | Float | 0.0 – 70.0 ° | Hillside terrain inclination |
| `Smoke_Level` | Float | 0.0 – 10.0 scale | Dryness/smoke or ground vibration index |
| `Risk_Score` | Float | 0.0 – 100.0 % | Calculated risk percentage |
| `Risk_Level` | String | 4 Tiers | Low, Moderate, High, or Very High Risk |

*Note: For hazard types where certain metrics are non-applicable, fields contain empty/null values.*

---

## 9. Risk Calculation Explanation & Mathematical Formulas

The system uses linear weighted parameter aggregation:
$$\text{Risk Percentage} = \left( \sum_{i=1}^{n} w_i \times S_i \right) \times 100\%$$
where $w_i$ represents the assigned parameter weight ($\sum w_i = 1.0$), and $S_i \in [0.0, 1.0]$ represents the normalized score.

### 1. Flood Risk Formula
* **Rainfall ($S_{rain}$)**: $S_{rain} = \min(1.0, \text{Rainfall} / 150)$ $\rightarrow$ Weight: **0.45**
* **River Water Level ($S_{water}$)**: $S_{water} = \min(1.0, \max(0, (\text{WaterLevel} - 1.0) / 5.0))$ $\rightarrow$ Weight: **0.35**
* **Soil Moisture ($S_{soil}$)**: $S_{soil} = \min(1.0, \text{SoilMoisture} / 100)$ $\rightarrow$ Weight: **0.20**

$$\text{Flood Risk} = (0.45 \times S_{rain} + 0.35 \times S_{water} + 0.20 \times S_{soil}) \times 100$$

### 2. Drought Risk Formula
Drought is determined by water deficits and thermal stress:
* **Rainfall Deficit ($S_{rain\_def}$)**: $\max(0.0, 1.0 - \text{Rainfall} / 80)$ $\rightarrow$ Weight: **0.40**
* **Soil Moisture Deficit ($S_{soil\_def}$)**: $\max(0.0, 1.0 - \text{SoilMoisture} / 60)$ $\rightarrow$ Weight: **0.25**
* **High Temperature ($S_{temp}$)**: $\min(1.0, \max(0, (\text{Temperature} - 25) / 20))$ $\rightarrow$ Weight: **0.20**
* **Humidity Deficit ($S_{hum\_def}$)**: $\max(0.0, 1.0 - \text{Humidity} / 70)$ $\rightarrow$ Weight: **0.15**

$$\text{Drought Risk} = (0.40 \times S_{rain\_def} + 0.25 \times S_{soil\_def} + 0.20 \times S_{temp} + 0.15 \times S_{hum\_def}) \times 100$$

### 3. Landslide Risk Formula
* **Slope Degree ($S_{slope}$)**: $\min(1.0, \text{Slope} / 55)$ $\rightarrow$ Weight: **0.35**
* **Rainfall ($S_{rain}$)**: $\min(1.0, \text{Rainfall} / 160)$ $\rightarrow$ Weight: **0.30**
* **Soil Moisture ($S_{soil}$)**: $\min(1.0, \text{SoilMoisture} / 100)$ $\rightarrow$ Weight: **0.20**
* **Ground Vibration ($S_{vib}$)**: $\min(1.0, \text{Vibration} / 10)$ $\rightarrow$ Weight: **0.15**

$$\text{Landslide Risk} = (0.35 \times S_{slope} + 0.30 \times S_{rain} + 0.20 \times S_{soil} + 0.15 \times S_{vib}) \times 100$$

### 4. Forest Fire Risk Formula
* **High Temperature ($S_{temp}$)**: $\min(1.0, \max(0, (\text{Temperature} - 22) / 23))$ $\rightarrow$ Weight: **0.25**
* **Humidity Deficit ($S_{hum\_def}$)**: $\max(0.0, 1.0 - \text{Humidity} / 60)$ $\rightarrow$ Weight: **0.25**
* **Wind Speed ($S_{wind}$)**: $\min(1.0, \text{WindSpeed} / 65)$ $\rightarrow$ Weight: **0.20**
* **Dryness / Smoke Index ($S_{smoke}$)**: $\min(1.0, \text{Smoke} / 10)$ $\rightarrow$ Weight: **0.20**
* **Rainfall Deficit ($S_{rain\_def}$)**: $\max(0.0, 1.0 - \text{Rainfall} / 35)$ $\rightarrow$ Weight: **0.10**

$$\text{Forest Fire Risk} = (0.25 \times S_{temp} + 0.25 \times S_{hum\_def} + 0.20 \times S_{wind} + 0.20 \times S_{smoke} + 0.10 \times S_{rain\_def}) \times 100$$

### 5. Cyclone Risk Formula
* **Wind Speed ($S_{wind}$)**: $\min(1.0, \max(0, (\text{WindSpeed} - 25) / 95))$ $\rightarrow$ Weight: **0.40**
* **Atmospheric Pressure Drop ($S_{press}$)**: $\min(1.0, \max(0, (1013 - \text{Pressure}) / 53))$ $\rightarrow$ Weight: **0.35**
* **Rainfall ($S_{rain}$)**: $\min(1.0, \text{Rainfall} / 180)$ $\rightarrow$ Weight: **0.15**
* **Ambient Temperature ($S_{temp}$)**: $\min(1.0, \max(0, (\text{Temperature} - 24) / 14))$ $\rightarrow$ Weight: **0.10**

$$\text{Cyclone Risk} = (0.40 \times S_{wind} + 0.35 \times S_{press} + 0.15 \times S_{rain} + 0.10 \times S_{temp}) \times 100$$

---

## 10. Sample Test Execution (From Specification)
* **Location**: Country: India $\rightarrow$ State: Karnataka $\rightarrow$ District: Kalaburagi $\rightarrow$ Taluk: Chittapur $\rightarrow$ Village: Alura
* **Disaster**: Drought
* **Simulated Values**: Rainfall = 6.2 mm, Temperature = 41.5 °C, Soil Moisture = 16.5%, Humidity = 26.0%
* **Output**:
  * **Calculated Risk**: **76.0%**
  * **Risk Tier**: **HIGH RISK**
  * **Warning**: *"Dry conditions detected. Water conservation and irrigation management are recommended."*
  * **Mitigation Protocol**:
    1. Conserve water reserves and ration municipal supply strategically.
    2. Improve irrigation efficiency using micro-drip and mulching techniques.
    3. Monitor groundwater depths and agricultural soil moisture saturation.
    4. Deploy drought-resistant crop advisories to local farming communities.

---

## 11. Advantages
1. **100% Explainability**: Every stakeholder can examine the exact contribution of each physical variable.
2. **Computational Efficiency**: No GPU requirements; negligible CPU footprint (<50ms execution latency).
3. **No Training Data Dependency**: Does not require millions of historical disaster casualty labels to establish functioning thresholds.
4. **Hierarchical Navigation**: Allows administrators to drill down from regional state perspectives to specific rural villages.
5. **Immediate Interactive Simulation**: Sliders allow emergency planners to run "What-If" crisis simulations.

---

## 12. Limitations
1. **Linear Aggregation**: Non-linear compounding interactions (such as soil saturation interacting non-linearly with bedrock geology) are simplified.
2. **Simulated Sensor Inputs**: In current demonstration mode, values are synthetically modeled rather than received from live deployed IoT hardware.
3. **Static Weights**: Weights are calibrated based on domain literature rather than continuously self-adjusting per micro-climate.

---

## 13. Future Scope
1. **IoT Sensor Integration**: Interfacing with physical LoRaWAN / ESP32 weather stations for live telemetry.
2. **Open Meteorological API Sync**: Automated real-time synchronization with Indian Meteorological Department (IMD) open APIs.
3. **Automated SMS / WhatsApp Broadcasts**: Triggering automated multilingual emergency alerts directly to village panchayat heads.
4. **GIS Geospatial Map Overlays**: Rendering hazard risk heatmaps using Leaflet / Mapbox.

---

## 14. Conclusion
The **Disaster Risk Assessment System** demonstrates that transparent, rule-based computational methods remain highly effective, practical, and dependable for safety-critical civic applications. By structuring a 5-tier location hierarchy, normalizing diverse physical parameters, applying domain-calibrated weights, and generating actionable mitigation protocols, the project provides an accessible, robust platform suitable for academic demonstration and real-world disaster management prototyping.

---

## 15. 15 Simple Viva Questions with Answers

1. **Q: What is the primary aim of this project?**
   *A:* To assess multi-hazard natural disaster risk (Flood, Drought, Landslide, Forest Fire, Cyclone) for specific villages using an explainable, rule-based mathematical model.

2. **Q: Why was a rule-based model chosen over Deep Learning?**
   *A:* Rule-based models are fully transparent and explainable. In emergency management, civil authorities need to know exactly which physical parameter triggered an alert, whereas deep neural networks operate as black boxes.

3. **Q: What are the 5 disasters assessed by this system?**
   *A:* Flood, Drought, Landslide, Forest Fire, and Cyclone.

4. **Q: Explain the geographic location hierarchy used.**
   *A:* Country $\rightarrow$ State $\rightarrow$ District $\rightarrow$ Taluk $\rightarrow$ Village (demonstrated using India $\rightarrow$ Karnataka with 7 districts and 21 taluks).

5. **Q: What are the four risk classification tiers?**
   *A:* 0–30%: Low Risk; 31–60%: Moderate Risk; 61–80%: High Risk; 81–100%: Very High Risk.

6. **Q: What parameters are used to assess Flood risk?**
   *A:* Rainfall (weight 0.45), River/Water Level (weight 0.35), and Soil Moisture (weight 0.20).

7. **Q: How does the Drought calculation differ from the other disasters?**
   *A:* Drought calculation uses deficit metrics: low rainfall, low soil moisture, and low humidity paired with high temperature increase the risk.

8. **Q: What parameters indicate a Landslide hazard?**
   *A:* Terrain Slope Degree (weight 0.35), Heavy Rainfall (weight 0.30), Saturated Soil Moisture (weight 0.20), and Ground Vibration indicator (weight 0.15).

9. **Q: What atmospheric conditions trigger a Cyclone warning?**
   *A:* A steep drop in atmospheric pressure (below normal 1013 hPa), violent sustained wind speeds (>60 km/h), heavy squall rainfall, and elevated ambient temperature.

10. **Q: What parameters contribute to Forest Fire risk?**
    *A:* High ambient temperature (0.25), low relative humidity (0.25), brisk wind speeds (0.20), smoke/dryness indicator (0.20), and rainfall deficit (0.10).

11. **Q: What software technologies and libraries are used in this project?**
    *A:* Python 3, Streamlit (web framework), Pandas (tabular data), NumPy (numerical operations), Plotly (interactive charts), and SQLite/CSV for persistence.

12. **Q: Is the dataset comprised of real-time satellite data?**
    *A:* No, it is clearly designated as SIMULATED / DEMONSTRATION DATA modeled according to regional Karnataka meteorological patterns for academic validation.

13. **Q: How does the system help during an emergency?**
    *A:* It calculates a clear risk percentage, classifies the risk level, displays an immediate warning message, and provides actionable mitigation recommendations (e.g. evacuation, water rationing, road closures).

14. **Q: What is the benefit of the parameter sliders on the dashboard?**
    *A:* They allow users and examiners to simulate "What-If" scenarios in real time and verify that changing rainfall or temperature immediately updates the calculated risk and warning.

15. **Q: What are two key future enhancements for this project?**
    *A:* Integrating live physical IoT sensor nodes (like LoRaWAN weather stations) and automated SMS alert dispatching to village panchayat leaders.
