// AllDestinationsPage.tsx

import React from "react";
import { Destination } from "../../components/destination/destination-card";
import { useDataStore, useDestinationPaginationStore } from "../../store/store";
import { useNavigate } from "react-router";
import { useData } from "../../context/DataContext";

const filter = {
  priceMin: null,
  startDate: null,
  priceMax: null,
  location: null,
  endDate: null,
  continent: [],
  country: [],
  tagName: [],
};
const AllDestinationsPage: React.FC = () => {
  // const { destinationData, destinationError, destinationLoading } = useData();
  const {
    destinationFilteredLoading,
    destinationFilteredError,
    // destinationFilteredData,
    refetchFilteredDestination,
  } = useData();
  const {
    setPaginationData,
    currentPage,
    dataPerPage,
    loadCount,
    totalPageLoaded,
    setNewData,
    dataList,
    totalPage,
    setCurrentPage,
  } = useDestinationPaginationStore();
  const pageArr = new Array(totalPage).fill(0);
  const handleRefetchData = async () => {
    try {
      const dataNew = await refetchFilteredDestination({
        page: totalPageLoaded + 1,
        loadCount,
        filter,
      });
      setNewData(
        dataNew?.data?.getFilteredDestination?.destinations,
        totalPageLoaded + 1
      );
    } catch (err) {
      console.log(err);
    }
  };
  const handleRefetchDataForFirstTime = async () => {
    try {
      const dataNew = await refetchFilteredDestination({
        page: 1,
        loadCount,
        filter,
      });
      // console.log("data new", dataNew);
      setPaginationData(
        Math.ceil(
          dataNew?.data?.getFilteredDestination?.totalCount / dataPerPage
        ),
        1, ///current page
        1, ////page loaded from api
        dataNew?.data?.getFilteredDestination?.totalCount,
        dataNew?.data?.getFilteredDestination?.destinations
      );
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (currentPage == 0) {
      // console.log("called for the first tiime😚", filter);
      handleRefetchDataForFirstTime();
    } else if (
      currentPage * dataPerPage >= loadCount * totalPageLoaded &&
      currentPage != 0
      // !isLoading
    ) {
      handleRefetchData();
    }
  }, [currentPage]);

  React.useEffect(() => {
    setPaginationData(0, 0, 0, 0, []);
  }, [filter]);

  // console.log("dataList-----", dataList);

  const { setSelectedDestination } = useDataStore();
  const navigate = useNavigate();
  if (destinationFilteredLoading) return <p>Loading destinations...</p>;
  if (destinationFilteredError)
    return (
      <p>Error loading destinations: {destinationFilteredError.message}</p>
    );
  const handleSelectDestination = (destination: Destination) => {
    setSelectedDestination(destination);
    navigate(`/editdestination/${destination.id}`);
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dataList
          ?.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage)
          .map((destination: Destination) => (
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
      <div className="flex flex-wrap justify-center items-center gap-2">
        {pageArr.map((_, index) => {
          return (
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-black text-sm cursor-pointer 
             ${
               currentPage == index + 1
                 ? "bg-black text-white hover:bg-black hover:text-white"
                 : "hover:bg-blue-300 hover:text-black"
             }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AllDestinationsPage;
