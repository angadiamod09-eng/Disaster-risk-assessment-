import datasetJson from "./dataset.json";

export interface DisasterRecord {
  Country: string;
  State: string;
  District: string;
  Taluk: string;
  Village: string;
  Date: string;
  Disaster_Type: string;
  Rainfall_mm: string;
  Temperature_C: string;
  Humidity_pct: string;
  Soil_Moisture_pct: string;
  Water_Level_m: string;
  Wind_Speed_kmh: string;
  Atmospheric_Pressure_hPa: string;
  Slope_Degree: string;
  Smoke_Level: string;
  Risk_Score: string;
  Risk_Level: string;
}

export const ALL_RECORDS: DisasterRecord[] = datasetJson as DisasterRecord[];

export function getRecordForVillage(
  district: string,
  taluk: string,
  village: string,
  disaster: string
): DisasterRecord | undefined {
  return ALL_RECORDS.find(
    (r) =>
      r.District === district &&
      r.Taluk === taluk &&
      r.Village === village &&
      r.Disaster_Type === disaster
  );
}
