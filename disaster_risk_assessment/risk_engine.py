"""
Risk Engine for Disaster Risk Assessment System
=================================================
A transparent, explainable, rule-based mathematical model
for computing multi-hazard disaster risks (Flood, Drought, Landslide, Forest Fire, Cyclone).

Academic Project: 7th Semester B.E. / B.Tech Computer Science and Engineering
Author: Student Academic Submission
"""

import math

# Risk level boundaries
RISK_LEVEL_LOW = "Low Risk"
RISK_LEVEL_MODERATE = "Moderate Risk"
RISK_LEVEL_HIGH = "High Risk"
RISK_LEVEL_VERY_HIGH = "Very High Risk"

def classify_risk(score_pct: float) -> str:
    """Classifies risk percentage into standard 4-tier risk categories."""
    if score_pct <= 30.0:
        return RISK_LEVEL_LOW
    elif score_pct <= 60.0:
        return RISK_LEVEL_MODERATE
    elif score_pct <= 80.0:
        return RISK_LEVEL_HIGH
    else:
        return RISK_LEVEL_VERY_HIGH

def get_risk_theme(level: str):
    """Returns color code and icon indicator for dashboard display."""
    if level == RISK_LEVEL_LOW:
        return {"color": "#10B981", "badge": "bg-green-100 text-green-800", "label": "LOW RISK"}
    elif level == RISK_LEVEL_MODERATE:
        return {"color": "#F59E0B", "badge": "bg-yellow-100 text-yellow-800", "label": "MODERATE RISK"}
    elif level == RISK_LEVEL_HIGH:
        return {"color": "#F97316", "badge": "bg-orange-100 text-orange-800", "label": "HIGH RISK"}
    else:
        return {"color": "#EF4444", "badge": "bg-red-100 text-red-800", "label": "VERY HIGH RISK"}

def calculate_flood_risk(rainfall_mm: float, water_level_m: float, soil_moisture_pct: float) -> dict:
    """
    Flood Risk Assessment Model
    Parameters:
      - Rainfall (mm): Weight = 0.45
      - Water Level (m): Weight = 0.35
      - Soil Moisture (%): Weight = 0.20
    """
    # Normalization (0.0 to 1.0)
    s_rain = min(1.0, max(0.0, rainfall_mm / 150.0))
    s_water = min(1.0, max(0.0, (water_level_m - 1.0) / 5.0))
    s_soil = min(1.0, max(0.0, soil_moisture_pct / 100.0))

    w_rain = 0.45
    w_water = 0.35
    w_soil = 0.20

    weighted_sum = (w_rain * s_rain) + (w_water * s_water) + (w_soil * s_soil)
    risk_pct = round(weighted_sum * 100.0, 1)
    risk_level = classify_risk(risk_pct)

    # Advisory generation
    if risk_pct > 60:
        warning = "CRITICAL ALERT: Severe waterlogging and imminent river overflow detected in low-lying zones."
    elif risk_pct > 30:
        warning = "ADVISORY: River gauges elevated; saturated soil limits absorption capacity."
    else:
        warning = "NORMAL: Water levels and rainfall within manageable reservoir capacity."

    recommendations = [
        "Monitor water levels and reservoir inflow gauges continuously",
        "Move people and livestock from vulnerable low-lying riverbeds if necessary",
        "Avoid flood-prone causeways, underground culverts, and submerged roads",
        "Keep municipal drain pumps and relief boat stations on standby"
    ]

    return {
        "disaster": "Flood",
        "risk_percentage": risk_pct,
        "risk_level": risk_level,
        "warning": warning,
        "recommendations": recommendations,
        "parameters": {
            "Rainfall": {"value": rainfall_mm, "unit": "mm", "score": round(s_rain, 3), "weight": w_rain},
            "River Water Level": {"value": water_level_m, "unit": "m", "score": round(s_water, 3), "weight": w_water},
            "Soil Moisture": {"value": soil_moisture_pct, "unit": "%", "score": round(s_soil, 3), "weight": w_soil},
        },
        "formula": "Risk = (0.45 * S_rain + 0.35 * S_water + 0.20 * S_soil) * 100"
    }

