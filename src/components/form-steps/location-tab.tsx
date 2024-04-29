import { useGlobalStore } from "../../store/globalStore";
import IntercityComponent from "../location/addIntercity-component";
import HotelComponent from "../location/addhotel-component";
import HotelTableComponent from "../location/hoteltable-component";
import IntercityTableComponent from "../location/intercitytable-component";
import SightSeeingComponent from "../location/addsightseeing-component";
import SightseeingTableComponent from "../location/sightseeingtable-component";
import TransferComponent from "../location/transfers-component";
import { useMutation } from "@apollo/client";
import { UPDATE_LOCATION_DATA_MUTATION } from "../../graphql/mutations";
import React from "react";

const LocationFormTab = () => {
  const { hotelsData, intercityData, sightseeingData, transfers } =
    useGlobalStore((s) => s.location);
  const { setActiveStep, activeStep, packageId } = useGlobalStore();
  const [updateLocation, { data, loading, error }] = useMutation(
    UPDATE_LOCATION_DATA_MUTATION
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(
    //   "Location data",
    //   hotelsData,
    //   intercityData,
    //   sightseeingData,
    //   transfers
    // );
    updateLocation({
      variables: {
        updateLocationId: packageId,
        input: {
          locationData: {
            hotelsData,
            intercityData,
            sightseeingData,
            transfers,
          },
        },
      },
    });
    // setActiveStep(activeStep + 1);
  };
  React.useEffect(() => {
    if (!loading && data?.updateLocation) setActiveStep(activeStep + 1);
  }, [loading]);
  return (
    <>
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <form
          className="bg-white border rounded-sm border-stroke dark:border-strokedark dark:bg-boxdark"
          onSubmit={handleSubmit}
        >
          <div className="border-b bg-primary border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-semibold text-white ">Location Details</h3>
          </div>
          <div className="p-4">
            <HotelComponent />
            {hotelsData.length > 0 && <HotelTableComponent />}
            <IntercityComponent />
            {intercityData.length > 0 && <IntercityTableComponent />}
            <SightSeeingComponent />
            {sightseeingData.length > 0 && <SightseeingTableComponent />}
            <TransferComponent />
          </div>
          <div className="flex justify-end p-4 mt-1 space-x-2 bg-white">
            {/* Buttons for navigation, validation and submission can be added here */}
            {activeStep > 0 && (
              <button
                className="flex justify-center px-4 py-2 font-medium rounded-lg hover:bg-graydark bg-strokedark text-gray"
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex justify-center px-4 py-2 font-medium text-white rounded-lg bg-primary"
              disabled={loading}
            >
              Submit & Next
            </button>
            {!loading && error?.message}
          </div>
        </form>
      </div>
    </>
  );
};

export default LocationFormTab;
