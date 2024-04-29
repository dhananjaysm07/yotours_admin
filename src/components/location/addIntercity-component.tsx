import React, { useState } from "react";
import CustomSelect, { OptionType } from "../common/CustomSelect";
import { IntercityData, useGlobalStore } from "../../store/globalStore";

const IntercityComponent: React.FC = () => {
  const store = useGlobalStore();
  const [sameForAll, setSameForAll] = useState<boolean>(false);
  const [intercityFormData, setIntercityFormData] = useState<IntercityData>({
    description: "",
    fromCity: { name: "", id: "" },
    mode: "",
    toCity: { name: "", id: "" },
  });
  const { general, location, setLocation } = store;
  const { intercityData } = location;

  const cityOptions = general.basicData.destinations.map((city) => ({
    label: city.name,
    value: city.id,
  }));

  const handleFromCity = (selectedCities: OptionType[]) => {
    console.log("selected city", selectedCities);
    const cityValue =
      selectedCities.length > 0
        ? { id: selectedCities[0].value, name: selectedCities[0].label }
        : { id: "", name: "" };
    setIntercityFormData((prev) => ({
      ...prev,
      fromCity: { name: cityValue.name, id: cityValue.id },
    }));
  };
  const handleToCity = (selectedCities: OptionType[]) => {
    const cityValue =
      selectedCities.length > 0
        ? { id: selectedCities[0].value, name: selectedCities[0].label }
        : { id: "", name: "" };
    setIntercityFormData((prev) => ({
      ...prev,
      toCity: { name: cityValue.name, id: cityValue.id },
    }));
  };
  const handleSave = () => {
    const updatedIntercityData = [...intercityData, intercityFormData];

    setLocation("intercityData", updatedIntercityData);
    setIntercityFormData({
      description: "",
      fromCity: { name: "", id: "" },
      mode: "",
      toCity: { name: "", id: "" },
    });
  };

  return (
    <div className="p-6.5 border shadow-sm border-gray">
      <div className="flex items-center mb-4 hidden">
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
          isMulti={false}
          options={cityOptions}
          onSelect={(selected) => handleFromCity(selected)}
          value={[
            {
              value: intercityFormData.fromCity.id ?? "",
              label: intercityFormData.fromCity.name ?? "",
            },
          ]}
          requiredField={intercityData.length > 0 ? false : true}
          placeholder="Select From City"
        />
      </div>
      <div className="w-full mb-3 sm:w-1/2">
        <label className="block text-black dark:text-white">To City:</label>
        <CustomSelect
          isMulti={false}
          options={cityOptions}
          onSelect={handleToCity}
          value={[
            {
              value: intercityFormData.toCity.id,
              label: intercityFormData.toCity.name,
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
        <label className="block text-black dark:text-white">Description</label>
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
