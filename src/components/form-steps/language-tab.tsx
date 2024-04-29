import { useMutation } from "@apollo/client";
import { UPDATE_LANGUAGE_MUTATION } from "../../graphql/mutations";
import { useGlobalStore } from "../../store/globalStore";
import CustomSelect, { OptionType } from "../common/CustomSelect";
import React from "react";
const languageOptions: OptionType[] = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  // Add more language options as needed
];
const LanguageFormTab = () => {
  const { languages, setLanguages, activeStep, setActiveStep, packageId } =
    useGlobalStore();
  const [updatePricing, { data, loading, error }] = useMutation(
    UPDATE_LANGUAGE_MUTATION
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("languages", languages);
    updatePricing({
      variables: {
        updateLanguagesId: packageId,
        input: { languages },
      },
    });
    // setActiveStep(activeStep + 1);
  };
  React.useEffect(() => {
    if (!loading && data?.updateLanguages) setActiveStep(activeStep + 1);
  }, [loading]);
  return (
    <>
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <form
          className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark"
          onSubmit={handleSubmit}
        >
          <div className="border-b bg-primary border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-semibold text-white ">Languages Details</h3>
          </div>

          <div className="p-6.5">
            <div className="mb-3">
              <label className="block text-black dark:text-white">
                Languages:
              </label>
              <CustomSelect
                isMulti={true}
                requiredField={false}
                placeholder="Select languages"
                value={
                  Array.isArray(languages)
                    ? languages.map((lang) => ({ label: lang, value: lang }))
                    : []
                }
                options={languageOptions}
                onSelect={(selected) => {
                  console.log(languages);
                  const selectedLanguages = selected.map((lang) => lang.value);

                  setLanguages(selectedLanguages);
                }}
              />
            </div>
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
            <p>{error && error?.message}</p>
          </div>
        </form>
      </div>
    </>
  );
};

export default LanguageFormTab;
