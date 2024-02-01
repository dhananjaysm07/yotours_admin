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
  activeValues: [true, false],
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
  active: boolean;
}
const AllToursPage: React.FC = () => {
  const {
    refetch,
    tourFilteredError,
    tourFilteredLoading,
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
  } = useTourPaginationStore();
  const pageArr = new Array(totalPage).fill(0);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [destinationID, setDestinationId] = React.useState("");
  const handleRefetchData = async () => {
    try {
      setLoading(true);
      const pageToBeLoaded =
        Math.floor(currentPage / (loadCount / dataPerPage)) + 1;
      const dataNew = await refetch({
        page: pageToBeLoaded,
        loadCount,
        filter,
      });
      setNewData(dataNew?.data?.getFilteredTours?.tours, pageToBeLoaded);
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
      const dataNew = await refetch({
        page: 1,
        loadCount,
        filter,
      });
      // console.log("data new", dataNew);
      setPaginationData(
        Math.ceil(dataNew?.data?.getFilteredTours?.totalCount / dataPerPage),
        0, ///current page
        1, ////page loaded from api
        dataNew?.data?.getFilteredTours?.totalCount,
        dataNew?.data?.getFilteredTours?.tours
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
    }
    // else if (
    //   currentPage * dataPerPage >= loadCount * totalPageLoaded &&
    //   currentPage != 0
    //   // !isLoading
    // ) {
    //   handleRefetchData();
    // }
    else if (!dataList[currentPage * dataPerPage]) {
      handleRefetchData();
    }
  }, [currentPage]);

  React.useEffect(() => {
    setPaginationData(0, 0, 0, 0, []);
  }, [filter]);
  const navigate = useNavigate();
  // const { setSelectedTour } = useDataStore();
  // const { tourData, tourError, tourLoading } = useData();
  // console.log(tourData);
  if (tourFilteredLoading || loading) return <p>Loading tours...</p>;
  if (tourFilteredError || err) return <p>Error loading tours</p>;
  // Trigger navigation when the selectedTour changes
  const handleSelectTour = (tour: Tour) => {
    // setSelectedTour(tour);
    navigate(`/edittour/${tour.id}`);
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
          .map((tour: any) => (
            <div
              onClick={() => handleSelectTour(tour)}
              key={tour?.id}
              className="max-w-sm overflow-hidden transition duration-500 transform rounded shadow-lg hover:cursor-pointer hover:scale-105 relative"
            >
              <div className="absolute z-10 py-2 px-4 bg-black rounded-lg">
                <p>{tour.active ? "Active" : "Inactive"}</p>
              </div>
              <div className="relative group">
                <img
                  className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110"
                  src={tour?.images[0].imageUrl || ""}
                  alt={tour?.tourTitle}
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white  duration-500 ease-in-out bg-black  bg-opacity-60 ">
                  {tour?.destination?.destinationName}
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-base text-gray-700">{tour?.tourTitle}</p>
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

export default AllToursPage;
