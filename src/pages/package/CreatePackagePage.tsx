import GeneralFormTab from "../../components/form-steps/general-tab";
import { useGlobalStore } from "../../store/globalStore";
import ErrorBoundary from "../../layout/ErrorBoundary";
import ItineraryFormTab from "../../components/form-steps/itinerary-tab";
import LocationFormTab from "../../components/form-steps/location-tab";
import StepProgressBar from "../../components/common/StepProgessBar";
import PricingFormTab from "../../components/form-steps/pricing-tab";
import LanguageFormTab from "../../components/form-steps/language-tab";
import PolicyFormTab from "../../components/form-steps/policy-tab";
import { steps } from "../../utils/steps";

function getStepContent(stepIndex: number) {
  switch (stepIndex) {
    case 0:
      return <GeneralFormTab />;
    case 1:
      return <ItineraryFormTab />;
    case 2:
      return <LocationFormTab />;
    case 3:
      return <PricingFormTab />;
    case 4:
      return <LanguageFormTab />;
    case 5:
      return <PolicyFormTab />;
    default:
      return null;
  }
}
const CreatePackagePage = () => {
  const {
    activeStep,
    general,
    location,
    pricing,
    cancellationPolicy,
    setActiveStep,
    itinerary,
  } = useGlobalStore();
  const handleSubmit = async () => {
    const fullData = {
      general,
      location,
      pricing,
      cancellationPolicy,
      itinerary,
      // ... any other data from the global store
    };

    try {
      // const response = await fetch("/api/submitPackage", {
      //   // Replace with your API endpoint
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(fullData),
      // });
      let response: any;
      console.log(JSON.stringify(fullData));

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div>
      {/* <Breadcrumb pageName="Create Holiday Package" />
       */}
      <StepProgressBar steps={steps} />
      <form
        id="mainForm"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <ErrorBoundary>{getStepContent(activeStep)}</ErrorBoundary>
        <div className="flex justify-end p-4 mt-1 space-x-2 bg-white">
          {activeStep == steps.length - 1 && (
            <button
              type="button"
              className="flex justify-center px-4 py-2 font-medium text-white rounded-lg bg-primary"
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          )}
        </div>
      </form>
      {/* Consider adding a submit button when on the last step */}
    </div>
  );
};

export default CreatePackagePage;
