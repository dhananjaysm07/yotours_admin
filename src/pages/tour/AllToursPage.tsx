// AllToursPage.tsx

import React from "react";
import { useDataStore } from "../../store/store";
import { useNavigate } from "react-router";
import { Destination } from "../../components/destination/destination-card";
import { useData } from "../../context/DataContext";

interface Image {
  id: string;
  imageUrl: string;
}
export interface Tour {
  id: string;
  tourTitle: string;
  tourHyperlink: string;
  price: string;
  currency: string;
  location: string;
  images: Image[];
  destination: Pick<Destination, "id" | "destinationName">;
  tag: {
    id: string;
    name: string;
  };
}
const AllToursPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedTour } = useDataStore();
  const { tourData, tourError, tourLoading } = useData();
  if (tourLoading) return <p>Loading tours...</p>;
  if (tourError) return <p>Error loading tours: {tourError.message}</p>;
  // Trigger navigation when the selectedTour changes
  const handleSelectTour = (tour: Tour) => {
    setSelectedTour(tour);
    navigate(`/edittour/${tour.id}`);
  };
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {tourData.getTours.map((tour: any) => (
        <div
          onClick={() => handleSelectTour(tour)}
          key={tour.id}
          className="max-w-sm overflow-hidden transition duration-500 transform rounded shadow-lg hover:cursor-pointer hover:scale-105"
        >
          <div className="relative group">
            <img
              className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110"
              src={tour.images[0].imageUrl}
              alt={tour.tourTitle}
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white transition-opacity duration-500 ease-in-out bg-black opacity-0 bg-opacity-60 group-hover:opacity-100">
              {tour.destination?.destinationName}
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="text-base text-gray-700">{tour.tourTitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllToursPage;
