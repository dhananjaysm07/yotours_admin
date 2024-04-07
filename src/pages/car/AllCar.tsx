import React from "react";
import { Destination } from "../../components/destination/destination-card";
import { useNavigate } from "react-router";
import { useCarPaginationStore, useDataStore } from "../../store/store";
import { useData } from "../../context/DataContext";

interface Image {
  id: string;
  imageUrl: string;
}
export interface Car {
  id: string;
  carTitle: string;
  carDescription: string;
  carHyperlink: string;
  images: Image[];
  destination: Pick<Destination, "id" | "destinationName">;
  tag: {
    id: string;
    name: string;
  };
  active: boolean;
  priority: number;
  carBokunId: string;
  price: string;
  currency: string;
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
const AllCarsPage: React.FC = () => {
  // const { thingData, thingError, thingFilteredLoading||loading } = useData();
  const {
    refetchCar,
    carFilteredError,
    carFilteredLoading,
    destinationListData,
    // thingFilteredData,
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
  } = useCarPaginationStore();
  console.log("thing? dataaaa", dataList, totalPage);
  const pageArr = new Array(totalPage || 0).fill(0);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [destinationID, setDestinationId] = React.useState("");
  const handleRefetchData = async () => {
    try {
      setLoading(true);
      const pageToBeLoaded =
        Math.floor(currentPage / (loadCount / dataPerPage)) + 1;
      const dataNew = await refetchCar({
        page: pageToBeLoaded,
        loadCount,
        filter,
      });
      setNewData(dataNew?.data?.getFilteredCars?.cars || [], pageToBeLoaded);
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
      const dataNew = await refetchCar({
        page: 1,
        loadCount,
        filter,
      });
      // console.log("data new", dataNew);
      if (dataNew?.data)
        setPaginationData(
          Math.ceil(dataNew?.data?.getFilteredCars?.totalCount / dataPerPage),
          0, ///current page
          1, ////page loaded from api
          dataNew?.data?.getFilteredCars?.totalCount || 0,
          dataNew?.data?.getFilteredCars?.cars
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
  const { setSelectedCar } = useDataStore();
  const navigate = useNavigate();
  if (carFilteredLoading || loading) return <p>Loading cars...</p>;
  if (carFilteredError || err) return <p>Error loading cars</p>;
  // Call this function carFilteredLoading an thing card is clicked
  const handleSelectThing = (car: Car) => {
    setSelectedCar(car);
    navigate(`/editCar/${car.id}`);
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
          .map((car: Car) => (
            <div
              key={car?.id}
              onClick={() => handleSelectThing(car)}
              className="max-w-sm overflow-hidden transition duration-500 transform rounded shadow-lg hover:cursor-pointer hover:scale-105 relative"
            >
              <div className="absolute z-10 py-2 px-4 bg-black rounded-lg">
                <p>{car?.active ? "Active" : "Inactive"}</p>
              </div>
              <div className="relative group">
                <img
                  className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110"
                  src={car?.images[0].imageUrl}
                  alt={car?.carTitle}
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white transition-opacity duration-500 ease-in-out bg-black opacity-0 bg-opacity-60 group-hover:opacity-100">
                  {car?.destination?.destinationName}
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-base text-gray-700">{car?.carTitle}</p>
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

export default AllCarsPage;
