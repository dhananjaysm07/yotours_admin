// AllDestinationsPage.tsx

import React from "react";
import { Destination } from "../../components/destination/destination-card";
import { useDataStore } from "../../store/store";
import { useNavigate } from "react-router";
import { useData } from "../../context/DataContext";

const AllDestinationsPage: React.FC = () => {
  const { destinationData, destinationError, destinationLoading } = useData();
  const { setSelectedDestination } = useDataStore();
  const navigate = useNavigate();
  if (destinationLoading) return <p>Loading destinations...</p>;
  if (destinationError)
    return <p>Error loading destinations: {destinationError.message}</p>;
  const handleSelectDestination = (destination: Destination) => {
    setSelectedDestination(destination);
    navigate(`/editdestination/${destination.id}`);
  };
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {destinationData.getDestinations.map((destination: any) => (
        <div
          onClick={() => handleSelectDestination(destination)}
          key={destination.id}
          className="max-w-sm overflow-hidden transition duration-500 transform rounded shadow-lg hover:cursor-pointer hover:scale-105"
        >
          <div className="relative group">
            <img
              className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110"
              src={destination.bannerImage}
              alt={destination.destinationName}
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white transition-opacity duration-500 ease-in-out bg-black  bg-opacity-60 group-hover:opacity-100">
              {destination.destinationName}
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="text-base text-gray-700">
              {destination.description.length > 100
                ? `${destination.description.substring(0, 100)}...`
                : destination.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllDestinationsPage;
