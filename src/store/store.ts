import { create } from "zustand";
import { Tour } from "../pages/tour/AllToursPage";
import { Destination } from "../components/destination/destination-card";
import { Attraction } from "../pages/attraction/AllAttractionsPage";
import { Thing } from "../pages/thing/AllThingsPage";
import { Car } from "../pages/car/AllCar";

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
  selectedCar: Car;
  setSelectedCar: (car: Car) => void;
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
    active: false,
    tag: {
      id: "",
      name: "",
    },
    priority: 0,
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
    fromDate: "",
    fromOccasion: "",
    toDate: "",
    toOccasion: "",
    introduction: "",
    priority: 0,
    tours: [],
    attractions: [],
    things: [],
    cars: [],
  },
  selectedAttraction: {
    id: "",
    attractionTitle: "",
    attractionBokunId: "",
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
    active: false,
    priority: 0,
  },
  selectedThing: {
    id: "",
    thingDescription: "",
    thingHyperlink: "",
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
    active: false,
    priority: 0,
  },
  selectedCar: {
    id: "",
    carDescription: "",
    carHyperlink: "",
    carTitle: "",
    destination: {
      id: "",
      destinationName: "",
    },
    images: [],
    tag: {
      id: "",
      name: "",
    },
    active: false,
    priority: 0,
    carBokunId: "",
    price: "",
    currency: "",
  },
  setSelectedTour: (tour) => set({ selectedTour: tour }),
  setSelectedDestination: (destination) =>
    set({ selectedDestination: destination }),
  setSelectedAttraction: (attraction) =>
    set({ selectedAttraction: attraction }),
  setSelectedThing: (thing) => set({ selectedThing: thing }),
  setSelectedCar: (car) => set({ selectedCar: car }),
}));

interface PaginationStoreInterface<T> {
  totalPage: number; ///Total page from the frontend perspective
  currentPage: number;
  totalPageLoaded: number; ////Total page from the backend perspective
  totalResult: number;
  dataPerPage: number;
  loadCount: number; ////Total number of tours to load per api fetch
  dataList: T[];
  // setTours: (tours: Tour[]) => void;
  setPaginationData: (
    totalPage: number,
    currentPage: number,
    totalPageLoaded: number,
    totalResult: number,
    dataList: T[]
  ) => void;
  setCurrentPage: (currentPage: number) => void;
  setNewData: (newData: T[], totalPageLoaded: number) => void;
}

export const useDestinationPaginationStore = create<
  PaginationStoreInterface<Destination>
>((set) => ({
  totalPage: 0, ///Total page from the frontend perspective
  currentPage: 0,
  totalPageLoaded: 0, ////Total page from the backend perspective
  totalResult: 0,
  dataPerPage: 12,
  loadCount: 12 * 3, ////Total number of tours to load per api fetch
  dataList: [],
  setPaginationData: (
    totalPage,
    currentPage,
    totalPageLoaded,
    totalResult,
    dataList
  ) =>
    set((state) => {
      const arr = new Array(totalResult).fill(undefined);
      for (let i = 0; i < dataList.length; i++) {
        arr[i] = dataList[i];
      }
      return {
        ...state,
        totalPage,
        currentPage,
        totalPageLoaded,
        totalResult,
        dataList: arr,
      };
    }),
  setCurrentPage: (currentPage) =>
    set((state) => {
      return { ...state, currentPage };
    }),
  setNewData: (newData, pageLoaded) =>
    set((state) => {
      const dataArr = state.dataList;
      const initialpos = (pageLoaded - 1) * state.loadCount;
      let j = 0;
      for (let i = initialpos; i < newData.length + initialpos; i++) {
        dataArr[i] = newData[j];
        j++;
      }
      return {
        ...state,
        totalPageLoaded: pageLoaded,
        dataList: dataArr,
      };
    }),
}));

