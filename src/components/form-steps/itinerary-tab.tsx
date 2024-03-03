import { useEffect } from "react";
import { useGlobalStore } from "../../store/globalStore";
import ItineraryComponent from "../itinerary/itinerary-component";
import { steps } from "../../utils/steps";

const ItineraryFormTab = () => {
  const { activeStep, setActiveStep, general, itinerary, setItinerary } =
    useGlobalStore();
  console.log(general);
  const createEmptyItinerary = (numDays: number) => {
    return Array.from({ length: numDays }).map((_, index) => ({
      day: index + 1,
      description: "",
      cities: [],
      meals: [],
      inclusions: [],
      exclusions: [],
    }));
  };
  const handleSubmit = async () => {
    console.log("itinerary", itinerary);
  };
  useEffect(() => {
    const numDays = general.durationData.days || 0;
    if (
      numDays &&
      (!itinerary.daywiseItinerary ||
        itinerary.daywiseItinerary.length !== numDays)
    ) {
      const emptyItinerary = createEmptyItinerary(numDays);
      setItinerary("daywiseItinerary", emptyItinerary);
    }
  }, [general.durationData.days, itinerary.daywiseItinerary, setItinerary]);

  return (
    <>
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="bg-white border rounded-sm border-stroke dark:border-strokedark dark:bg-boxdark">
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
            {activeStep < steps.length - 1 && (
              <button
                type="submit"
                className="flex justify-center px-4 py-2 font-medium text-white rounded-lg bg-primary"
                onSubmit={handleSubmit}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ItineraryFormTab;
