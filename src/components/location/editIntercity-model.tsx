import React, { useState } from "react";
import CustomSelect, { OptionType } from "../common/CustomSelect";
import { IntercityData, useGlobalStore } from "../../store/globalStore";
interface EditIntercityModalProps {
  intercity: IntercityData;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditIntercityModal: React.FC<EditIntercityModalProps> = ({
  intercity,
  setModal,
}) => {
  const store = useGlobalStore();
  const [sameForAll, setSameForAll] = useState<boolean>(false);
  const [intercityFormData, setIntercityFormData] =
    useState<IntercityData>(intercity);
  const { general, location, setLocation } = store;
  const { intercityData } = location;

  const cityOptions = general.basicData.cities.map((city) => ({
    label: city,
    value: city,
  }));

  const handleFromCity = (selectedCities: OptionType[]) => {
    setIntercityFormData((prev) => ({
      ...prev,
      fromCity: selectedCities[0].value,
    }));
  };
  const handleToCity = (selectedCities: OptionType[]) => {
    setIntercityFormData((prev) => ({
      ...prev,
      toCity: selectedCities[0].value,
    }));
  };
  const handleSave = () => {
    const updatedIntercityData = intercityData.map((item) => {
      if (
        item.fromCity === intercity.fromCity &&
        item.toCity === intercity.toCity
      ) {
        return intercityFormData;
      }
      return intercity;
    });

    setLocation("intercityData", updatedIntercityData);
    setModal(false);
  };

  return (
    <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="bg-white p-6.5 border shadow-sm border-gray">
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
        <div className="w-full mb-3 ">
          <label className="block text-black dark:text-white">From City:</label>
          <CustomSelect
            isMulti={false}
            isDisabled={sameForAll}
            options={cityOptions}
            onSelect={handleFromCity}
            value={[
              {
                value: intercityFormData.fromCity,
                label: intercityFormData.fromCity,
              },
            ]}
            requiredField={false}
            placeholder="Select From City"
          />
        </div>
        <div className="w-full mb-3 ">
          <label className="block text-black dark:text-white">To City:</label>
          <CustomSelect
            isMulti={false}
            isDisabled={sameForAll}
            options={cityOptions}
            onSelect={handleToCity}
            value={[
              {
                value: intercityFormData.fromCity,
                label: intercityFormData.fromCity,
              },
            ]}
            requiredField={false}
            placeholder="Select To City"
          />
        </div>
        <div className="w-full mb-3">
          <label className="block text-black dark:text-white">Mode:</label>
          <CustomSelect
            isMulti={false}
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
            requiredField={true}
            placeholder="Select mode"
          />
        </div>
        <div className="w-full mb-4 ">
          <label
            htmlFor="hotelName"
            className="block text-black dark:text-white"
          >
            Description
          </label>
          <input
            type="text"
            id="hotelName"
            required
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

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 font-bold text-white rounded-lg bg-meta-3 hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            className="px-4 py-2 font-bold text-white rounded-lg bg-danger hover:bg-blue-700"
            onClick={() => setModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditIntercityModal;
