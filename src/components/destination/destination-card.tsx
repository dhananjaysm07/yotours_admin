// DestinationCard.tsx

import React from "react";

interface Image {
  id: string;
  imageUrl: string;
}

export interface Destination {
  id: string;
  destinationName: string;
  continent: string;
  country: string;
  description: string;
  isPopular: boolean;
  bannerImage: string;
  bannerHeading: string;
  images: Image[];
  tag: {
    id: string;
    name: string;
  };
}

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  return (
    <div className="max-w-sm overflow-hidden transition duration-500 transform rounded shadow-lg hover:scale-105">
      <div className="relative group">
        <img
          className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110"
          src={destination.bannerImage}
          alt={destination.destinationName}
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white transition-opacity duration-500 ease-in-out bg-black opacity-0 bg-opacity-60 group-hover:opacity-100">
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
  );
};

export default DestinationCard;
