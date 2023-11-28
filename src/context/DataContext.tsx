// DataContext.js
import React, { useContext, createContext } from "react";
import { useQuery, QueryResult } from "@apollo/client";
import {
  GET_ATTRACTIONS_QUERY,
  GET_DESTINATIONS_QUERY,
  GET_THINGS_QUERY,
  GET_TOURS_QUERY,
} from "../graphql/query";
import { Destination } from "../components/destination/destination-card";
import { Tour } from "../pages/tour/AllToursPage";
import { Attraction } from "../pages/attraction/AllAttractionsPage";
import { Thing } from "../pages/thing/AllThingsPage";

interface IDataContext {
  destinationData: {
    getDestinations: Destination[];
  };
  destinationError: any;
  destinationLoading: boolean;
  tourData: {
    getTours: Tour[];
  };
  tourLoading: boolean;
  tourError: any;
  attractionData: {
    getAttractions: Attraction[];
  };
  attractionLoading: boolean;
  attractionError: any;
  thingData: {
    getThings: Thing[];
  };
  thingLoading: boolean;
  thingError: any;
}

const DataContext = createContext<IDataContext | null>(null);

interface Props {
  children: React.ReactNode;
}

export const DataProvider = ({ children }: Props) => {
  const {
    loading: destinationLoading,
    error: destinationError,
    data: destinationData,
  }: QueryResult = useQuery(GET_DESTINATIONS_QUERY);
  const {
    loading: tourLoading,
    error: tourError,
    data: tourData,
  }: QueryResult = useQuery(GET_TOURS_QUERY);
  const {
    loading: attractionLoading,
    error: attractionError,
    data: attractionData,
  }: QueryResult = useQuery(GET_ATTRACTIONS_QUERY);

  const {
    loading: thingLoading,
    error: thingError,
    data: thingData,
  }: QueryResult = useQuery(GET_THINGS_QUERY);

  const contextValue: IDataContext = {
    destinationData,
    destinationError,
    destinationLoading,
    tourData,
    tourLoading,
    tourError,
    attractionData,
    attractionLoading,
    attractionError,
    thingData,
    thingLoading,
    thingError,
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
