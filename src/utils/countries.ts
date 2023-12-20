// Define types for your data
export interface Country {
  name: string;
  code: string;
}

export interface ContinentData {
  continent: string;
  countries: Country[];
}

export const countryData: ContinentData[] = [
  {
    continent: "Africa",
    countries: [
      { name: "Nigeria", code: "NG" },
      { name: "Ethiopia", code: "ET" },
      { name: "Egypt", code: "EG" },
      { name: "South Africa", code: "ZA" },
      { name: "Kenya", code: "KE" },
      // ... more countries
    ],
  },
  {
    continent: "Asia",
    countries: [
      { name: "China", code: "CN" },
      { name: "India", code: "IN" },
      { name: "Indonesia", code: "ID" },
      { name: "Pakistan", code: "PK" },
      { name: "Bangladesh", code: "BD" },
      // ... more countries
    ],
  },
  {
    continent: "Europe",
    countries: [
      { name: "Albania", code: "AL" },
      { name: "Andorra", code: "AD" },
      { name: "Armenia", code: "AM" },
      { name: "Austria", code: "AT" },
      { name: "Azerbaijan", code: "AZ" },
      { name: "Belarus", code: "BY" },
      { name: "Belgium", code: "BE" },
      { name: "Bosnia and Herzegovina", code: "BA" },
      { name: "Bulgaria", code: "BG" },
      { name: "Croatia", code: "HR" },
      { name: "Cyprus", code: "CY" },
      { name: "Czech Republic", code: "CZ" },
      { name: "Denmark", code: "DK" },
      { name: "Estonia", code: "EE" },
      { name: "Finland", code: "FI" },
      { name: "France", code: "FR" },
      { name: "Georgia", code: "GE" },
      { name: "Germany", code: "DE" },
      { name: "Greece", code: "GR" },
      { name: "Hungary", code: "HU" },
      { name: "Iceland", code: "IS" },
      { name: "Ireland", code: "IE" },
      { name: "Italy", code: "IT" },
      { name: "Kazakhstan", code: "KZ" },
      { name: "Kosovo", code: "XK" },
      { name: "Latvia", code: "LV" },
      { name: "Liechtenstein", code: "LI" },
      { name: "Lithuania", code: "LT" },
      { name: "Luxembourg", code: "LU" },
      { name: "Malta", code: "MT" },
      { name: "Moldova", code: "MD" },
      { name: "Monaco", code: "MC" },
      { name: "Montenegro", code: "ME" },
      { name: "Netherlands", code: "NL" },
      { name: "North Macedonia", code: "MK" },
      { name: "Norway", code: "NO" },
      { name: "Poland", code: "PL" },
      { name: "Portugal", code: "PT" },
      { name: "Romania", code: "RO" },
      { name: "Russia", code: "RU" },
      { name: "San Marino", code: "SM" },
      { name: "Serbia", code: "RS" },
      { name: "Slovakia", code: "SK" },
      { name: "Slovenia", code: "SI" },
      { name: "Spain", code: "ES" },
      { name: "Sweden", code: "SE" },
      { name: "Switzerland", code: "CH" },
      { name: "Turkey", code: "TR" },
      { name: "Ukraine", code: "UA" },
      { name: "United Kingdom", code: "GB" },
      { name: "Vatican City", code: "VA" },
      // ... more countries
    ],
  },
  {
    continent: "North America",
    countries: [
      { name: "United States", code: "US" },
      { name: "Canada", code: "CA" },
      { name: "Mexico", code: "MX" },
      // ... more countries
    ],
  },
  {
    continent: "South America",
    countries: [
      { name: "Brazil", code: "BR" },
      { name: "Argentina", code: "AR" },
      { name: "Colombia", code: "CO" },
      { name: "Peru", code: "PE" },
      { name: "Venezuela", code: "VE" },
      // ... more countries
    ],
  },
  {
    continent: "Australia/Oceania",
    countries: [
      { name: "Australia", code: "AU" },
      { name: "Papua New Guinea", code: "PG" },
      { name: "New Zealand", code: "NZ" },
      { name: "Fiji", code: "FJ" },
      { name: "Solomon Islands", code: "SB" },
      // ... more countries
    ],
  },
  {
    continent: "Antarctica",
    countries: [
      // Antarctica typically does not have countries, but you can list territories or research stations if relevant
    ],
  },
];
