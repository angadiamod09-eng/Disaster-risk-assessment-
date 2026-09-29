export type RiskLevel = "Low Risk" | "Moderate Risk" | "High Risk" | "Very High Risk";

export interface ParameterBreakdown {
  name: string;
  measuredValue: number;
  unit: string;
  normalizedScore: number;
  weight: number;
  weightedContribution: number;
}

export interface RiskAssessmentResult {
  disaster: string;
  riskScore: number;
  riskLevel: RiskLevel;
  warning: string;
  recommendations: string[];
  formula: string;
  parameters: ParameterBreakdown[];
  theme: {
    color: string;
    bgBadge: string;
    textBadge: string;
    border: string;
    bgCard: string;
  };
}

export function classifyRisk(score: number): RiskLevel {
  if (score <= 30.0) return "Low Risk";
  if (score <= 60.0) return "Moderate Risk";
  if (score <= 80.0) return "High Risk";
  return "Very High Risk";
}

export function getRiskTheme(level: RiskLevel) {
  switch (level) {
    case "Low Risk":
      return {
        color: "#10B981",
        bgBadge: "bg-emerald-100",
        textBadge: "text-emerald-800",
        border: "border-emerald-200",
        bgCard: "bg-emerald-50/60"
      };
    case "Moderate Risk":
      return {
        color: "#F59E0B",
        bgBadge: "bg-amber-100",
        textBadge: "text-amber-800",
        border: "border-amber-200",
        bgCard: "bg-amber-50/60"
      };
    case "High Risk":
      return {
        color: "#F97316",
        bgBadge: "bg-orange-100",
        textBadge: "text-orange-800",
        border: "border-orange-200",
        bgCard: "bg-orange-50/60"
      };
    case "Very High Risk":
      return {
        color: "#EF4444",
        bgBadge: "bg-red-100",
        textBadge: "text-red-800",
        border: "border-red-200",
        bgCard: "bg-red-50/60"
      };
  }
}

export function calculateFloodRisk(rainfallMm: number, waterLevelM: number, soilMoisturePct: number): RiskAssessmentResult {
  const sRain = Math.min(1.0, Math.max(0.0, rainfallMm / 150.0));
  const sWater = Math.min(1.0, Math.max(0.0, (waterLevelM - 1.0) / 5.0));
  const sSoil = Math.min(1.0, Math.max(0.0, soilMoisturePct / 100.0));

  const wRain = 0.45;
  const wWater = 0.35;
  const wSoil = 0.20;

  const raw = (wRain * sRain) + (wWater * sWater) + (wSoil * sSoil);
  const score = Math.round(raw * 1000) / 10;
  const level = classifyRisk(score);

  let warning = "Normal baseline reservoir levels and precipitation. No immediate inundation threat.";
  if (score > 60) {
    warning = "CRITICAL ALERT: Severe waterlogging and imminent river overflow detected in low-lying zones.";
  } else if (score > 30) {
    warning = "ADVISORY: River gauges elevated; saturated soil limits rainwater absorption capacity.";
  }

  const recommendations = [
    "Monitor water levels and reservoir inflow gauges continuously",
    "Move people and livestock from vulnerable low-lying riverbeds if necessary",
    "Avoid flood-prone causeways, underground culverts, and submerged roads",
    "Keep municipal drain pumps and relief boat stations on standby"
  ];

  const parameters: ParameterBreakdown[] = [
    {
      name: "Precipitation / Rainfall",
      measuredValue: rainfallMm,
      unit: "mm",
      normalizedScore: Math.round(sRain * 1000) / 1000,
      weight: wRain,
      weightedContribution: Math.round(sRain * wRain * 1000) / 10
    },
    {
      name: "River / Water Gauge Level",
      measuredValue: waterLevelM,
      unit: "m",
      normalizedScore: Math.round(sWater * 1000) / 1000,
      weight: wWater,
      weightedContribution: Math.round(sWater * wWater * 1000) / 10
    },
    {
      name: "Soil Moisture Saturation",
      measuredValue: soilMoisturePct,
      unit: "%",
      normalizedScore: Math.round(sSoil * 1000) / 1000,
      weight: wSoil,
      weightedContribution: Math.round(sSoil * wSoil * 1000) / 10
    }
  ];

  return {
    disaster: "Flood",
    riskScore: score,
    riskLevel: level,
    warning,
    recommendations,
    formula: "Risk = (0.45 × S_rain + 0.35 × S_water + 0.20 × S_soil) × 100%",
    parameters,
    theme: getRiskTheme(level)
  };
}

