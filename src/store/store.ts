import { create } from "zustand";
import { Tour } from "../pages/tour/AllToursPage";
import { Destination } from "../components/destination/destination-card";
import { Attraction } from "../pages/attraction/AllAttractionsPage";
import { Thing } from "../pages/thing/AllThingsPage";

//lets add destinations and attractions here

interface DataStore {
  tours: Tour[];
  destinations: Destination[];
  attractions: Attraction[];
  setTours: (tours: Tour[]) => void;
  setDestinations: (destinations: Destination[]) => void;
  setAttractions: (attractions: Attraction[]) => void;
  selectedTour: Tour;
  setSelectedTour: (tour: Tour) => void;
  selectedDestination: Destination;
  setSelectedDestination: (destination: Destination) => void;
  selectedAttraction: Attraction;
  setSelectedAttraction: (attraction: Attraction) => void;
  selectedThing: Thing;
  setSelectedThing: (thing: Thing) => void;
}
export const useDataStore = create<DataStore>((set) => ({
  tours: [],
  destinations: [],
  attractions: [],
  setTours: (tours) => set({ tours: tours }),
  setDestinations: (destinations) => set({ destinations: destinations }),
  setAttractions: (attractions) => set({ attractions: attractions }),
  selectedTour: {
    id: "",
    tourHyperlink: "",
    tourBokunId: "",
    destination: {
      id: "",
      destinationName: "",
    },
    images: [],
    location: "",
    price: "",
    currency: "USD",
    tourTitle: "",
    tag: {
      id: "",
      name: "",
    },
  },
  selectedDestination: {
    id: "",
    bannerHeading: "",
    continent: "",
    country: "",
    bannerImage: "",
    description: "",
    isPopular: false,
    destinationName: "",
    images: [],
    tag: {
      id: "",
      name: "",
    },
  },
  selectedAttraction: {
    id: "",
    attractionTitle: "",
    attractionHyperlink: "",
    currency: "USD",
    destination: {
      id: "",
      destinationName: "",
    },
    images: [],
    location: "",
    price: "",
    tag: {
      id: "",
      name: "",
    },
  },
  selectedThing: {
    id: "",
    thingDescription: "",
    thingHyperlink:"",
    thingTitle: "",
    destination: {
      id: "",
      destinationName: "",
    },
    images: [],
    tag: {
      id: "",
      name: "",
    },
  },
  setSelectedTour: (tour) => set({ selectedTour: tour }),
  setSelectedDestination: (destination) =>
    set({ selectedDestination: destination }),
  setSelectedAttraction: (attraction) =>
    set({ selectedAttraction: attraction }),
  setSelectedThing: (thing) =>
    set({ selectedThing: thing }),
}));