def calculate_drought_risk(rainfall_mm: float, temperature_c: float, soil_moisture_pct: float, humidity_pct: float) -> dict:
    """
    Drought Risk Assessment Model
    Parameters:
      - Rainfall Deficit: Weight = 0.40
      - Soil Moisture Deficit: Weight = 0.25
      - Temperature: Weight = 0.20
      - Humidity Deficit: Weight = 0.15
    """
    # Deficit normalized: 0 is moist/wet, 1 is bone-dry
    s_rain_def = min(1.0, max(0.0, 1.0 - (rainfall_mm / 80.0)))
    s_temp = min(1.0, max(0.0, (temperature_c - 25.0) / 20.0))
    s_soil_def = min(1.0, max(0.0, 1.0 - (soil_moisture_pct / 60.0)))
    s_hum_def = min(1.0, max(0.0, 1.0 - (humidity_pct / 70.0)))

    w_rain = 0.40
    w_soil = 0.25
    w_temp = 0.20
    w_hum = 0.15

    weighted_sum = (w_rain * s_rain_def) + (w_soil * s_soil_def) + (w_temp * s_temp) + (w_hum * s_hum_def)
    risk_pct = round(weighted_sum * 100.0, 1)
    risk_level = classify_risk(risk_pct)

    if risk_pct > 60:
        warning = "Dry conditions detected. Water conservation and irrigation management are recommended."
    elif risk_pct > 30:
        warning = "MODERATE DRY SPELL: Soil moisture declining; optimal irrigation scheduling advised."
    else:
        warning = "NORMAL: Adequate precipitation balance and healthy groundwater recharge levels."

    recommendations = [
        "Conserve water reserves and ration municipal supply strategically",
        "Improve irrigation efficiency using micro-drip and mulching techniques",
        "Monitor groundwater depths and agricultural soil moisture saturation",
        "Deploy drought-resistant crop advisories to local farming communities"
    ]

    return {
        "disaster": "Drought",
        "risk_percentage": risk_pct,
        "risk_level": risk_level,
        "warning": warning,
        "recommendations": recommendations,
        "parameters": {
            "Rainfall Deficit": {"value": rainfall_mm, "unit": "mm", "score": round(s_rain_def, 3), "weight": w_rain},
            "Soil Moisture Deficit": {"value": soil_moisture_pct, "unit": "%", "score": round(s_soil_def, 3), "weight": w_soil},
            "High Temperature": {"value": temperature_c, "unit": "°C", "score": round(s_temp, 3), "weight": w_temp},
            "Humidity Deficit": {"value": humidity_pct, "unit": "%", "score": round(s_hum_def, 3), "weight": w_hum},
        },
        "formula": "Risk = (0.40 * S_rain_def + 0.25 * S_soil_def + 0.20 * S_temp + 0.15 * S_hum_def) * 100"
    }

def calculate_landslide_risk(rainfall_mm: float, soil_moisture_pct: float, slope_degree: float, ground_vibration: float) -> dict:
    """
    Landslide Risk Assessment Model
    Parameters:
      - Slope Degree (°): Weight = 0.35
      - Rainfall (mm): Weight = 0.30
      - Soil Moisture (%): Weight = 0.20
      - Ground / Vibration Indicator: Weight = 0.15
    """
    s_slope = min(1.0, max(0.0, slope_degree / 55.0))
    s_rain = min(1.0, max(0.0, rainfall_mm / 160.0))
    s_soil = min(1.0, max(0.0, soil_moisture_pct / 100.0))
    s_vib = min(1.0, max(0.0, ground_vibration / 10.0))

    w_slope = 0.35
    w_rain = 0.30
    w_soil = 0.20
    w_vib = 0.15

    weighted_sum = (w_slope * s_slope) + (w_rain * s_rain) + (w_soil * s_soil) + (w_vib * s_vib)
    risk_pct = round(weighted_sum * 100.0, 1)
    risk_level = classify_risk(risk_pct)

    if risk_pct > 60:
        warning = "CRITICAL SLOPE HAZARD: High shear stress and saturation along hilly terrain."
    elif risk_pct > 30:
        warning = "MODERATE RISK: Increased moisture detected on elevated gradients."
    else:
        warning = "STABLE: Slope cohesion is firm with nominal pore water pressure."

    recommendations = [
        "Monitor unstable slopes, retaining walls, and downhill drainage fissures",
        "Restrict access to high-risk mountain passes and landslide-prone roads",
        "Monitor heavy rainfall and seismic geophone / tiltmeter readings",
        "Pre-position earth-moving machinery along arterial ghat corridors"
    ]

    return {
        "disaster": "Landslide",
        "risk_percentage": risk_pct,
        "risk_level": risk_level,
        "warning": warning,
        "recommendations": recommendations,
        "parameters": {
            "Slope Degree": {"value": slope_degree, "unit": "°", "score": round(s_slope, 3), "weight": w_slope},
            "Rainfall": {"value": rainfall_mm, "unit": "mm", "score": round(s_rain, 3), "weight": w_rain},
            "Soil Moisture": {"value": soil_moisture_pct, "unit": "%", "score": round(s_soil, 3), "weight": w_soil},
            "Ground Vibration": {"value": ground_vibration, "unit": "scale (1-10)", "score": round(s_vib, 3), "weight": w_vib},
        },
        "formula": "Risk = (0.35 * S_slope + 0.30 * S_rain + 0.20 * S_soil + 0.15 * S_vib) * 100"
    }

