// DataContext.js
import React, { useContext, createContext } from "react";
import { useQuery, QueryResult } from "@apollo/client";
import {
  // GET_ATTRACTIONS_QUERY,
  // GET_DESTINATIONS_QUERY,
  GET_FILTERED_ATTRACTIONs,
  GET_FILTERED_DESTINATION,
  GET_FILTERED_TOURS,
  // GET_THINGS_QUERY,
  GET_DESTINATIONS_LIST_QUERY,
  // GET_TOURS_LIST_QUERY,
  GET_FILTERED_THINGS,
  GET_COUNTRIES_CONTINENTS_QUERY,
  GET_FILTERED_CARS,
  GET_TOURS_LIST_QUERY,
  GET_ATTRACTIONS_QUERY,
  GET_THINGS_QUERY,
  // GET_TOURS_QUERY,
} from "../graphql/query";
import { Destination } from "../components/destination/destination-card";
import { Tour } from "../pages/tour/AllToursPage";
import { Attraction } from "../pages/attraction/AllAttractionsPage";
import { Thing } from "../pages/thing/AllThingsPage";

interface IDataContext {
  destinationListData: {
    getDestinations: Destination[];
  };
  destinationListError: any;
  destinationListLoading: boolean;
  destinationFilteredData: {
    getFilteredDestination: {
      destinations: Destination[];
      totalCount: number;
    };
  };
  destinationFilteredError: any;
  destinationFilteredLoading: boolean;
  refetchFilteredDestination: any;
  tourListData: {
    getTours: Tour[];
  };
  // tourListLoading: boolean;
  // tourListError: any;
  tourFilteredData: {
    getFilteredTours: {
      tours: Tour[];
      totalCount: number;
    };
  };
  tourFilteredLoading: boolean;
  tourFilteredError: any;
  refetch: any;
  attractionData: {
    getAttractions: Attraction[];
  };
  // attractionLoading: boolean;
  // attractionError: any;
  attractionFilteredData: {
    getAttractions: Attraction[];
  };
  attractionFilteredLoading: boolean;
  attractionFilteredError: any;
  refetchAttraction: any;
  thingData: {
    getThings: Thing[];
  };
  // thingLoading: boolean;
  // thingError: any;
  refetchThing: any;
  thingFilteredData: {
    GetFilteredThings: {
      things: Thing[];
      totalCount: number;
    };
  };
  thingFilteredError: any;
  thingFilteredLoading: boolean;
  carFilteredData: {
    GetFilteredCars: {
      cars: Thing[];
      totalCount: number;
    };
  };
  carFilteredError: any;
  carFilteredLoading: boolean;
  refetchCar: any;
  destCCLoading: boolean;
  destCCError: any;
  destCCData: {
    getCountriesAndContinents: Array<{
      country: string;
      destinationCount: number;
      continent: string;
    }>;
  };
}

const DataContext = createContext<IDataContext | null>(null);

interface Props {
  children: React.ReactNode;
}

export const DataProvider = ({ children }: Props) => {
  const {
    loading: destCCLoading,
    error: destCCError,
    data: destCCData,
  } = useQuery(GET_COUNTRIES_CONTINENTS_QUERY);
  const {
    loading: destinationListLoading,
    error: destinationListError,
    data: destinationListData,
  }: QueryResult = useQuery(GET_DESTINATIONS_LIST_QUERY, {
    variables: {
      isTourActive: true,
    },
  });
  const { data: tourListData }: QueryResult = useQuery(GET_TOURS_LIST_QUERY);
  const { data: attractionData }: QueryResult = useQuery(GET_ATTRACTIONS_QUERY);

  const { data: thingData }: QueryResult = useQuery(GET_THINGS_QUERY);

  const {
    loading: destinationFilteredLoading,
    error: destinationFilteredError,
    data: destinationFilteredData,
    refetch: refetchFilteredDestination,
  } = useQuery(GET_FILTERED_DESTINATION, {
    variables: {
      page: 0,
      loadCount: 0,
      filter: {
        priceMin: null,
        startDate: null,
        priceMax: null,
        location: null,
        endDate: null,
        tagName: [],
        continent: [],
      },
    },
  });
  const {
    loading: tourFilteredLoading,
    error: tourFilteredError,
    data: tourFilteredData,
    refetch,
  } = useQuery(GET_FILTERED_TOURS, {
    variables: {
      page: 0,
      loadCount: 0,
      filter: {
        priceMin: null,
        startDate: null,
        priceMax: null,
        location: null,
        endDate: null,
        tagName: [],
        continent: [],
        activeValues: [true, false],
      },
    },
  });

  const {
    loading: thingFilteredLoading,
    error: thingFilteredError,
    data: thingFilteredData,
    refetch: refetchThing,
  } = useQuery(GET_FILTERED_THINGS, {
    variables: {
      page: 0,
      loadCount: 0,
      filter: {
        priceMin: null,
        startDate: null,
        priceMax: null,
        location: null,
        endDate: null,
        tagName: [],
        continent: [],
        activeValues: [true, false],
      },
    },
  });
  const {
    loading: carFilteredLoading,
    error: carFilteredError,
    data: carFilteredData,
    refetch: refetchCar,
  } = useQuery(GET_FILTERED_CARS, {
    variables: {
      page: 0,
      loadCount: 0,
      filter: {
        priceMin: null,
        startDate: null,
        priceMax: null,
        location: null,
        endDate: null,
        tagName: [],
        continent: [],
        activeValues: [true, false],
      },
    },
  });
  const {
    loading: attractionFilteredLoading,
    error: attractionFilteredError,
    data: attractionFilteredData,
    refetch: refetchAttraction,
  } = useQuery(GET_FILTERED_ATTRACTIONs, {
    variables: {
      page: 0,
      loadCount: 0,
      filter: {
        priceMin: null,
        startDate: null,
        priceMax: null,
        location: null,
        endDate: null,
        tagName: [],
        continent: [],
        activeValues: [true, false],
      },
    },
  });

  const contextValue: IDataContext = {
    // destinationData,
    // destinationError,
    // destinationLoading,
    // tourData,
    // tourLoading,
    // tourError,
    attractionData,
    // attractionLoading,
    // attractionError,
    thingData,
    // thingLoading,
    // thingError,
    destinationFilteredLoading,
    destinationFilteredError,
    destinationFilteredData,
    refetchFilteredDestination,
    refetch,
    tourFilteredData,
    tourFilteredError,
    tourFilteredLoading,
    refetchAttraction,
    attractionFilteredData,
    attractionFilteredError,
    attractionFilteredLoading,
    tourListData,
    // tourListError,
    // tourListLoading,
    destinationListData,
    destinationListError,
    destinationListLoading,
    refetchThing,
    thingFilteredData,
    thingFilteredError,
    thingFilteredLoading,
    refetchCar,
    carFilteredData,
    carFilteredError,
    carFilteredLoading,
    destCCLoading,
    destCCError,
    destCCData,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = (): IDataContext => {
  const context = useContext<IDataContext | null>(DataContext);
  if (context === null) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
