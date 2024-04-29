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
import Loader from "../common/Loader";
import React, { useState } from "react";
import { ErrorModal } from "../common/ErrorModal";
import { useMutation } from "@apollo/client";
import {
  CREATE_GENERAL_PACKAGE_MUTATION,
  CREATE_PACKAGE_MUTATION,
  UPDATE_GENERAL_PACKAGE_MUTATION,
} from "../../graphql/mutations";

interface CreatePackageGeneralInput {
  title: string;
  type: string;
  destinations: Array<{ id: string; name: string }>;
  dates?: DatesData[];
  summary: string;
  highlights: Highlight[];
  photos: Photo[];
  exclusion: string[];
  inclusion: string[];
  id: string;
  currentStep: number;
}

const GeneralFormTab = () => {
  const { activeStep, setActiveStep, general, packageId, setPackageId } =
    useGlobalStore();
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);

  const { basicData, datesData, durationData, summaryData } = general;

  const loading = false;
  const [
    createPackage,
    { data: createData, loading: loadingCreate, error: errorCreate },
  ] = useMutation(CREATE_GENERAL_PACKAGE_MUTATION);
  const [
    updatePackage,
    { data: updateData, loading: loadingUpdate, error: errorUpdate },
  ] = useMutation(UPDATE_GENERAL_PACKAGE_MUTATION);
  const handleCreatePackage = (data: any) => {
    createPackage({ variables: { input: data } });
  };
  const handleUpdatePackage = (data: any) => {
    updatePackage({
      variables: { updateGeneralDetailId: packageId, input: data },
    });
  };
  React.useEffect(() => {
    // console.log("create data top level", createData);
    if (createData?.createPackage && !packageId) {
      setPackageId(createData?.createPackage?.id);
      setActiveStep(activeStep + 1);
    }
  }, [createData]);

  React.useEffect(() => {
    // console.log("update data top level", updateData);
    if (updateData?.updateGeneralDetail?.id) {
      setActiveStep(activeStep + 1);
    }
  }, [updateData]);

  const handleSubmit = async () => {
    try {
      const createPackageGeneralInput = {
        title: basicData.title,
        type: basicData.type,
        destinationIds: basicData.destinations.map((el) => el.id),
        datesData,
        durationData,
        summaryData,
      };
      console.log("create package.....", createPackageGeneralInput);
      if (packageId) {
        handleUpdatePackage(createPackageGeneralInput);
      } else {
        handleCreatePackage(createPackageGeneralInput);
      }
      // Increase the active step upon success
    } catch (error) {
      console.error("Runtime error occurred:", error);
      setErrorModalOpen(true); // Open the error modal for runtime errors
    }
  };

  return (
    <>
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <form className="bg-white border rounded-sm border-stroke dark:border-strokedark dark:bg-boxdark">
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
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loadingCreate || loadingUpdate}
                    className="flex justify-center px-4 py-2 font-medium text-white rounded-lg bg-primary"
                  >
                    Submit & Next
                  </button>
                )}
                <p>
                  {(errorCreate || errorUpdate)?.message
                    ? errorCreate?.message || errorUpdate?.message
                    : ""}
                </p>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default GeneralFormTab;