def calculate_forest_fire_risk(temperature_c: float, humidity_pct: float, rainfall_mm: float, wind_speed_kmh: float, smoke_level: float) -> dict:
    """
    Forest Fire Risk Assessment Model
    Parameters:
      - High Temperature (°C): Weight = 0.25
      - Low Humidity Deficit (%): Weight = 0.25
      - Wind Speed (km/h): Weight = 0.20
      - Dryness / Smoke Indicator (1-10): Weight = 0.20
      - Rainfall Deficit: Weight = 0.10
    """
    s_temp = min(1.0, max(0.0, (temperature_c - 22.0) / 23.0))
    s_hum_def = min(1.0, max(0.0, 1.0 - (humidity_pct / 60.0)))
    s_wind = min(1.0, max(0.0, wind_speed_kmh / 65.0))
    s_smoke = min(1.0, max(0.0, smoke_level / 10.0))
    s_rain_def = min(1.0, max(0.0, 1.0 - (rainfall_mm / 35.0)))

    w_temp = 0.25
    w_hum = 0.25
    w_wind = 0.20
    w_smoke = 0.20
    w_rain = 0.10

    weighted_sum = (w_temp * s_temp) + (w_hum * s_hum_def) + (w_wind * s_wind) + (w_smoke * s_smoke) + (w_rain * s_rain_def)
    risk_pct = round(weighted_sum * 100.0, 1)
    risk_level = classify_risk(risk_pct)

    if risk_pct > 60:
        warning = "EXTREME WILDFIRE DANGER: High thermal indices, dry biomass, and brisk winds present."
    elif risk_pct > 30:
        warning = "MODERATE FIRE WEATHER: Forest floor combustible matter drying rapidly."
    else:
        warning = "LOW FIRE RISK: Vegetation moisture remains sufficient; atmospheric conditions humid."

    recommendations = [
        "Monitor temperature, relative humidity, and canopy dryness continuously",
        "Avoid agricultural stubble burning and campfire activities that can cause ignition",
        "Alert forest range officers and emergency response teams when risk is high",
        "Prepare firebreak lines and position rapid-response water mist units"
    ]

    return {
        "disaster": "Forest Fire",
        "risk_percentage": risk_pct,
        "risk_level": risk_level,
        "warning": warning,
        "recommendations": recommendations,
        "parameters": {
            "High Temperature": {"value": temperature_c, "unit": "°C", "score": round(s_temp, 3), "weight": w_temp},
            "Humidity Deficit": {"value": humidity_pct, "unit": "%", "score": round(s_hum_def, 3), "weight": w_hum},
            "Wind Speed": {"value": wind_speed_kmh, "unit": "km/h", "score": round(s_wind, 3), "weight": w_wind},
            "Smoke / Dryness": {"value": smoke_level, "unit": "scale (1-10)", "score": round(s_smoke, 3), "weight": w_smoke},
            "Rainfall Deficit": {"value": rainfall_mm, "unit": "mm", "score": round(s_rain_def, 3), "weight": w_rain},
        },
        "formula": "Risk = (0.25 * S_temp + 0.25 * S_hum_def + 0.20 * S_wind + 0.20 * S_smoke + 0.10 * S_rain_def) * 100"
    }

