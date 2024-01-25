import React from "react";
import { useDataStore } from "../store/store";
import { useData } from "../context/DataContext";

const Dashboard = () => {
  const {
    attractionData,
    attractionLoading,
    destinationFilteredData,
    destinationFilteredLoading,
    tourFilteredData,
    tourFilteredLoading,
    tourData,
  } = useData();

  console.log(tourData);
  //add loading if condition
  if (attractionLoading || destinationFilteredLoading || tourFilteredLoading)
    return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-blue-500 rounded-md">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 112 0v2a1 1 0 11-2 0v-2zm0-6a1 1 0 110-2 1 1 0 010 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium leading-5 text-gray-500 truncate">
                      Total Destinations
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold leading-8 text-gray-900">
                        {
                          destinationFilteredData?.getFilteredDestination
                            ?.totalCount
                        }
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-blue-500 rounded-md">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 112 0v2a1 1 0 11-2 0v-2zm0-6a1 1 0 110-2 1 1 0 010 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium leading-5 text-gray-500 truncate">
                      Total Tours
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold leading-8 text-gray-900">
                        {tourFilteredData?.getFilteredTours.totalCount}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-blue-500 rounded-md">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 112 0v2a1 1 0 11-2 0v-2zm0-6a1 1 0 110-2 1 1 0 010 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium leading-5 text-gray-500 truncate">
                      Total Attractions
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold leading-8 text-gray-900">
                        {attractionData?.getAttractions.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
