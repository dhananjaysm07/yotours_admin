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
import React from "react";
// import { useQuery } from "react-query";
import { GET_COMPLETE_PACKAGE_DETAIL } from "../../graphql/packageQuery";
import { useQuery } from "@apollo/client";

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
    itinerary,
    setPackageId,
    packageId,
    setGeneral,
    setLanguages,
    setLocation,
    setCancellationPolicy,
    // setPricing,
    setItinerary,
    setPricing,
  } = useGlobalStore();
  const { refetch } = useQuery(GET_COMPLETE_PACKAGE_DETAIL, {
    variables: {
      getHolidayId: packageId,
    },
    skip: true,
  });
  React.useEffect(() => {
    // handleRefetchData();
    setPackageId("");
  }, []);
  const handleRefetchData = async () => {
    const { data } = await refetch({
      getHolidayId: packageId,
    });
    // console.log("data-------------------------------", data);
    const { getHoliday } = data || {};
    // console.log("getHoliday", getHoliday);
    if (getHoliday) {
      setGeneral("basicData", {
        destinations: getHoliday.destinations?.map(
          (destination: { destinationName: string; id: string }) => ({
            name: destination?.destinationName,
            id: destination?.id,
          })
        ),
        title: getHoliday.title || "",
        type: getHoliday.type || "",
        themes: getHoliday.themes || [],
        preferences: getHoliday.preferences || [],
      });
      setGeneral("durationData", {
        ...getHoliday.durationData,
      });
      setGeneral("datesData", [...getHoliday.datesData]);
      setGeneral("summaryData", {
        inclusions: getHoliday.summaryData?.inclusions || [],
        exclusions: getHoliday.summaryData?.exclusions || [],
        highlights: getHoliday.summaryData?.highlights || [],
        photos: getHoliday?.summaryData?.photos || [],
        summary: getHoliday?.summaryData?.summary || "",
      });
      setItinerary("daywiseItinerary", getHoliday?.daywiseItinerary || []);
      setLocation("hotelsData", getHoliday?.locationData?.hotels || []);
      setLocation(
        "intercityData",
        getHoliday?.locationData?.intercityData || []
      );
      setLocation("sightseeingData", getHoliday?.locationData?.sightData || []);
      setLocation("transfers", {
        localTransfers:
          getHoliday?.locationData?.transfers?.localTransfers || false,
        airportTransfers:
          getHoliday?.locationData?.transfers?.airportTransfers || false,
      });
      setPricing("adultPrice", getHoliday?.pricingData?.adultPrice || 0);
      setPricing("childPrice", getHoliday?.pricingData?.childPrice || 0);
      setPricing("currency", getHoliday?.pricingData?.currency || "");
      setPricing("type", getHoliday?.pricingData?.type || "");
      setPricing("maxMembers", getHoliday?.pricingData?.maxMembers || 0);
      setLanguages(getHoliday?.languages);
      setCancellationPolicy({ ...getHoliday?.cancellationPolicy });
    }
  };
  React.useEffect(() => {
    if (packageId) {
      handleRefetchData();
    }
  }, [packageId]);
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
      <div id="mainForm">
        <ErrorBoundary>{getStepContent(activeStep)}</ErrorBoundary>
        {/* <div className="flex justify-end p-4 mt-1 space-x-2 bg-white">
          {activeStep == steps.length - 1 && (
            <button
              type="button"
              className="flex justify-center px-4 py-2 font-medium text-white rounded-lg bg-primary"
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          )}
        </div> */}
      </div>
      {/* Consider adding a submit button when on the last step */}
    </div>
  );
};

export default CreatePackagePage;
