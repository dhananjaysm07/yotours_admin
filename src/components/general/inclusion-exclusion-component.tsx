import React, { useState } from "react";
import { useGlobalStore } from "../../store/globalStore";
import { IoAddCircleOutline } from "react-icons/io5";

const InclusionExclusionComponent = () => {
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [inclusionError, setInclusionError] = useState("");
  const [exclusionError, setExclusionError] = useState("");
  const store = useGlobalStore();
  const { general, setGeneral } = store;
  const { summaryData } = general;

  const handleInclusionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewInclusion(e.target.value);
  };

  const handleExclusionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExclusion(e.target.value);
  };

  const handleAddInclusion = () => {
    // Add validation logic here if needed
    const updatedInclusions = [
      ...store.general.summaryData.inclusions,
      newInclusion,
    ];
    setGeneral("summaryData", { inclusions: updatedInclusions });
    setNewInclusion("");
  };

  const handleAddExclusion = () => {
    // Add validation logic here if needed
    const updatedExclusions = [
      ...store.general.summaryData.exclusions,
      newExclusion,
    ];
    setGeneral("summaryData", { exclusions: updatedExclusions });
    setNewExclusion("");
  };

  const handleRemoveInclusion = (index: number) => {
    const updatedInclusions = store.general.summaryData.inclusions.filter(
      (_, i) => i !== index
    );
    setGeneral("summaryData", { inclusions: updatedInclusions });
  };

  const handleRemoveExclusion = (index: number) => {
    const updatedExclusions = store.general.summaryData.exclusions.filter(
      (_, i) => i !== index
    );
    setGeneral("summaryData", { exclusions: updatedExclusions });
  };
  return (
    <div className="mb-4.5 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b bg-gray-3 dark:bg-graydark border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
        <h3 className="font-semibold text-black dark:text-white">
          Inclusions and Exclusions
        </h3>
      </div>

      <div className="p-4">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:pr-2 sm:w-1/2">
            <label className="block mb-1 font-medium text-gray-800">
              Inclusions
            </label>
            <div className="flex">
              <input
                type="text"
                value={newInclusion}
                onChange={handleInclusionChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Enter inclusion"
              />
              <button
                type="button"
                className="px-4 py-2 ml-2 text-white rounded-lg bg-primary hover:bg-blue-600"
                onClick={handleAddInclusion}
              >
                <span className="text-white ">
                  <IoAddCircleOutline size={24} />
                </span>
              </button>
            </div>
            {inclusionError && (
              <p className="mt-1 text-danger">{inclusionError}</p>
            )}
            {/* {showHelperTextInclusion && addInclusion.length == 0 && (
        // <p className="mt-1 text-danger">Please add an Inclusion</p>
      )} */}
            {summaryData.inclusions.length > 0 && (
              <ul className="py-2 mt-2">
                {summaryData.inclusions.map((inclusion, index) => (
                  <li
                    key={index}
                    className="flex items-center mb-1 text-graydark"
                  >
                    <div className="flex items-center justify-between w-full px-3 py-2 border rounded-md shadow-sm text-graydark border-meta-3/90 ">
                      <div className="flex items-center">
                        <span>{inclusion}</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4 ml-2 cursor-pointer text-graydark hover:text-danger"
                        onClick={() => handleRemoveInclusion(index)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="w-full mt-4 sm:mt-0 sm:pl-2 sm:w-1/2">
            <label className="block mb-1 font-medium text-gray-800">
              Exclusions
            </label>
            <div className="flex">
              <input
                type="text"
                value={newExclusion}
                onChange={handleExclusionChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Enter exclusion"
              />
              <button
                type="button"
                className="px-4 py-2 ml-2 text-white rounded-lg bg-primary hover:bg-blue-600"
                onClick={handleAddExclusion}
              >
                <IoAddCircleOutline size={24} />
              </button>
            </div>
            {exclusionError && (
              <p className="mt-1 text-danger">{exclusionError}</p>
            )}
            {summaryData.exclusions.length > 0 && (
              <ul className="py-2 mt-2 ">
                {summaryData.exclusions.map((exclusion, index) => (
                  <li
                    key={index}
                    className="flex items-center mb-1 text-graydark"
                  >
                    <div className="flex items-center justify-between w-full px-3 py-2 border rounded-md shadow-sm text-graydark border-meta-1/90 ">
                      <div className="flex items-center">
                        <span>{exclusion}</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4 ml-2 cursor-pointer text-graydark hover:text-danger"
                        onClick={() => handleRemoveExclusion(index)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InclusionExclusionComponent;
