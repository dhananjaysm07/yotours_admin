import { useMutation } from "@apollo/client";
import {
  DatesData,
  Highlight,
  Photo,
  useGlobalStore,
} from "../../store/globalStore";
import { steps } from "../../utils/steps";
import BasicDetailsSection from "../general/basic-details-section";
import DatesDetailsSection from "../general/dates-details-section";
import DurationDetailsSection from "../general/duration-details-section";
import SummaryDetailsSection from "../general/summary-details-section";
import {
  CREATE_PACKAGE_MUTATION,
  UPDATE_PACKAGE_MUTATION,
} from "../../graphql/mutations";
import Loader from "../common/Loader";
import { useState } from "react";
import { ErrorModal } from "../common/ErrorModal";

interface CreatePackageGeneralInput {
  title: string;
  type: string;
  destinationIds: string[];
  dates?: DatesData[];
  summary: string;
  highlights: Highlight[];
  photos: Photo[];
  exclusion: string[];
  inclusion: string[];
  id: string;
  // createdAt: Date;
  // updatedAt: Date;
  currentStep: number;
}
interface DateDetailsInput {
  bookingFromDate: string;
  bookingToDate: String;
  travenDates: {
    fromDate: string;
    toDate: string;
  }[];
}

interface HighlightInput {
  title: string;
  description: string;
  url: string;
}
interface PhotoInput {
  url: string;
}

type CreatePackageGeneralResponse = {
  createPackageGeneral: {
    id: string;
  };
};
type UpdatePackageGeneralResponse = {
  updatePackageGeneral: {
    id: string;
  };
};
const GeneralFormTab = () => {
  const { activeStep, setActiveStep, general, packageId, setPackageId } =
    useGlobalStore();
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);

  const { basicData, datesData, durationData, summaryData } = general;
  const [createPackageGeneral, { data, loading, error }] =
    useMutation<CreatePackageGeneralResponse>(CREATE_PACKAGE_MUTATION);
  const [
    updatePackageGeneral,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation<UpdatePackageGeneralResponse>(UPDATE_PACKAGE_MUTATION);

  // const transformDatesDataToInput = (data: DatesData): DateDetailsInput => {
  //   return {
  //     bookingFromDate: data.bookingDates,
  //     bookingToDate: data.bookingDates.to,
  //     travenDates: data.travelDates.map((date) => ({
  //       fromDate: date.from,
  //       toDate: date.to,
  //     })),
  //   };
  // };
  const handleSubmit = async () => {
    console.log("handle submit", {
      productTitle: basicData.title,
      productType: basicData.type,
      destinationIds: basicData.destinations,
      dates: datesData,
      summary: summaryData.summary,
      inclusion: summaryData.inclusions,
      exclusion: summaryData.exclusions,
      highlights: summaryData.highlights,
      photos: summaryData.photos,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    try {
      const createPackageGeneralInput: CreatePackageGeneralInput = {
        title: basicData.title,
        type: basicData.type,
        destinationIds: basicData.destinations,
        dates: datesData,
        summary: summaryData.summary,
        highlights: summaryData.highlights,
        photos: summaryData.photos,
        inclusion: summaryData.inclusions,
        exclusion: summaryData.exclusions,
        id: packageId || "",
        // createdAt: new Date(),
        // updatedAt: new Date(),
        currentStep: 0,
        //... other fields
      };

      // if (packageId) {
      //   // Call your update API here
      //   const updateResponse = await updatePackageGeneral({
      //     variables: {
      //       updatePackageGeneralInput: createPackageGeneralInput,
      //       id: packageId,
      //     },
      //   });

      //   if (updateError) {
      //     console.error("Failed to update package:", updateError);
      //     setErrorModalOpen(true);
      //     return; // Do not proceed if there's an error
      //   }

      //   console.log("Package updated:", updateResponse.data);
      // }
      // else {
      console.log("create package.....", createPackageGeneralInput);
      const response = await createPackageGeneral({
        variables: { createPackageGeneralInput: createPackageGeneralInput },
      });
      if (error) {
        console.error("Failed to create package:", error);
        setErrorModalOpen(true);
        return; // Do not proceed if there's an error
      }

      console.log("Package created:", response.data);
      setPackageId(response.data!.createPackageGeneral.id);
      // }

      setActiveStep(activeStep + 1); // Increase the active step upon success
    } catch (error) {
      console.error("Runtime error occurred:", error);
      setErrorModalOpen(true); // Open the error modal for runtime errors
    }
  };

  return (
    <>
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="bg-white border rounded-sm border-stroke dark:border-strokedark dark:bg-boxdark">
          <div className="border-b bg-primary border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-semibold text-white ">General Details</h3>
          </div>
          {isErrorModalOpen && (
            <ErrorModal setErrorModalOpen={setErrorModalOpen} />
          )}

          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="p-4">
                <BasicDetailsSection />
                <DurationDetailsSection />
                <DatesDetailsSection />
                <SummaryDetailsSection />
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
                    onClick={handleSubmit}
                    className="flex justify-center px-4 py-2 font-medium text-white rounded-lg bg-primary"
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GeneralFormTab;
