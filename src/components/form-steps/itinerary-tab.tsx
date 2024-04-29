import React, { useEffect } from "react";
import { useGlobalStore } from "../../store/globalStore";
import ItineraryComponent from "../itinerary/itinerary-component";
import { UPDATE_ITINERARY_MUTATION } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
// import { steps } from "../../utils/steps";

const ItineraryFormTab = () => {
  const {
    activeStep,
    setActiveStep,
    general,
    itinerary,
    setItinerary,
    packageId,
  } = useGlobalStore();
  console.log(general);
  const [updateItinerary, { data, loading, error }] = useMutation(
    UPDATE_ITINERARY_MUTATION
  );
  const createEmptyItinerary = (numDays: number) => {
    return Array.from({
      length: numDays - itinerary?.daywiseItinerary?.length || 0,
    }).map((_, index) => ({
      day: index + 1,
      description: "",
      cities: [],
      meals: [],
      inclusions: [],
      exclusions: [],
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("itinerary", itinerary);
    updateItinerary({
      variables: {
        updateItineraryId: packageId,
        input: { daywiseItinerary: itinerary.daywiseItinerary },
      },
    });
    // setActiveStep(activeStep + 1);
  };
  useEffect(() => {
    const numDays = general.durationData.days || 0;
    if (
      numDays &&
      (!itinerary.daywiseItinerary ||
        itinerary.daywiseItinerary.length !== numDays)
    ) {
      const emptyItinerary = createEmptyItinerary(numDays);
      const combinedItenerary = [
        ...(itinerary?.daywiseItinerary || []),
        ...emptyItinerary,
      ];
      setItinerary("daywiseItinerary", combinedItenerary);
    }
  }, [general.durationData.days, itinerary.daywiseItinerary, setItinerary]);
  console.log("itenerary detail", itinerary);
  React.useEffect(() => {
    if (!loading && data?.updateItinerary) setActiveStep(activeStep + 1);
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
            <h3 className="font-semibold text-white ">Itinerary Details</h3>
          </div>

          <div className="p-4">
            {itinerary.daywiseItinerary.map((_, index) => (
              <div key={index}>
                <ItineraryComponent dayIndex={index} />
              </div>
            ))}
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
          </div>
        </form>
      </div>
    </>
  );
};

export default ItineraryFormTab;
