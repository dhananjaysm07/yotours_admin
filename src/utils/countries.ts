// Define types for your data
export interface Country {
    name: string;
    code: string;
  }
  
 export  interface ContinentData {
    continent: string;
    countries: Country[];
  }

export const countryData:ContinentData[] = [
    {
      "continent": "Africa",
      "countries": [
        {"name": "Nigeria", "code": "NG"},
        {"name": "Ethiopia", "code": "ET"},
        {"name": "Egypt", "code": "EG"},
        {"name": "South Africa", "code": "ZA"},
        {"name": "Kenya", "code": "KE"}
        // ... more countries
      ]
    },
    {
      "continent": "Asia",
      "countries": [
        {"name": "China", "code": "CN"},
        {"name": "India", "code": "IN"},
        {"name": "Indonesia", "code": "ID"},
        {"name": "Pakistan", "code": "PK"},
        {"name": "Bangladesh", "code": "BD"}
        // ... more countries
      ]
    },
    {
      "continent": "Europe",
      "countries": [
        {"name": "Germany", "code": "DE"},
        {"name": "United Kingdom", "code": "GB"},
        {"name": "France", "code": "FR"},
        {"name": "Italy", "code": "IT"},
        {"name": "Spain", "code": "ES"}
        // ... more countries
      ]
    },
    {
      "continent": "North America",
      "countries": [
        {"name": "United States", "code": "US"},
        {"name": "Canada", "code": "CA"},
        {"name": "Mexico", "code": "MX"},
        // ... more countries
      ]
    },
    {
      "continent": "South America",
      "countries": [
        {"name": "Brazil", "code": "BR"},
        {"name": "Argentina", "code": "AR"},
        {"name": "Colombia", "code": "CO"},
        {"name": "Peru", "code": "PE"},
        {"name": "Venezuela", "code": "VE"}
        // ... more countries
      ]
    },
    {
      "continent": "Australia/Oceania",
      "countries": [
        {"name": "Australia", "code": "AU"},
        {"name": "Papua New Guinea", "code": "PG"},
        {"name": "New Zealand", "code": "NZ"},
        {"name": "Fiji", "code": "FJ"},
        {"name": "Solomon Islands", "code": "SB"}
        // ... more countries
      ]
    },
    {
      "continent": "Antarctica",
      "countries": [
        // Antarctica typically does not have countries, but you can list territories or research stations if relevant
      ]
    }
  ]
  