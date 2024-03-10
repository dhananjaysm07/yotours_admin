// AllDestinationsPage.tsx

import React from "react";
import { Destination } from "../../components/destination/destination-card";
import { useDataStore, useDestinationPaginationStore } from "../../store/store";
import { useNavigate } from "react-router";
import { useData } from "../../context/DataContext";
import { SelectChangeEvent } from "@mui/material";
import { filterType } from "../../utils/types";

const AllDestinationsPage: React.FC = () => {
  // const { destinationData, destinationError, destinationLoading } = useData();
  const [filter, setFilter] = React.useState<filterType>({
    priceMin: null,
    startDate: null,
    priceMax: null,
    location: null,
    endDate: null,
    continent: [],
    country: [],
    tagName: [],
    activeValues: [true, false],
  });
  const {
    destinationFilteredLoading,
    destinationFilteredError,
    // destinationFilteredData,
    refetchFilteredDestination,
    destCCData,
  } = useData();
  const {
    setPaginationData,
    currentPage,
    dataPerPage,
    loadCount,
    // totalPageLoaded,
    setNewData,
    dataList,
    totalPage,
    setCurrentPage,
    // totalResult,
  } = useDestinationPaginationStore();
  // console.log("destination ccc", destCCData);
  const pageArr = new Array(totalPage).fill(0);
  // console.log("resultttt----", totalResult);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const handleRefetchData = async () => {
    try {
      setLoading(true);
      const pageToBeLoaded =
        Math.floor(currentPage / (loadCount / dataPerPage)) + 1;
      // console.log("page to be loaded", pageToBeLoaded);
      const dataNew = await refetchFilteredDestination({
        page: pageToBeLoaded,
        loadCount,
        filter,
      });
      // console.log("data new", dataNew);
      setNewData(
        dataNew?.data?.getFilteredDestination?.destinations,
        pageToBeLoaded
      );
    } catch (err) {
      console.log(err);
      setErr("Unable to fetch data");
    } finally {
      setLoading(false);
    }
  };
  const handleRefetchDataForFirstTime = async () => {
    try {
      setLoading(true);
      console.log("filter---", filter);

      const dataNew = await refetchFilteredDestination({
        page: 1,
        loadCount,
        filter,
      });

      console.log("data new", dataNew);
      setPaginationData(
        Math.ceil(
          dataNew?.data?.getFilteredDestination?.totalCount / dataPerPage
        ),
        0, ///current page
        1, ////page loaded from api
        dataNew?.data?.getFilteredDestination?.totalCount,
        dataNew?.data?.getFilteredDestination?.destinations
      );
    } catch (err) {
      // console.log(err);
      setErr("Unable to fetch data");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentPage == 0) {
      handleRefetchDataForFirstTime();
    } else if (!dataList[currentPage * dataPerPage]) {
      handleRefetchData();
    }
  }, [currentPage, filter]);

  React.useEffect(() => {
    setPaginationData(0, 0, 0, 0, []);
  }, [filter]);
  console.log(filter);
  // const { setSelectedDestination } = useDataStore();
  const navigate = useNavigate();
  if (destinationFilteredLoading || loading)
    return <p>Loading destinations...</p>;
  if (err || destinationFilteredError) return <p>Error loading destinations</p>;
  const handleSelectDestination = (destination: Destination) => {
    // setSelectedDestination(destination);
    navigate(`/editdestination/${destination.id}`);
  };
  return (
    <>
      <div className="w-full h-12 flex flex-row justify-end px-4 gap-4">
        <select
          name="Continent"
          id=""
          className="b-2 p-2 px-4 cursor-pointer"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setFilter((state) => ({
              ...state,
              continent:
                event.target.value == "all" ? [] : [event.target.value],
            }));
          }}
          value={filter.continent.length ? filter.continent[0] : "all"}
        >
          <option value="all">All</option>
          {destCCData?.getCountriesAndContinents?.map((data) => (
            <option value={data.continent}>{data.continent}</option>
          ))}
        </select>
        <select
          name="Country"
          id=""
          className="b-2 p-2 px-4 cursor-pointer "
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setFilter((state) => ({
              ...state,
              country: event.target.value == "all" ? [] : [event.target.value],
            }));
          }}
          value={filter.country.length ? filter.country[0] : "all"}
        >
          <option value="all">All</option>
          {destCCData?.getCountriesAndContinents?.map((data) => (
            <option value={data.country}>{data.country}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dataList
          ?.slice(currentPage * dataPerPage, (currentPage + 1) * dataPerPage)
          .map((destination: Destination) => (
            <div
              onClick={() => handleSelectDestination(destination)}
              key={destination?.id}
              className="max-w-sm overflow-hidden transition duration-500 transform rounded shadow-lg hover:cursor-pointer hover:scale-105"
            >
              <div className="relative group">
                <img
                  className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110"
                  src={destination?.bannerImage || ""}
                  alt={destination?.destinationName}
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white transition-opacity duration-500 ease-in-out bg-black  bg-opacity-60 group-hover:opacity-100">
                  {destination?.destinationName}
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-base text-gray-700">
                  {destination?.description.length > 100
                    ? `${destination?.description.substring(0, 100)}...`
                    : destination?.description}
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className="flex flex-wrap justify-center items-center gap-2 mt-auto">
        {pageArr.map((_, index) => {
          return (
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-black text-sm cursor-pointer 
             ${
               currentPage == index
                 ? "bg-black text-white hover:bg-black hover:text-white"
                 : "hover:bg-blue-300 hover:text-black"
             }`}
              onClick={() => setCurrentPage(index)}
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
