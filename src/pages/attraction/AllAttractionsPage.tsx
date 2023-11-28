
import React from "react";
import { Destination } from "../../components/destination/destination-card";
import { useNavigate } from "react-router";
import { useDataStore } from "../../store/store";
import { useData } from "../../context/DataContext";

interface Image {
  id: string;
  imageUrl: string;
}
export interface Attraction {
  id: string;
  attractionTitle: string;
  price: string;
  currency: string;
  location: string;
  attractionHyperlink: string;
  images: Image[];
  destination: Pick<Destination, "id" | "destinationName">;
  tag: {
    id: string;
    name: string;
  };
}
const AllAttractionsPage: React.FC = () => {
  const { attractionData, attractionError, attractionLoading } = useData();
  const { setSelectedAttraction } = useDataStore();
  const navigate = useNavigate();
  if (attractionLoading) return <p>Loading attractions...</p>;
  if (attractionError)
    return <p>Error loading attractions: {attractionError.message}</p>;
  // Call this function when an attraction card is clicked
  const handleSelectAttraction = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    navigate(`/editattraction/${attraction.id}`);
  };
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {attractionData.getAttractions.map((attraction: any) => (
        <div
          key={attraction.id}
          onClick={() => handleSelectAttraction(attraction)}
          className="max-w-sm overflow-hidden transition duration-500 transform rounded shadow-lg hover:cursor-pointer hover:scale-105"
        >
          <div className="relative group">
            <img
              className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110"
              src={attraction.images[0].imageUrl}
              alt={attraction.attractionTitle}
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white transition-opacity duration-500 ease-in-out bg-black opacity-0 bg-opacity-60 group-hover:opacity-100">
              {attraction.destination?.destinationName}
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="text-base text-gray-700">
              {attraction.attractionTitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllAttractionsPage;
