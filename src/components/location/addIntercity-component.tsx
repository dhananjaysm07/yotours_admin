import React, { useState } from "react";
import CustomSelect, { OptionType } from "../common/CustomSelect";
import { IntercityData, useGlobalStore } from "../../store/globalStore";

const IntercityComponent: React.FC = () => {
  const store = useGlobalStore();
  const [sameForAll, setSameForAll] = useState<boolean>(false);
  const [intercityFormData, setIntercityFormData] = useState<IntercityData>({
    description: "",
    fromCity: "",
    mode: "",
    toCity: "",
  });
  const { general, location, setLocation } = store;
  const { intercityData } = location;

  const cityOptions = general.basicData.cities.map((city) => ({
    label: city,
    value: city,
  }));

  const handleFromCity = (selectedCities: OptionType[]) => {
    const cityValue = selectedCities.length > 0 ? selectedCities[0].value : "";
    setIntercityFormData((prev) => ({
      ...prev,
      fromCity: cityValue,
    }));
  };
  const handleToCity = (selectedCities: OptionType[]) => {
    const cityValue = selectedCities.length > 0 ? selectedCities[0].value : "";
    setIntercityFormData((prev) => ({
      ...prev,
      toCity: cityValue,
    }));
  };
  const handleSave = () => {
    let updatedIntercityData = [...intercityData, intercityFormData];

    setLocation("intercityData", updatedIntercityData);
    setIntercityFormData({
      description: "",
      fromCity: "",
      mode: "",
      toCity: "",
    });
  };

  return (
    <div className="p-6.5 border shadow-sm border-gray">
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          className="w-6 h-6"
          id="sameForAllModes"
          checked={sameForAll}
          onChange={() => setSameForAll(!sameForAll)}
        />
        <label htmlFor="sameForAllModes" className="ml-2">
          Same for all modes
        </label>
      </div>
      <div className="w-full mb-3 sm:w-1/2">
        <label className="block text-black dark:text-white">From City:</label>
        <CustomSelect
          isMulti={true}
          options={cityOptions}
          onSelect={(selected) => handleFromCity(selected)}
          value={[
            {
              value: intercityFormData.fromCity ?? "",
              label: intercityFormData.fromCity ?? "",
            },
          ]}
          requiredField={intercityData.length > 0 ? false : true}
          placeholder="Select From City"
        />
      </div>
      <div className="w-full mb-3 sm:w-1/2">
        <label className="block text-black dark:text-white">To City:</label>
        <CustomSelect
          isMulti={true}
          options={cityOptions}
          onSelect={handleToCity}
          value={[
            {
              value: intercityFormData.toCity,
              label: intercityFormData.toCity,
            },
          ]}
          requiredField={intercityData.length > 0 ? false : true}
          placeholder="Select To City"
        />
      </div>
      <div className="w-full mb-3 sm:w-1/2">
        <label className="block text-black dark:text-white">Mode:</label>
        <CustomSelect
          isMulti={sameForAll ? false : true}
          isDisabled={sameForAll}
          options={[
            { label: "Bus", value: "bus" },
            { label: "Air", value: "air" },
            { label: "Train", value: "train" },
            { label: "Private Vehicle", value: "privatevehicle" },
          ]}
          onSelect={(option) => {
            setIntercityFormData((prev) => ({
              ...prev,
              mode: option[0].value,
            }));
          }}
          value={[
            {
              value: intercityFormData.mode,
              label: intercityFormData.mode,
            },
          ]}
          requiredField={intercityData.length > 0 ? false : true}
          placeholder="Select mode"
        />
      </div>
      <div className="w-full mb-4 sm:w-1/2">
        <label className="block text-black dark:text-white">
          Description
        </label>
        <input
          type="text"
          id="modeDescription"
          placeholder="Enter mode description"
          className="custom-input w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={intercityFormData.description}
          onChange={(e) => {
            setIntercityFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }));
          }}
        />
      </div>

      <div>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 font-bold text-white rounded-lg bg-meta-3 hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default IntercityComponent;
