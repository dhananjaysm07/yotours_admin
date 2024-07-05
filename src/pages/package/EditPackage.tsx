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
import { useParams } from "react-router";

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
const EditPackagePage = () => {
  const {
    activeStep,
    setPackageId,
    packageId,
    setGeneral,
    setLanguages,
    setLocation,
    setCancellationPolicy,
    setItinerary,
    setPricing,
  } = useGlobalStore();
  const { id } = useParams();
  const { refetch } = useQuery(GET_COMPLETE_PACKAGE_DETAIL, {
    variables: {
      getHolidayId: packageId,
    },
    skip: true,
  });
  React.useEffect(() => {
    // handleRefetchData();
    setPackageId(id || "");
  }, [id]);
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

  return (
    <div>
      <StepProgressBar steps={steps} />
      <div id="mainForm">
        <ErrorBoundary>{getStepContent(activeStep)}</ErrorBoundary>
      </div>
    </div>
  );
};

export default EditPackagePage;