export const useTourPaginationStore = create<PaginationStoreInterface<Tour>>(
  (set) => ({
    totalPage: 0, ///Total page from the frontend perspective
    currentPage: 0,
    totalPageLoaded: 0, ////Total page from the backend perspective
    totalResult: 0,
    dataPerPage: 12,
    loadCount: 12 * 3, ////Total number of tours to load per api fetch
    dataList: [],
    setPaginationData: (
      totalPage,
      currentPage,
      totalPageLoaded,
      totalResult,
      dataList
    ) =>
      set((state) => {
        const arr = new Array(totalResult).fill(undefined);
        for (let i = 0; i < dataList.length; i++) {
          arr[i] = dataList[i];
        }
        return {
          ...state,
          totalPage,
          currentPage,
          totalPageLoaded,
          totalResult,
          dataList: arr,
        };
      }),
    setCurrentPage: (currentPage) =>
      set((state) => {
        return { ...state, currentPage };
      }),
    setNewData: (newData, pageLoaded) =>
      set((state) => {
        const dataArr = state.dataList;
        const initialpos = (pageLoaded - 1) * state.loadCount;
        let j = 0;
        for (let i = initialpos; i < newData.length + initialpos; i++) {
          dataArr[i] = newData[j];
          j++;
        }
        return {
          ...state,
          totalPageLoaded: pageLoaded,
          dataList: dataArr,
        };
      }),
  })
);

export const useAttractionPaginationStore = create<
  PaginationStoreInterface<Attraction>
>((set) => ({
  totalPage: 0, ///Total page from the frontend perspective
  currentPage: 0,
  totalPageLoaded: 0, ////Total page from the backend perspective
  totalResult: 0,
  dataPerPage: 12,
  loadCount: 12 * 3, ////Total number of tours to load per api fetch
  dataList: [],
  setPaginationData: (
    totalPage,
    currentPage,
    totalPageLoaded,
    totalResult,
    dataList
  ) =>
    set((state) => {
      return {
        ...state,
        totalPage,
        currentPage,
        totalPageLoaded,
        totalResult,
        dataList,
      };
    }),
  setCurrentPage: (currentPage) =>
    set((state) => {
      return { ...state, currentPage };
    }),
  setNewData: (newData, totalPageLoaded) =>
    set((state) => {
      return {
        ...state,
        totalPageLoaded,
        dataList: [...state.dataList, ...newData],
      };
    }),
}));

export const useThingPaginationStore = create<PaginationStoreInterface<Thing>>(
  (set) => ({
    totalPage: 0, ///Total page from the frontend perspective
    currentPage: 0,
    totalPageLoaded: 0, ////Total page from the backend perspective
    totalResult: 0,
    dataPerPage: 12,
    loadCount: 12 * 3, ////Total number of tours to load per api fetch
    dataList: [],
    setPaginationData: (
      totalPage,
      currentPage,
      totalPageLoaded,
      totalResult,
      dataList
    ) =>
      set((state) => {
        return {
          ...state,
          totalPage,
          currentPage,
          totalPageLoaded,
          totalResult,
          dataList,
        };
      }),
    setCurrentPage: (currentPage) =>
      set((state) => {
        return { ...state, currentPage };
      }),
    setNewData: (newData, totalPageLoaded) =>
      set((state) => {
        return {
          ...state,
          totalPageLoaded,
          dataList: [...state.dataList, ...newData],
        };
      }),
  })
);

export const useCarPaginationStore = create<PaginationStoreInterface<Car>>(
  (set) => ({
    totalPage: 0, ///Total page from the frontend perspective
    currentPage: 0,
    totalPageLoaded: 0, ////Total page from the backend perspective
    totalResult: 0,
    dataPerPage: 12,
    loadCount: 12 * 3, ////Total number of tours to load per api fetch
    dataList: [],
    setPaginationData: (
      totalPage,
      currentPage,
      totalPageLoaded,
      totalResult,
      dataList
    ) =>
      set((state) => {
        return {
          ...state,
          totalPage,
          currentPage,
          totalPageLoaded,
          totalResult,
          dataList,
        };
      }),
    setCurrentPage: (currentPage) =>
      set((state) => {
        return { ...state, currentPage };
      }),
    setNewData: (newData, totalPageLoaded) =>
      set((state) => {
        return {
          ...state,
          totalPageLoaded,
          dataList: [...state.dataList, ...newData],
        };
      }),
  })
);