def calculate_cyclone_risk(wind_speed_kmh: float, atmospheric_pressure_hpa: float, rainfall_mm: float, temperature_c: float) -> dict:
    """
    Cyclone Risk Assessment Model
    Parameters:
      - Wind Speed (km/h): Weight = 0.40
      - Pressure Drop (hPa): Weight = 0.35
      - Rainfall (mm): Weight = 0.15
      - Sea / Ambient Temperature (°C): Weight = 0.10
    """
    s_wind = min(1.0, max(0.0, (wind_speed_kmh - 25.0) / 95.0))
    s_press = min(1.0, max(0.0, (1013.0 - atmospheric_pressure_hpa) / 53.0))
    s_rain = min(1.0, max(0.0, rainfall_mm / 180.0))
    s_temp = min(1.0, max(0.0, (temperature_c - 24.0) / 14.0))

    w_wind = 0.40
    w_press = 0.35
    w_rain = 0.15
    w_temp = 0.10

    weighted_sum = (w_wind * s_wind) + (w_press * s_press) + (w_rain * s_rain) + (w_temp * s_temp)
    risk_pct = round(weighted_sum * 100.0, 1)
    risk_level = classify_risk(risk_pct)

    if risk_pct > 60:
        warning = "SEVERE CYCLONIC STORM THREAT: Steep barometric drop and destructive gale winds imminent."
    elif risk_pct > 30:
        warning = "TROPICAL DEPRESSION: Squally coastal gusts and scattered showers detected."
    else:
        warning = "CALM WEATHER: Atmospheric pressure is steady with light coastal breezes."

    recommendations = [
        "Monitor wind speeds and barometric pressure drops closely",
        "Follow official meteorological alerts and coastal fisheries bulletins",
        "Prepare evacuation plans and stock community cyclone shelters with provisions",
        "Secure loose tin roofing, billboards, and electrical utility lines"
    ]

    return {
        "disaster": "Cyclone",
        "risk_percentage": risk_pct,
        "risk_level": risk_level,
        "warning": warning,
        "recommendations": recommendations,
        "parameters": {
            "Wind Speed": {"value": wind_speed_kmh, "unit": "km/h", "score": round(s_wind, 3), "weight": w_wind},
            "Pressure Drop": {"value": atmospheric_pressure_hpa, "unit": "hPa", "score": round(s_press, 3), "weight": w_press},
            "Rainfall": {"value": rainfall_mm, "unit": "mm", "score": round(s_rain, 3), "weight": w_rain},
            "Temperature": {"value": temperature_c, "unit": "°C", "score": round(s_temp, 3), "weight": w_temp},
        },
        "formula": "Risk = (0.40 * S_wind + 0.35 * S_press + 0.15 * S_rain + 0.10 * S_temp) * 100"
    }

def assess_disaster_risk(disaster_type: str, env_data: dict) -> dict:
    """Unified dispatch function for disaster risk assessment."""
    if disaster_type == "Flood":
        return calculate_flood_risk(
            rainfall_mm=float(env_data.get("Rainfall_mm", 0.0)),
            water_level_m=float(env_data.get("Water_Level_m", 1.0)),
            soil_moisture_pct=float(env_data.get("Soil_Moisture_pct", 30.0))
        )
    elif disaster_type == "Drought":
        return calculate_drought_risk(
            rainfall_mm=float(env_data.get("Rainfall_mm", 0.0)),
            temperature_c=float(env_data.get("Temperature_C", 30.0)),
            soil_moisture_pct=float(env_data.get("Soil_Moisture_pct", 30.0)),
            humidity_pct=float(env_data.get("Humidity_pct", 50.0))
        )
    elif disaster_type == "Landslide":
        return calculate_landslide_risk(
            rainfall_mm=float(env_data.get("Rainfall_mm", 0.0)),
            soil_moisture_pct=float(env_data.get("Soil_Moisture_pct", 30.0)),
            slope_degree=float(env_data.get("Slope_Degree", 15.0)),
            ground_vibration=float(env_data.get("Ground_Vibration", 1.0))
        )
    elif disaster_type == "Forest Fire":
        return calculate_forest_fire_risk(
            temperature_c=float(env_data.get("Temperature_C", 30.0)),
            humidity_pct=float(env_data.get("Humidity_pct", 40.0)),
            rainfall_mm=float(env_data.get("Rainfall_mm", 0.0)),
            wind_speed_kmh=float(env_data.get("Wind_Speed_kmh", 15.0)),
            smoke_level=float(env_data.get("Smoke_Level", 1.0))
        )
    elif disaster_type == "Cyclone":
        return calculate_cyclone_risk(
            wind_speed_kmh=float(env_data.get("Wind_Speed_kmh", 20.0)),
            atmospheric_pressure_hpa=float(env_data.get("Atmospheric_Pressure_hPa", 1010.0)),
            rainfall_mm=float(env_data.get("Rainfall_mm", 10.0)),
            temperature_c=float(env_data.get("Temperature_C", 28.0))
        )
    else:
        raise ValueError(f"Unsupported disaster type: {disaster_type}")
