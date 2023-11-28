import { create } from "zustand";
export type BasicData = {
  title: string;
  type: string;
  destinations: string[];
  cities: string[];
  preferences: string[];
  themes: string[];
};
export type DurationData = {
  days: number;
  nights: number;
  validity: number;
  validityUnit: string;
};
export type DatesData = {
  bookingFromDate: string;
  bookingToDate: string;
  travelDates: {
    fromDate: string;
    toDate: string;
  }[];
};
export type SummaryData = {
  inclusions: string[];
  exclusions: string[];
  highlights: Highlight[];
  summary: string;
  photos: Photo[];
};
export type Highlight = {
  title: string;
  description: string;
  url: string;
};
export type Photo = {
  url: string;
};
export type HotelData = {
  cities: string[];
  meals: string[];
  rating: string;
  name: string;
  days: number;
  nights: number;
};
export type IntercityData = {
  fromCity: string;
  toCity: string;
  mode: string;
  description: string;
};
export type SightSeeingData = {
  city: string;
  sights: string[];
};
export type DayWiseItinerary = {
  day: number;
  description: string;
  cities: string[];
  meals: string[];
  inclusions: string[];
  exclusions: string[];
};
export type PricingData = {
  currency: string;
  type: string;
  adultPrice: number;
  childPrice: number;
  maxMembers: number;
};
export type Policy = {
  option: string;
  description: string;
};

type Store = {
  activeStep: number;
  packageId: string;
  general: {
    basicData: BasicData;
    durationData: DurationData;
    datesData: DatesData[];
    summaryData: SummaryData;
  }; // Replace with the actual type for the GeneralForm data
  itinerary: {
    daywiseItinerary: DayWiseItinerary[];
  }; // Replace with the actual type for the ItineraryForm data
  location: {
    hotelsData: HotelData[];
    intercityData: IntercityData[];
    sightseeingData: SightSeeingData[];
    transfers: {
      airportTransfers: boolean;
      localTransfers: boolean;
    };
  }; // ... and so on for each form section
  pricing: PricingData;
  languages: string[];
  cancellationPolicy: Policy;
  // preview: any;  // if you have this step

  setActiveStep: (step: number) => void;
  setGeneral: (key: keyof Store["general"], data: any) => void;
  setItinerary: (key: keyof Store["itinerary"], data: any) => void;
  setLocation: (key: keyof Store["location"], data: any) => void;
  setPricing: (key: keyof Store["pricing"], data: any) => void;

  setLanguages: (data: string[]) => void;
  setCancellationPolicy: (data: any) => void;
  setPackageId: (id: string) => void;
  // setPreview: (data: any) => void;  // if you have this step
  errors: {
    [key: string]: {
      [key: string]: string;
    };
  };
  setErrors: (section: string, data: Record<string, string>) => void;
};
export const useGlobalStore = create<Store>((set) => ({
  activeStep: 0,
  packageId: "",
  setPackageId: (id) => set({ packageId: id }),
  general: {
    basicData: {
      title: "",
      type: "",
      destinations: [],
      cities: [],
      preferences: [],
      themes: [],
    },
    durationData: {
      days: 0,
      nights: 0,
      validity: 0,
      validityUnit: "days",
    },
    datesData: [
      {
        bookingFromDate: "",
        bookingToDate: "",
        travelDates: [{ fromDate: "", toDate: "" }],
      },
    ],
    summaryData: {
      exclusions: [],
      inclusions: [],
      summary: "",
      highlights: [],
      photos: [],
    },
  },
  itinerary: {
    daywiseItinerary: [
      {
        day: 1,
        cities: [],
        description: "",
        exclusions: [],
        inclusions: [],
        meals: [],
      },
    ],
  },
  location: {
    hotelsData: [],
    intercityData: [],
    sightseeingData: [],
    transfers: {
      airportTransfers: false,
      localTransfers: false,
    },
  },

  pricing: {
    adultPrice: 0,
    childPrice: 0,
    currency: "USD",
    type: "perperson",
    maxMembers: 0,
  },
  languages: [],
  cancellationPolicy: {
    option: "",
    description: "",
  },
  // preview: {},  // if you have this step
  errors: {},
  setActiveStep: (step) => set({ activeStep: step }),
  setGeneral: (key, data) =>
    set((state) => {
      if (Array.isArray(data)) {
        return {
          general: {
            ...state.general,
            [key]: data,
          },
        };
      } else {
        return {
          general: {
            ...state.general,
            [key]: {
              ...state.general[key],
              ...data,
            },
          },
        };
      }
    }),
  setItinerary: (key, data) =>
    set((state) => {
      if (Array.isArray(data)) {
        return {
          itinerary: {
            ...state.itinerary,
            [key]: data,
          },
        };
      } else {
        return {
          itinerary: {
            ...state.itinerary,
            [key]: {
              ...state.itinerary[key],
              ...data,
            },
          },
        };
      }
    }),
  setLocation: (key, data) =>
    set((state) => {
      if (Array.isArray(data)) {
        return {
          location: {
            ...state.location,
            [key]: data,
          },
        };
      } else {
        return {
          location: {
            ...state.location,
            [key]: {
              ...state.location[key],
              ...data,
            },
          },
        };
      }
    }),
  setPricing: (key, data) =>
    set((state) => {
      return {
        pricing: {
          ...state.pricing,
          [key]: data,
        },
      };
    }),
  setLanguages: (data) =>
    set(() => {
      return { languages: data };
    }),
  setCancellationPolicy: (data) => set({ cancellationPolicy: data }),
  setErrors: (section: string, data: Record<string, string>) =>
    set((state: Store) => ({
      errors: {
        ...state.errors,
        [section]: {
          ...(state.errors[section] || {}),
          ...data,
        },
      },
    })),

  // setPreview: (data) => set({ preview: data }),  // if you have this step
}));
