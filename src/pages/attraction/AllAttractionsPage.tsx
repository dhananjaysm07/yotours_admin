import React from "react";
import { Destination } from "../../components/destination/destination-card";
import { useNavigate } from "react-router";
import { useAttractionPaginationStore } from "../../store/store";
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
  attractionBokunId: string;
  attractionHyperlink: string;
  images: Image[];
  destination: Pick<Destination, "id" | "destinationName">;
  tag: {
    id: string;
    name: string;
  };
  active: boolean;
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
  activeValues: [true, false],
};
const AllAttractionsPage: React.FC = () => {
  // const { attractionData, attractionError, attractionLoading } = useData();
  const {
    refetchAttraction,
    attractionFilteredError,
    attractionFilteredLoading,
    destinationListData,
  } = useData();
  const {
    setPaginationData,
    currentPage,
    dataPerPage,
    loadCount,
    setNewData,
    dataList,
    totalPage,
    setCurrentPage,
  } = useAttractionPaginationStore();
  const pageArr = new Array(totalPage || 0).fill(0);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [destinationID, setDestinationId] = React.useState("");
  const handleRefetchData = async () => {
    try {
      setLoading(true);
      const pageToBeLoaded =
        Math.floor(currentPage / (loadCount / dataPerPage)) + 1;
      const dataNew = await refetchAttraction({
        page: pageToBeLoaded,
        loadCount,
        filter,
      });
      setNewData(
        dataNew?.data?.getFilteredAttractions?.attractions,
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
      const dataNew = await refetchAttraction({
        page: 1,
        loadCount,
        filter,
      });
      // console.log("data new", dataNew);
      setPaginationData(
        Math.ceil(
          dataNew?.data?.getFilteredAttractions?.totalCount / dataPerPage
        ),
        0, ///current page
        1, ////page loaded from api
        dataNew?.data?.getFilteredAttractions?.totalCount,
        dataNew?.data?.getFilteredAttractions?.attractions
      );
    } catch (err) {
      console.log(err);
      setErr("Unable to fetch data");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentPage == 0) {
      // console.log("called for the first tiime😚", filter);
      handleRefetchDataForFirstTime();
    } else if (!dataList[currentPage * dataPerPage]) {
      handleRefetchData();
    }
  }, [currentPage]);

  React.useEffect(() => {
    setPaginationData(0, 0, 0, 0, []);
  }, [filter]);
  // console.log(attractionData);
  // const { setSelectedAttraction } = useDataStore();
  const navigate = useNavigate();
  if (loading || attractionFilteredLoading)
    return <p>Loading attractions...</p>;
  if (err || attractionFilteredError) return <p>Error loading attractions</p>;
  // Call this function when an attraction card is clicked
  const handleSelectAttraction = (attraction: Attraction) => {
    // setSelectedAttraction(attraction);
    navigate(`/editattraction/${attraction.id}`);
  };
  return (
    <>
      <div className="w-full h-12 flex flex-row justify-end px-4 gap-4">
        <select
          name="Continent"
          id=""
          className="b-2 p-2 px-4 cursor-pointer"
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setDestinationId(
              event.target.value == "all" ? "" : event.target.value
            );
          }}
          value={destinationID || "all"}
        >
          <option value="all">All</option>
          {destinationListData?.getDestinations?.map((data) => (
            <option value={data.id}>{data.destinationName}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dataList
          ?.slice(currentPage * dataPerPage, (currentPage + 1) * dataPerPage)
          .filter((data) => {
            if (!destinationID) return true;
            else return data.destination.id == destinationID;
          })
          .map((attraction: any) => (
            <div
              key={attraction.id}
              onClick={() => handleSelectAttraction(attraction)}
              className="max-w-sm overflow-hidden transition duration-500 transform rounded shadow-lg hover:cursor-pointer hover:scale-105 relative"
            >
              <div className="absolute z-10 py-2 px-4 bg-black rounded-lg">
                <p>{attraction.active ? "Active" : "Inactive"}</p>
              </div>
              <div className="relative group">
                <img
                  className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110"
                  src={attraction.images[0].imageUrl}
                  alt={attraction.attractionTitle}
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white transition-opacity duration-500 ease-in-out bg-black  bg-opacity-60 group-hover:opacity-100">
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
      <div className="flex flex-wrap justify-center items-center gap-2">
        {pageArr?.map((_, index) => {
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

export default AllAttractionsPage;