export function calculateDroughtRisk(
  rainfallMm: number,
  temperatureC: number,
  soilMoisturePct: number,
  humidityPct: number
): RiskAssessmentResult {
  const sRainDef = Math.min(1.0, Math.max(0.0, 1.0 - (rainfallMm / 80.0)));
  const sSoilDef = Math.min(1.0, Math.max(0.0, 1.0 - (soilMoisturePct / 60.0)));
  const sTemp = Math.min(1.0, Math.max(0.0, (temperatureC - 25.0) / 20.0));
  const sHumDef = Math.min(1.0, Math.max(0.0, 1.0 - (humidityPct / 70.0)));

  const wRain = 0.40;
  const wSoil = 0.25;
  const wTemp = 0.20;
  const wHum = 0.15;

  const raw = (wRain * sRainDef) + (wSoil * sSoilDef) + (wTemp * sTemp) + (wHum * sHumDef);
  const score = Math.round(raw * 1000) / 10;
  const level = classifyRisk(score);

  let warning = "Normal hydrological balance with sufficient ground moisture recharge.";
  if (score > 60) {
    warning = "Dry conditions detected. Water conservation and irrigation management are recommended.";
  } else if (score > 30) {
    warning = "MODERATE DRY SPELL: Soil moisture declining; scheduled irrigation advised.";
  }

  const recommendations = [
    "Conserve water reserves and ration municipal supply strategically",
    "Improve irrigation efficiency using micro-drip and mulching techniques",
    "Monitor groundwater depths and agricultural soil moisture saturation",
    "Deploy drought-resistant crop advisories to local farming communities"
  ];

  const parameters: ParameterBreakdown[] = [
    {
      name: "Rainfall Deficit",
      measuredValue: rainfallMm,
      unit: "mm",
      normalizedScore: Math.round(sRainDef * 1000) / 1000,
      weight: wRain,
      weightedContribution: Math.round(sRainDef * wRain * 1000) / 10
    },
    {
      name: "Soil Moisture Deficit",
      measuredValue: soilMoisturePct,
      unit: "%",
      normalizedScore: Math.round(sSoilDef * 1000) / 1000,
      weight: wSoil,
      weightedContribution: Math.round(sSoilDef * wSoil * 1000) / 10
    },
    {
      name: "Ambient Temperature",
      measuredValue: temperatureC,
      unit: "°C",
      normalizedScore: Math.round(sTemp * 1000) / 1000,
      weight: wTemp,
      weightedContribution: Math.round(sTemp * wTemp * 1000) / 10
    },
    {
      name: "Relative Humidity Deficit",
      measuredValue: humidityPct,
      unit: "%",
      normalizedScore: Math.round(sHumDef * 1000) / 1000,
      weight: wHum,
      weightedContribution: Math.round(sHumDef * wHum * 1000) / 10
    }
  ];

  return {
    disaster: "Drought",
    riskScore: score,
    riskLevel: level,
    warning,
    recommendations,
    formula: "Risk = (0.40 × S_rain_def + 0.25 × S_soil_def + 0.20 × S_temp + 0.15 × S_hum_def) × 100%",
    parameters,
    theme: getRiskTheme(level)
  };
}

