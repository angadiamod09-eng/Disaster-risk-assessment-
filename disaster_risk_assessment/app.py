"""
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
    """Loads dataset from CSV fallback to SQLite if needed."""
    if os.path.exists(CSV_FILE):
        df = pd.read_csv(CSV_FILE)
    elif os.path.exists(DB_FILE):
        conn = sqlite3.connect(DB_FILE)
        df = pd.read_sql_query("SELECT * FROM disaster_records", conn)
        conn.close()
    else:
        st.error("Dataset not found. Please run 'python generate_dataset.py' first.")
        st.stop()
    return df

df_full = load_data()

# ----------------- Custom Styling -----------------
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1E3A8A;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #4B5563;
        margin-bottom: 1.2rem;
    }
    .metric-card {
        background-color: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 16px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .warning-box {
        padding: 14px 18px;
        border-radius: 8px;
        font-weight: 500;
        margin-top: 10px;
    }
    .demo-tag {
        background-color: #FEF3C7;
        color: #92400E;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.5px;
    }
</style>
""", unsafe_allow_html=True)

# ----------------- Top Header -----------------
col_title, col_badge = st.columns([3, 1])
with col_title:
    st.markdown('<div class="main-header">🛡️ Disaster Risk Assessment System</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Rule-Based Multi-Hazard Risk Evaluation Engine • 7th-Semester CSE Academic Project</div>', unsafe_allow_html=True)
with col_badge:
    st.markdown("""
        <div style="text-align: right; padding-top: 10px;">
            <span class="demo-tag">SIMULATED / DEMONSTRATION DATA</span>
            <div style="font-size: 0.8rem; color: #64748B; margin-top: 4px;">Rule-Based Analytical Engine</div>
        </div>
    """, unsafe_allow_html=True)

st.divider()

# ----------------- Sidebar: Location & Disaster Selection -----------------
st.sidebar.header("📍 Location & Disaster Selector")

# Country Selection
countries = sorted(df_full["Country"].unique().tolist())
selected_country = st.sidebar.selectbox("1. Country", countries, index=0)

# State Selection
df_state = df_full[df_full["Country"] == selected_country]
states = sorted(df_state["State"].unique().tolist())
selected_state = st.sidebar.selectbox("2. State", states, index=0)

# District Selection
df_district = df_state[df_state["State"] == selected_state]
districts = sorted(df_district["District"].unique().tolist())
# Set default to Kalaburagi if present for the project demonstration
default_dist_idx = districts.index("Kalaburagi") if "Kalaburagi" in districts else 0
selected_district = st.sidebar.selectbox("3. District", districts, index=default_dist_idx)

# Taluk Selection
df_taluk = df_district[df_district["District"] == selected_district]
taluks = sorted(df_taluk["Taluk"].unique().tolist())
default_taluk_idx = taluks.index("Chittapur") if "Chittapur" in taluks else 0
selected_taluk = st.sidebar.selectbox("4. Taluk", taluks, index=default_taluk_idx)

# Village Selection
df_village = df_taluk[df_taluk["Taluk"] == selected_taluk]
villages = sorted(df_village["Village"].unique().tolist())
default_village_idx = villages.index("Alura") if "Alura" in villages else 0
selected_village = st.sidebar.selectbox("5. Village", villages, index=default_village_idx)

st.sidebar.divider()

# Disaster Selector
disasters = ["Drought", "Flood", "Landslide", "Forest Fire", "Cyclone"]
default_disaster_idx = 0 if selected_district == "Kalaburagi" else 1
selected_disaster = st.sidebar.selectbox("6. Disaster Type", disasters, index=default_disaster_idx)

st.sidebar.info("""
**Hierarchy Selected:**
`%s` → `%s` → `%s` → `%s` → `%s`
""" % (selected_country, selected_state, selected_district, selected_taluk, selected_village))

# ----------------- Fetch / Simulate Environmental Values -----------------
# Filter for exact location record or compute typical defaults
matched_records = df_full[
    (df_full["Country"] == selected_country) &
    (df_full["State"] == selected_state) &
    (df_full["District"] == selected_district) &
    (df_full["Taluk"] == selected_taluk) &
    (df_full["Village"] == selected_village) &
    (df_full["Disaster_Type"] == selected_disaster)
]

# Baseline simulated values
if not matched_records.empty:
    sample_row = matched_records.iloc[0]
else:
    sample_row = df_full[df_full["Disaster_Type"] == selected_disaster].iloc[0]

