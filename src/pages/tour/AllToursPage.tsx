// AllToursPage.tsx

import React from "react";
import { useDataStore, useTourPaginationStore } from "../../store/store";
import { useNavigate } from "react-router";
import { Destination } from "../../components/destination/destination-card";
import { useData } from "../../context/DataContext";

interface Image {
  id: string;
  imageUrl: string;
}
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
export interface Tour {
  id: string;
  tourTitle: string;
  tourHyperlink: string;
  tourBokunId: string;
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
  const { refetch, tourFilteredError, tourFilteredLoading } = useData();
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
  } = useTourPaginationStore();
  const pageArr = new Array(totalPage).fill(0);
  const handleRefetchData = async () => {
    try {
      const dataNew = await refetch({
        page: totalPageLoaded + 1,
        loadCount,
        filter,
      });
      setNewData(dataNew?.data?.getFilteredTours?.tours, totalPageLoaded + 1);
    } catch (err) {
      console.log(err);
    }
  };
  const handleRefetchDataForFirstTime = async () => {
    try {
      const dataNew = await refetch({
        page: 1,
        loadCount,
        filter,
      });
      // console.log("data new", dataNew);
      setPaginationData(
        Math.ceil(dataNew?.data?.getFilteredTours?.totalCount / dataPerPage),
        1, ///current page
        1, ////page loaded from api
        dataNew?.data?.getFilteredTours?.totalCount,
        dataNew?.data?.getFilteredTours?.tours
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
  const navigate = useNavigate();
  const { setSelectedTour } = useDataStore();
  // const { tourData, tourError, tourLoading } = useData();
  // console.log(tourData);
  if (tourFilteredLoading) return <p>Loading tours...</p>;
  if (tourFilteredError)
    return <p>Error loading tours: {tourFilteredError.message}</p>;
  // Trigger navigation when the selectedTour changes
  const handleSelectTour = (tour: Tour) => {
    setSelectedTour(tour);
    navigate(`/edittour/${tour.id}`);
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dataList
          ?.slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage)
          .map((tour: any) => (
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
                <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white  duration-500 ease-in-out bg-black  bg-opacity-60 ">
                  {tour.destination?.destinationName}
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-base text-gray-700">{tour.tourTitle}</p>
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

export default AllToursPage;