export function calculateLandslideRisk(
  rainfallMm: number,
  soilMoisturePct: number,
  slopeDegree: number,
  groundVibration: number
): RiskAssessmentResult {
  const sSlope = Math.min(1.0, Math.max(0.0, slopeDegree / 55.0));
  const sRain = Math.min(1.0, Math.max(0.0, rainfallMm / 160.0));
  const sSoil = Math.min(1.0, Math.max(0.0, soilMoisturePct / 100.0));
  const sVib = Math.min(1.0, Math.max(0.0, groundVibration / 10.0));

  const wSlope = 0.35;
  const wRain = 0.30;
  const wSoil = 0.20;
  const wVib = 0.15;

  const raw = (wSlope * sSlope) + (wRain * sRain) + (wSoil * sSoil) + (wVib * sVib);
  const score = Math.round(raw * 1000) / 10;
  const level = classifyRisk(score);

  let warning = "Stable slope cohesion. Soil shear strength is nominal.";
  if (score > 60) {
    warning = "CRITICAL SLOPE HAZARD: High shear stress and saturation along hilly terrain.";
  } else if (score > 30) {
    warning = "MODERATE RISK: Increased moisture detected on elevated hillside gradients.";
  }

  const recommendations = [
    "Monitor unstable slopes, retaining walls, and downhill drainage fissures",
    "Restrict access to high-risk mountain passes and landslide-prone roads",
    "Monitor heavy rainfall and seismic geophone / tiltmeter readings",
    "Pre-position earth-moving machinery along arterial ghat corridors"
  ];

  const parameters: ParameterBreakdown[] = [
    {
      name: "Terrain Slope Degree",
      measuredValue: slopeDegree,
      unit: "°",
      normalizedScore: Math.round(sSlope * 1000) / 1000,
      weight: wSlope,
      weightedContribution: Math.round(sSlope * wSlope * 1000) / 10
    },
    {
      name: "Continuous Rainfall",
      measuredValue: rainfallMm,
      unit: "mm",
      normalizedScore: Math.round(sRain * 1000) / 1000,
      weight: wRain,
      weightedContribution: Math.round(sRain * wRain * 1000) / 10
    },
    {
      name: "Soil Moisture Saturation",
      measuredValue: soilMoisturePct,
      unit: "%",
      normalizedScore: Math.round(sSoil * 1000) / 1000,
      weight: wSoil,
      weightedContribution: Math.round(sSoil * wSoil * 1000) / 10
    },
    {
      name: "Ground Vibration / Tilt",
      measuredValue: groundVibration,
      unit: "index (0-10)",
      normalizedScore: Math.round(sVib * 1000) / 1000,
      weight: wVib,
      weightedContribution: Math.round(sVib * wVib * 1000) / 10
    }
  ];

  return {
    disaster: "Landslide",
    riskScore: score,
    riskLevel: level,
    warning,
    recommendations,
    formula: "Risk = (0.35 × S_slope + 0.30 × S_rain + 0.20 × S_soil + 0.15 × S_vib) × 100%",
    parameters,
    theme: getRiskTheme(level)
  };
}

export function calculateForestFireRisk(
  temperatureC: number,
  humidityPct: number,
  rainfallMm: number,
  windSpeedKmh: number,
  smokeLevel: number
): RiskAssessmentResult {
  const sTemp = Math.min(1.0, Math.max(0.0, (temperatureC - 22.0) / 23.0));
  const sHumDef = Math.min(1.0, Math.max(0.0, 1.0 - (humidityPct / 60.0)));
  const sWind = Math.min(1.0, Math.max(0.0, windSpeedKmh / 65.0));
  const sSmoke = Math.min(1.0, Math.max(0.0, smokeLevel / 10.0));
  const sRainDef = Math.min(1.0, Math.max(0.0, 1.0 - (rainfallMm / 35.0)));

  const wTemp = 0.25;
  const wHum = 0.25;
  const wWind = 0.20;
  const wSmoke = 0.20;
  const wRain = 0.10;

  const raw = (wTemp * sTemp) + (wHum * sHumDef) + (wWind * sWind) + (wSmoke * sSmoke) + (wRain * sRainDef);
  const score = Math.round(raw * 1000) / 10;
  const level = classifyRisk(score);

  let warning = "Low fire danger. Ambient forest canopy humidity maintains moisture threshold.";
  if (score > 60) {
    warning = "EXTREME WILDFIRE DANGER: High thermal indices, dry biomass, and brisk winds present.";
  } else if (score > 30) {
    warning = "MODERATE FIRE WEATHER: Forest floor combustible matter drying rapidly.";
  }

  const recommendations = [
    "Monitor temperature, relative humidity, and canopy dryness continuously",
    "Avoid agricultural stubble burning and campfire activities that can cause ignition",
    "Alert forest range officers and emergency response teams when risk is high",
    "Prepare firebreak lines and position rapid-response water mist units"
  ];

  const parameters: ParameterBreakdown[] = [
    {
      name: "Ambient Temperature",
      measuredValue: temperatureC,
      unit: "°C",
      normalizedScore: Math.round(sTemp * 1000) / 1000,
      weight: wTemp,
      weightedContribution: Math.round(sTemp * wTemp * 1000) / 10
    },
    {
      name: "Relative Humidity Deficit",
      measuredValue: humidityPct,
      unit: "%",
      normalizedScore: Math.round(sHumDef * 1000) / 1000,
      weight: wHum,
      weightedContribution: Math.round(sHumDef * wHum * 1000) / 10
    },
    {
      name: "Surface Wind Velocity",
      measuredValue: windSpeedKmh,
      unit: "km/h",
      normalizedScore: Math.round(sWind * 1000) / 1000,
      weight: wWind,
      weightedContribution: Math.round(sWind * wWind * 1000) / 10
    },
    {
      name: "Dryness / Smoke Index",
      measuredValue: smokeLevel,
      unit: "index (0-10)",
      normalizedScore: Math.round(sSmoke * 1000) / 1000,
      weight: wSmoke,
      weightedContribution: Math.round(sSmoke * wSmoke * 1000) / 10
    },
    {
      name: "Rainfall Deficit",
      measuredValue: rainfallMm,
      unit: "mm",
      normalizedScore: Math.round(sRainDef * 1000) / 1000,
      weight: wRain,
      weightedContribution: Math.round(sRainDef * wRain * 1000) / 10
    }
  ];

  return {
    disaster: "Forest Fire",
    riskScore: score,
    riskLevel: level,
    warning,
    recommendations,
    formula: "Risk = (0.25 × S_temp + 0.25 × S_hum_def + 0.20 × S_wind + 0.20 × S_smoke + 0.10 × S_rain_def) × 100%",
    parameters,
    theme: getRiskTheme(level)
  };
}