# ----------------- Main Tabs -----------------
tab_assess, tab_analytics, tab_dataset, tab_docs = st.tabs([
    "🎯 Risk Assessment Dashboard",
    "📈 Analytics & Historical Trends",
    "📊 Dataset Explorer (CSV/SQLite)",
    "📚 Academic Report & Viva Prep"
])

with tab_assess:
    st.subheader(f"Current Environmental Parameters ({selected_disaster})")
    st.caption("Adjust sliders below to test different environmental conditions in real time (Rule-based model recalculates instantly).")

    # Dynamic input sliders based on disaster
    inputs_col, result_col = st.columns([1.1, 0.9])

    with inputs_col:
        st.markdown("**Environmental Sensor Inputs (Simulated Readings)**")

        if selected_disaster == "Flood":
            def_rain = float(sample_row["Rainfall_mm"]) if pd.notna(sample_row["Rainfall_mm"]) else 85.0
            def_water = float(sample_row["Water_Level_m"]) if pd.notna(sample_row["Water_Level_m"]) else 3.8
            def_soil = float(sample_row["Soil_Moisture_pct"]) if pd.notna(sample_row["Soil_Moisture_pct"]) else 82.0

            val_rain = st.slider("Rainfall (mm) [Weight: 0.45]", 0.0, 250.0, float(def_rain), 1.0)
            val_water = st.slider("River / Water Level (m) [Weight: 0.35]", 0.0, 8.0, float(def_water), 0.1)
            val_soil = st.slider("Soil Moisture (%) [Weight: 0.20]", 0.0, 100.0, float(def_soil), 1.0)

            result = calculate_flood_risk(val_rain, val_water, val_soil)

        elif selected_disaster == "Drought":
            # Preset values for Alura Chittapur demo
            is_demo = (selected_district == "Kalaburagi" and selected_village == "Alura")
            def_rain = 6.2 if is_demo else (float(sample_row["Rainfall_mm"]) if pd.notna(sample_row["Rainfall_mm"]) else 12.0)
            def_temp = 41.5 if is_demo else (float(sample_row["Temperature_C"]) if pd.notna(sample_row["Temperature_C"]) else 38.0)
            def_soil = 16.5 if is_demo else (float(sample_row["Soil_Moisture_pct"]) if pd.notna(sample_row["Soil_Moisture_pct"]) else 22.0)
            def_hum = 26.0 if is_demo else (float(sample_row["Humidity_pct"]) if pd.notna(sample_row["Humidity_pct"]) else 32.0)

            val_rain = st.slider("Rainfall (mm) [Deficit Weight: 0.40]", 0.0, 150.0, float(def_rain), 1.0)
            val_soil = st.slider("Soil Moisture (%) [Deficit Weight: 0.25]", 0.0, 100.0, float(def_soil), 1.0)
            val_temp = st.slider("Temperature (°C) [Weight: 0.20]", 15.0, 50.0, float(def_temp), 0.5)
            val_hum = st.slider("Relative Humidity (%) [Deficit Weight: 0.15]", 5.0, 100.0, float(def_hum), 1.0)

            result = calculate_drought_risk(val_rain, val_temp, val_soil, val_hum)

        elif selected_disaster == "Landslide":
            def_slope = float(sample_row["Slope_Degree"]) if pd.notna(sample_row["Slope_Degree"]) else 42.0
            def_rain = float(sample_row["Rainfall_mm"]) if pd.notna(sample_row["Rainfall_mm"]) else 115.0
            def_soil = float(sample_row["Soil_Moisture_pct"]) if pd.notna(sample_row["Soil_Moisture_pct"]) else 88.0
            def_vib = float(sample_row["Smoke_Level"]) if pd.notna(sample_row["Smoke_Level"]) else 6.5

            val_slope = st.slider("Terrain Slope (Degrees) [Weight: 0.35]", 0.0, 70.0, float(def_slope), 1.0)
            val_rain = st.slider("Rainfall (mm) [Weight: 0.30]", 0.0, 250.0, float(def_rain), 1.0)
            val_soil = st.slider("Soil Moisture (%) [Weight: 0.20]", 0.0, 100.0, float(def_soil), 1.0)
            val_vib = st.slider("Ground Vibration Indicator (1-10) [Weight: 0.15]", 0.0, 10.0, float(def_vib), 0.1)

            result = calculate_landslide_risk(val_rain, val_soil, val_slope, val_vib)

        elif selected_disaster == "Forest Fire":
            def_temp = float(sample_row["Temperature_C"]) if pd.notna(sample_row["Temperature_C"]) else 40.0
            def_hum = float(sample_row["Humidity_pct"]) if pd.notna(sample_row["Humidity_pct"]) else 20.0
            def_wind = float(sample_row["Wind_Speed_kmh"]) if pd.notna(sample_row["Wind_Speed_kmh"]) else 38.0
            def_smoke = float(sample_row["Smoke_Level"]) if pd.notna(sample_row["Smoke_Level"]) else 7.0
            def_rain = float(sample_row["Rainfall_mm"]) if pd.notna(sample_row["Rainfall_mm"]) else 2.0

            val_temp = st.slider("Temperature (°C) [Weight: 0.25]", 15.0, 50.0, float(def_temp), 0.5)
            val_hum = st.slider("Relative Humidity (%) [Deficit Weight: 0.25]", 5.0, 100.0, float(def_hum), 1.0)
            val_wind = st.slider("Wind Speed (km/h) [Weight: 0.20]", 0.0, 90.0, float(def_wind), 1.0)
            val_smoke = st.slider("Dryness / Smoke Index (1-10) [Weight: 0.20]", 0.0, 10.0, float(def_smoke), 0.1)
            val_rain = st.slider("Rainfall (mm) [Deficit Weight: 0.10]", 0.0, 80.0, float(def_rain), 1.0)

            result = calculate_forest_fire_risk(val_temp, val_hum, val_rain, val_wind, val_smoke)

        elif selected_disaster == "Cyclone":
            def_wind = float(sample_row["Wind_Speed_kmh"]) if pd.notna(sample_row["Wind_Speed_kmh"]) else 88.0
            def_press = float(sample_row["Atmospheric_Pressure_hPa"]) if pd.notna(sample_row["Atmospheric_Pressure_hPa"]) else 978.0
            def_rain = float(sample_row["Rainfall_mm"]) if pd.notna(sample_row["Rainfall_mm"]) else 125.0
            def_temp = float(sample_row["Temperature_C"]) if pd.notna(sample_row["Temperature_C"]) else 29.5

            val_wind = st.slider("Wind Speed (km/h) [Weight: 0.40]", 0.0, 180.0, float(def_wind), 1.0)
            val_press = st.slider("Atmospheric Pressure (hPa) [Drop Weight: 0.35]", 920.0, 1030.0, float(def_press), 1.0)
            val_rain = st.slider("Rainfall (mm) [Weight: 0.15]", 0.0, 250.0, float(def_rain), 1.0)
            val_temp = st.slider("Ambient / Sea Temp (°C) [Weight: 0.10]", 20.0, 40.0, float(def_temp), 0.5)

            result = calculate_cyclone_risk(val_wind, val_press, val_rain, val_temp)

    with result_col:
        st.markdown("**Calculated Risk Assessment Result**")

        risk_val = result["risk_percentage"]
        risk_lvl = result["risk_level"]

        # Color badges according to level
        if risk_lvl == "Low Risk":
            color = "#10B981"
            bg_col = "#ECFDF5"
            border_col = "#A7F3D0"
        elif risk_lvl == "Moderate Risk":
            color = "#F59E0B"
            bg_col = "#FFFBEB"
            border_col = "#FDE68A"
        elif risk_lvl == "High Risk":
            color = "#F97316"
            bg_col = "#FFF7ED"
            border_col = "#FFEDD5"
        else:
            color = "#EF4444"
            bg_col = "#FEF2F2"
            border_col = "#FECACA"

        # Gauge Chart
        fig_gauge = go.Figure(go.Indicator(
            mode="gauge+number",
            value=risk_val,
            number={"suffix": "%", "font": {"size": 42, "color": color}},
            title={"text": f"{selected_disaster.upper()} RISK SCORE", "font": {"size": 16, "color": "#1E293B"}},
            gauge={
                "axis": {"range": [0, 100], "tickwidth": 1, "tickcolor": "#64748B"},
                "bar": {"color": color},
                "bgcolor": "white",
                "borderwidth": 2,
                "bordercolor": "#E2E8F0",
                "steps": [
                    {"range": [0, 30], "color": "#D1FAE5"},
                    {"range": [30, 60], "color": "#FEF3C7"},
                    {"range": [60, 80], "color": "#FFEDD5"},
                    {"range": [80, 100], "color": "#FEE2E2"}
                ],
                "threshold": {
                    "line": {"color": "red", "width": 4},
                    "thickness": 0.75,
                    "value": risk_val
                }
            }
        ))
        fig_gauge.update_layout(height=260, margin=dict(l=20, r=20, t=30, b=10))
        st.plotly_chart(fig_gauge, use_container_width=True)

        st.markdown(f"""
        <div style="background-color: {bg_col}; border: 1.5px solid {border_col}; border-radius: 8px; padding: 14px;">
            <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #475569;">Assessed Risk Level</div>
            <div style="font-size: 1.4rem; font-weight: 700; color: {color}; margin-bottom: 6px;">{risk_lvl.upper()}</div>
            <div style="font-size: 0.95rem; color: #1E293B; line-height: 1.4;"><strong>Warning:</strong> {result["warning"]}</div>
        </div>
        """, unsafe_allow_html=True)

    st.divider()

    # Recommended Actions
    st.subheader("🛡️ Recommended Mitigation Actions")
    rec_cols = st.columns(len(result["recommendations"]))
    for idx, rec in enumerate(result["recommendations"]):
        with rec_cols[idx]:
            st.markdown(f"""
            <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; height: 100%;">
                <div style="font-weight: 600; font-size: 0.85rem; color: #1E3A8A; margin-bottom: 4px;">Step {idx+1}</div>
                <div style="font-size: 0.88rem; color: #334155;">{rec}</div>
            </div>
            """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Formula Breakdown
    with st.expander("🔍 Transparent Mathematical Model & Weights Breakdown", expanded=True):
        st.markdown(f"**Mathematical Formula:** `{result['formula']}`")
        param_table = []
        for name, data in result["parameters"].items():
            param_table.append({
                "Parameter": name,
                "Measured Value": f"{data['value']} {data['unit']}",
                "Normalized Score (0-1)": data["score"],
                "Assigned Weight": data["weight"],
                "Contribution to Total (%)": f"{round(data['score'] * data['weight'] * 100, 2)}%"
            })
        st.dataframe(pd.DataFrame(param_table), use_container_width=True)
        st.caption("Total Risk Score = Sum of [Normalized Parameter Score × Weight] × 100%")

with tab_analytics:
    st.subheader("📈 Historical Trends & Multi-Hazard Comparison")

    col_chart1, col_chart2 = st.columns(2)

    with col_chart1:
        st.markdown(f"**14-Day Simulated Trend for {selected_village} ({selected_disaster})**")
        # Generate simulated 14 days time series
        dates = pd.date_range(end=pd.Timestamp.today(), periods=14).strftime("%b %d")
        import numpy as np
        np.random.seed(hash(selected_village + selected_disaster) % 10000)
        base_trend = max(5, min(95, result["risk_percentage"] + np.random.normal(0, 7, 14)))

        fig_trend = px.line(
            x=dates,
            y=base_trend,
            labels={"x": "Date", "y": "Risk Score (%)"},
            title=f"Risk Score Progression — {selected_village}",
            markers=True
        )
        fig_trend.add_hline(y=30, line_dash="dot", line_color="green", annotation_text="Low (30%)")
        fig_trend.add_hline(y=60, line_dash="dot", line_color="orange", annotation_text="Moderate (60%)")
        fig_trend.add_hline(y=80, line_dash="dot", line_color="red", annotation_text="High (80%)")
        fig_trend.update_layout(height=320)
        st.plotly_chart(fig_trend, use_container_width=True)

    with col_chart2:
        st.markdown(f"**Multi-Disaster Risk Profile for {selected_village}**")
        # Calculate simulated risk for all 5 hazards
        hazards = ["Flood", "Drought", "Landslide", "Forest Fire", "Cyclone"]
        hazard_scores = []
        for h in hazards:
            if h == selected_disaster:
                hazard_scores.append(result["risk_percentage"])
            else:
                # Use dataset average for this district or synthetic estimate
                dist_records = df_full[(df_full["District"] == selected_district) & (df_full["Disaster_Type"] == h)]
                avg_score = dist_records["Risk_Score"].mean() if not dist_records.empty else 28.0
                hazard_scores.append(round(avg_score, 1))

        fig_compare = px.bar(
            x=hazards,
            y=hazard_scores,
            color=hazards,
            labels={"x": "Hazard Type", "y": "Risk Score (%)"},
            title=f"All Hazard Comparison — {selected_village}"
        )
        fig_compare.update_layout(height=320, showlegend=False)
        st.plotly_chart(fig_compare, use_container_width=True)

    # Taluk-wise comparison within the selected District
    st.markdown(f"**Comparative Risk across Taluks in {selected_district} District**")
    taluk_summary = df_full[(df_full["District"] == selected_district) & (df_full["Disaster_Type"] == selected_disaster)]
    if not taluk_summary.empty:
        taluk_agg = taluk_summary.groupby("Taluk")["Risk_Score"].mean().reset_index()
        fig_taluks = px.bar(
            taluk_agg,
            x="Taluk",
            y="Risk_Score",
            text="Risk_Score",
            color="Risk_Score",
            color_continuous_scale="Reds",
            title=f"Average {selected_disaster} Risk Score across {selected_district} Taluks"
        )
        fig_taluks.update_traces(texttemplate='%{text:.1f}%', textposition='outside')
        fig_taluks.update_layout(height=300)
        st.plotly_chart(fig_taluks, use_container_width=True)

with tab_dataset:
    st.subheader("📊 Dataset Explorer")
    st.caption("Demonstration CSV records generated for academic verification. Contains 600+ records.")

    # Filters
    f_col1, f_col2, f_col3 = st.columns(3)
    with f_col1:
        dist_filter = st.multiselect("Filter District", df_full["District"].unique().tolist(), default=[selected_district])
    with f_col2:
        hazard_filter = st.multiselect("Filter Disaster", df_full["Disaster_Type"].unique().tolist(), default=[selected_disaster])
    with f_col3:
        level_filter = st.multiselect("Filter Risk Level", df_full["Risk_Level"].unique().tolist())

    filtered_df = df_full.copy()
    if dist_filter:
        filtered_df = filtered_df[filtered_df["District"].isin(dist_filter)]
    if hazard_filter:
        filtered_df = filtered_df[filtered_df["Disaster_Type"].isin(hazard_filter)]
    if level_filter:
        filtered_df = filtered_df[filtered_df["Risk_Level"].isin(level_filter)]

    st.write(f"Showing **{len(filtered_df)}** of **{len(df_full)}** records.")
    st.dataframe(filtered_df, use_container_width=True, height=350)

    # Download Analyzed Results Button
    csv_data = filtered_df.to_csv(index=False).encode('utf-8')
    st.download_button(
        label="📥 Download Analyzed Results (CSV)",
        data=csv_data,
        file_name="disaster_risk_assessment_analyzed_results.csv",
        mime="text/csv"
    )

with tab_docs:
    st.subheader("📚 CSE 7th-Semester Academic Project Documentation & Viva Preparation")

    st.markdown("""
    ### 1. Abstract
    Natural disasters cause devastating socio-economic losses worldwide. The **Disaster Risk Assessment System** is an interpretable, rule-based decision support system designed to assess the hazard susceptibility of localized geographic administrative units (Country → State → District → Taluk → Village). Focusing on five critical disasters—**Flood, Drought, Landslide, Forest Fire, and Cyclone**—the system processes multi-source simulated environmental telemetry (rainfall, river level, soil moisture, temperature, humidity, wind velocity, barometric pressure, slope angle, and smoke index). Normalized parameter scoring with domain-calibrated weight vectors computes an overall risk index classified into 4 standardized tiers (Low, Moderate, High, Very High). Transparent mathematical formulations provide explainable warnings and prioritized mitigation advisories.

    ### 2. Problem Statement
    Existing disaster response frameworks frequently rely on centralized, regional-level meteorological bulletins lacking granular taluk- and village-level sensitivity. Conversely, complex deep learning black-box models lack explainability, require prohibitive compute resources, and fail to clarify *why* an alert was issued. There is a pressing need for a transparent, reproducible, lightweight rule-based system enabling rural administrators and emergency coordinators to evaluate disaster vulnerabilities with transparent mathematical justification.

    ### 3. Objectives
    1. To design a multi-tiered administrative location selector (Country → State → District → Taluk → Village) focusing on Karnataka, India.
    2. To develop explainable, rule-based risk evaluation models for 5 natural disasters.
    3. To implement mathematical parameter normalization and weight vector aggregation without opaque black-box obscurity.
    4. To deliver real-time visual dashboards featuring risk gauges, multi-hazard analytics, warning alerts, and actionable mitigation protocols.
    5. To support structured dataset storage via CSV and relational SQLite persistence.

    ### 4. Existing System vs. Proposed System
    * **Existing System:** Broad-stroke regional advisories; black-box AI models that cannot be audited by civil administrators; lack of village-level granular indexing; complex installation footprints.
    * **Proposed System:** Granular 5-level hierarchy; 100% transparent rule-based linear weighted models; zero latency; explainable parameter contributions; intuitive web interface with exportable analytics.

    ### 5. Methodology & Workflow
    `Location Selection` → `Select Disaster Type` → `Load Environmental Data` → `Data Preprocessing & Normalization` → `Calculate Individual Risk Scores` → `Calculate Overall Risk Score` → `Classify Risk Tier` → `Display Dashboard, Warnings & Mitigation Actions`.

    ### 6. Risk Level Classification
    * **0% – 30%:** Low Risk (Green) — Normal baseline environmental metrics.
    * **31% – 60%:** Moderate Risk (Yellow/Orange) — Elevated caution; preventive protocols.
    * **61% – 80%:** High Risk (Orange/Amber) — Immediate resource mobilization required.
    * **81% – 100%:** Very High Risk (Red) — Critical emergency evacuation protocols.

    ### 7. 15 Simple Viva Questions & Answers
    """)

    viva_qa = [
        ("Q1: What is the primary objective of this project?", "To assess localized multi-hazard natural disaster risks (Flood, Drought, Landslide, Forest Fire, Cyclone) using a transparent, explainable rule-based mathematical model across administrative hierarchies down to the village level."),
        ("Q2: Why did you choose a rule-based model instead of Deep Learning / Machine Learning?", "Rule-based models provide 100% transparency and explainability. In disaster management, administrators must know exactly which physical parameter (e.g. river gauge or slope angle) triggered an alert. Machine learning models act as black boxes and require extensive labeled training data."),
        ("Q3: What are the 5 disasters handled in this system?", "Flood, Drought, Landslide, Forest Fire, and Cyclone."),
        ("Q4: What is the geographic hierarchy implemented?", "Country → State → District → Taluk → Village (demonstrated with India → Karnataka and districts like Kalaburagi, Kodagu, Udupi, etc.)."),
        ("Q5: What are the risk level thresholds?", "0–30%: Low Risk, 31–60%: Moderate Risk, 61–80%: High Risk, and 81–100%: Very High Risk."),
        ("Q6: How is the Flood Risk calculated?", "By normalizing Rainfall (0.45 weight), River Water Level (0.35 weight), and Soil Moisture (0.20 weight) and computing: Risk = (0.45*S_rain + 0.35*S_water + 0.20*S_soil) * 100%."),
        ("Q7: How is Drought Risk evaluated differently from other hazards?", "Drought is driven by deficits. It uses Rainfall Deficit (0.40), Soil Moisture Deficit (0.25), High Temperature (0.20), and Humidity Deficit (0.15). Lower rainfall and moisture increase drought risk."),
        ("Q8: What parameters trigger a Landslide alert?", "Slope Degree (0.35 weight), Heavy Rainfall (0.30 weight), Soil Saturation Moisture (0.20 weight), and Ground Vibration / Tilt Indicator (0.15 weight)."),
        ("Q9: What causes a Forest Fire risk surge in the model?", "High ambient temperature, low relative humidity (dryness), high wind velocity to fan flames, and dryness/smoke indicators."),
        ("Q10: What physical phenomenon is modeled for Cyclones?", "The combination of severe atmospheric pressure drop (barometric depression) below 1013 hPa, high wind speeds, heavy squall rainfall, and warm sea/ambient temperature."),
        ("Q11: What technologies are utilized in this implementation?", "Python 3, Streamlit for interactive reactive UI, Pandas for data frame management, NumPy for numerical operations, Plotly for responsive interactive charts, and SQLite/CSV for persistence."),
        ("Q12: Is the dataset real-time live satellite data or simulated?", "It is explicitly labeled as SIMULATED / DEMONSTRATION DATA modeled according to realistic regional meteorological thresholds in Karnataka for academic demonstration."),
        ("Q13: What happens when the risk exceeds 60% (High Risk)?", "The dashboard switches to critical warning mode, displays tailored evacuation/mitigation advisories, highlights the contributing parameters, and issues specific alerts."),
        ("Q14: What are the primary advantages of this system?", "Zero computational overhead, immediate real-time response, complete explainability, modular addition of new disasters or locations, and dual CSV/SQLite data portability."),
        ("Q15: What is the future scope for this project?", "Integrating live IoT sensor telemetry (LoRaWAN/MQTT), connecting with the Indian Meteorological Department (IMD) open API, SMS broadcast alerts to village heads, and GIS mapping overlays.")
    ]

    for q, a in viva_qa:
        st.markdown(f"**{q}**")
        st.markdown(f"> *{a}*")
        st.markdown("")
