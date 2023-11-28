import React from "react";
import { Destination } from "../../components/destination/destination-card";
import { useNavigate } from "react-router";
import { useDataStore } from "../../store/store";
import { useData } from "../../context/DataContext";

interface Image {
  id: string;
  imageUrl: string;
}
export interface Thing {
  id: string;
  thingTitle: string;
  thingDescription: string;
  thingHyperlink: string;
  images: Image[];
  destination: Pick<Destination, "id" | "destinationName">;
  tag: {
    id: string;
    name: string;
  };
}
const AllThingsPage: React.FC = () => {
  const { thingData, thingError, thingLoading } = useData();
  const { setSelectedThing } = useDataStore();
  const navigate = useNavigate();
  if (thingLoading) return <p>Loading things...</p>;
  if (thingError) return <p>Error loading things: {thingError.message}</p>;
  // Call this function when an thing card is clicked
  const handleSelectThing = (thing: Thing) => {
    setSelectedThing(thing);
    navigate(`/editThing/${thing.id}`);
  };
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {thingData.getThings.map((thing: Thing) => (
        <div
          key={thing.id}
          onClick={() => handleSelectThing(thing)}
          className="max-w-sm overflow-hidden transition duration-500 transform rounded shadow-lg hover:cursor-pointer hover:scale-105"
        >
          <div className="relative group">
            <img
              className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110"
              src={thing.images[0].imageUrl}
              alt={thing.thingTitle}
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white transition-opacity duration-500 ease-in-out bg-black opacity-0 bg-opacity-60 group-hover:opacity-100">
              {thing.destination?.destinationName}
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="text-base text-gray-700">{thing.thingTitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllThingsPage;