export function calculateCycloneRisk(
  windSpeedKmh: number,
  atmosphericPressureHpa: number,
  rainfallMm: number,
  temperatureC: number
): RiskAssessmentResult {
  const sWind = Math.min(1.0, Math.max(0.0, (windSpeedKmh - 25.0) / 95.0));
  const sPress = Math.min(1.0, Math.max(0.0, (1013.0 - atmosphericPressureHpa) / 53.0));
  const sRain = Math.min(1.0, Math.max(0.0, rainfallMm / 180.0));
  const sTemp = Math.min(1.0, Math.max(0.0, (temperatureC - 24.0) / 14.0));

  const wWind = 0.40;
  const wPress = 0.35;
  const wRain = 0.15;
  const wTemp = 0.10;

  const raw = (wWind * sWind) + (wPress * sPress) + (wRain * sRain) + (wTemp * sTemp);
  const score = Math.round(raw * 1000) / 10;
  const level = classifyRisk(score);

  let warning = "Calm coastal conditions. Atmospheric pressure and breeze are normal.";
  if (score > 60) {
    warning = "SEVERE CYCLONIC STORM THREAT: Steep barometric drop and destructive gale winds imminent.";
  } else if (score > 30) {
    warning = "TROPICAL DEPRESSION: Squally coastal gusts and scattered showers detected.";
  }

  const recommendations = [
    "Monitor wind speeds and barometric pressure drops closely",
    "Follow official meteorological alerts and coastal fisheries bulletins",
    "Prepare evacuation plans and stock community cyclone shelters with provisions",
    "Secure loose tin roofing, billboards, and electrical utility lines"
  ];

  const parameters: ParameterBreakdown[] = [
    {
      name: "Sustained Wind Speed",
      measuredValue: windSpeedKmh,
      unit: "km/h",
      normalizedScore: Math.round(sWind * 1000) / 1000,
      weight: wWind,
      weightedContribution: Math.round(sWind * wWind * 1000) / 10
    },
    {
      name: "Barometric Pressure Drop",
      measuredValue: atmosphericPressureHpa,
      unit: "hPa",
      normalizedScore: Math.round(sPress * 1000) / 1000,
      weight: wPress,
      weightedContribution: Math.round(sPress * wPress * 1000) / 10
    },
    {
      name: "Squall Rainfall",
      measuredValue: rainfallMm,
      unit: "mm",
      normalizedScore: Math.round(sRain * 1000) / 1000,
      weight: wRain,
      weightedContribution: Math.round(sRain * wRain * 1000) / 10
    },
    {
      name: "Ambient / Sea Temperature",
      measuredValue: temperatureC,
      unit: "°C",
      normalizedScore: Math.round(sTemp * 1000) / 1000,
      weight: wTemp,
      weightedContribution: Math.round(sTemp * wTemp * 1000) / 10
    }
  ];

  return {
    disaster: "Cyclone",
    riskScore: score,
    riskLevel: level,
    warning,
    recommendations,
    formula: "Risk = (0.40 × S_wind + 0.35 × S_press + 0.15 × S_rain + 0.10 × S_temp) × 100%",
    parameters,
    theme: getRiskTheme(level)
  };
}
