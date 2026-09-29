export interface VillageData {
  village: string;
  defaultRainfall?: number;
  defaultWaterLevel?: number;
  defaultSoilMoisture?: number;
  defaultTemp?: number;
  defaultHumidity?: number;
  defaultWindSpeed?: number;
  defaultPressure?: number;
  defaultSlope?: number;
  defaultSmoke?: number;
}

export interface TalukData {
  taluk: string;
  villages: string[];
}

export interface DistrictData {
  district: string;
  taluks: TalukData[];
  zone: string;
  primaryHazards: string[];
}

export const KARNATAKA_LOCATION_DATA: DistrictData[] = [
  {
    district: "Kalaburagi",
    zone: "North Karnataka (Semi-Arid Dry Tropical)",
    primaryHazards: ["Drought", "Forest Fire"],
    taluks: [
      {
        taluk: "Chittapur",
        villages: ["Alura", "Wadi", "Ravoor", "Diggaon"]
      },
      {
        taluk: "Afzalpur",
        villages: ["Gobbur", "Karajagi", "Udachan", "Tellur"]
      },
      {
        taluk: "Sedam",
        villages: ["Kodla", "Yanagundi", "Mudhol", "Ribbanpally"]
      },
      {
        taluk: "Aland",
        villages: ["Nimbal", "Narona", "Khajuri", "Madan Hipparga"]
      },
      {
        taluk: "Kalaburagi",
        villages: ["Kusnoor", "Nandikur", "Farhatabad", "Sirnoor"]
      }
    ]
  },
  {
    district: "Kodagu",
    zone: "Western Ghats (High Rainfall, Hilly Terrain)",
    primaryHazards: ["Landslide", "Flood"],
    taluks: [
      {
        taluk: "Madikeri",
        villages: ["Galibeedu", "Sampaje", "Napoklu", "Bhagamandala"]
      },
      {
        taluk: "Somwarpet",
        villages: ["Shanivarsanthe", "Kushalnagar", "Kodlipet", "Suntikoppa"]
      },
      {
        taluk: "Virajpet",
        villages: ["Gonikoppal", "Ponnampet", "Kutta", "Balele"]
      }
    ]
  },
  {
    district: "Udupi",
    zone: "Coastal Karnataka (Arabian Sea Shoreline)",
    primaryHazards: ["Cyclone", "Flood"],
    taluks: [
      {
        taluk: "Udupi",
        villages: ["Malpe", "Brahmavar", "Manipal", "Kaup"]
      },
      {
        taluk: "Kundapura",
        villages: ["Byndoor", "Gangolli", "Shankaranarayana", "Basrur"]
      },
      {
        taluk: "Karkala",
        villages: ["Belman", "Hebri", "Miyar", "Ajekar"]
      }
    ]
  },
  {
    district: "Uttara Kannada",
    zone: "Coastal & Western Ghats Dense Forests",
    primaryHazards: ["Cyclone", "Forest Fire", "Landslide"],
    taluks: [
      {
        taluk: "Karwar",
        villages: ["Binaga", "Majali", "Chittakula", "Arga"]
      },
      {
        taluk: "Sirsi",
        villages: ["Banavasi", "Hulekal", "Bisalkoppa", "Dasanakoppa"]
      },
      {
        taluk: "Kumta",
        villages: ["Gokarna", "Mirjan", "Hiregutti", "Aghanashini"]
      },
      {
        taluk: "Ankola",
        villages: ["Belekeri", "Hattikeri", "Sunksal", "Hillur"]
      }
    ]
  },
  {
    district: "Chikkamagaluru",
    zone: "Malnad Region (Dense Coffee Agroforestry)",
    primaryHazards: ["Landslide", "Forest Fire", "Flood"],
    taluks: [
      {
        taluk: "Chikkamagaluru",
        villages: ["Aldur", "Vastare", "Avathi", "Ambale"]
      },
      {
        taluk: "Mudigere",
        villages: ["Kottigehara", "Kalasa", "Balur", "Banakal"]
      },
      {
        taluk: "Koppa",
        villages: ["Hariharapura", "Jayapura", "Megunda", "Bhandigadi"]
      }
    ]
  },
  {
    district: "Belagavi",
    zone: "Krishna River Basin (Riverine Flood Prone)",
    primaryHazards: ["Flood", "Drought"],
    taluks: [
      {
        taluk: "Athani",
        villages: ["Kagwad", "Shedbal", "Ugar Khurd", "Ainapur"]
      },
      {
        taluk: "Gokak",
        villages: ["Ghataprabha", "Koujalgi", "Arbhavi", "Mamadapur"]
      },
      {
        taluk: "Chikkodi",
        villages: ["Nipani", "Sadalga", "Examba", "Borgaon"]
      },
      {
        taluk: "Belagavi",
        villages: ["Sambra", "Kakati", "Peeranwadi", "Uchagaon"]
      }
    ]
  },
  {
    district: "Raichur",
    zone: "Tungabhadra & Krishna Interfluvial Plains",
    primaryHazards: ["Drought"],
    taluks: [
      {
        taluk: "Raichur",
        villages: ["Yeramarus", "Shaktinagar", "Yapaladinni", "Gillesugur"]
      },
      {
        taluk: "Manvi",
        villages: ["Sirwar", "Pothnal", "Kurdi", "Harvi"]
      },
      {
        taluk: "Sindhanur",
        villages: ["Gorebal", "Turvihal", "Salgunda", "Alabanur"]
      }
    ]
  }
];

export const DISASTER_TYPES = [
  "Drought",
  "Flood",
  "Landslide",
  "Forest Fire",
  "Cyclone"
] as const;

export type DisasterType = typeof DISASTER_TYPES[number];
