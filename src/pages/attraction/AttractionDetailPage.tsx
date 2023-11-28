// AttractionDetailPage.tsx

import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_ATTRACTION_QUERY } from '../../graphql/query';

const AttractionDetailPage: React.FC = () => {
  const { attractionId } = useParams<{ attractionId: string }>();
  const { loading, error, data } = useQuery(GET_ATTRACTION_QUERY, {
    variables: { getAttractionId: attractionId },
  });

  if (loading) return <div className="p-5">Loading attraction details...</div>;
  if (error) return <div className="p-5 text-red-500">Error loading attraction details: {error.message}</div>;

  // Assuming data is fetched correctly and has a structure similar to { attraction: { ... } }
  const { attraction } = data;

  return (
    <div className="container p-4 mx-auto">
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="h-56 p-4 bg-center bg-cover" style={{ backgroundImage: `url(${attraction.images[0]?.imageUrl})` }}>
          <div className="flex justify-end">
            <svg className="w-6 h-6 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              {/* Icon can be replaced with a heart or bookmark SVG for favorites */}
            </svg>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-2xl uppercase">{attraction.attractionTitle}</h3>
          <span className="block mt-2 text-lg text-gray-800">{attraction.location}</span>
          <div className="mt-4">
            <span className="font-semibold text-teal-600 text-md">Price: {attraction.price}</span>
          </div>
          <div className="mt-4">
            <h5 className="text-lg font-bold">About:</h5>
            <p className="mt-1 text-sm text-gray-600">{attraction.description}</p>
          </div>
          {/* Additional sections like reviews or booking options can be added here */}
        </div>
        <div className="p-4 text-gray-700 border-t border-gray-300">
          <span className="flex items-center mb-1">
            <i>{/* Icon placeholder */}</i>
            <span className="ml-2">Category: {attraction.tag?.name}</span>
          </span>
          <span className="flex items-center">
            <i>{/* Icon placeholder */}</i>
            <span className="ml-2">Destination: {attraction.destination?.name}</span>
          </span>
        </div>
        <div className="p-4 text-gray-700 bg-gray-100 border-t border-gray-300">
          <div className="flex items-center">
            <i>{/* Icon placeholder */}</i>
            <span className="ml-2">Posted on {new Date(attraction.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionDetailPage;
