import React, { useState } from "react";
import CustomSelect from "../common/CustomSelect";
import { SightSeeingData, useGlobalStore } from "../../store/globalStore";
import DynamicInputList from "../common/DynamicDataInput";
interface EditSightseeingModalProps {
  sightseeing: SightSeeingData;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditSightseeingModal: React.FC<EditSightseeingModalProps> = ({
  sightseeing,
  setModal,
}) => {
  const [sightsFormData, setSightsFormData] =
    useState<SightSeeingData>(sightseeing);
  const store = useGlobalStore();
  const { general, location, setLocation } = store;
  const { sightseeingData } = location;
  const cityOptions = general.basicData.destinations.map((city) => ({
    label: city.name,
    value: city.id,
  }));

  const handleSave = () => {
    const updatedSightseeingData = sightseeingData.map((item) => {
      if (item.city === sightseeing.city) {
        return sightsFormData;
      }
      return sightseeing;
    });

    setLocation("sightseeingData", updatedSightseeingData);
    setModal(false);
  };

  return (
    <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="p-6.5 bg-white border shadow-sm border-gray">
        <div className="w-full mb-3 ">
          <label className="block text-black dark:text-white">City:</label>
          <CustomSelect
            isMulti={false}
            requiredField={false}
            placeholder="Select cities"
            options={cityOptions}
            value={[
              {
                value: sightsFormData.city.id,
                label: sightsFormData.city.name,
              },
            ]}
            onSelect={(selectedCity) => {
              setSightsFormData((prev) => ({
                ...prev,
                city: {
                  id: selectedCity[0].value,
                  name: selectedCity[0].label,
                },
              }));
            }}
          />
        </div>
        {sightsFormData.city.name !== "" && (
          <div className="w-full mb-4 ">
            <DynamicInputList
              initialItemList={sightsFormData.sights}
              label="Sights"
              onUpdateItemList={(newlist) => {
                setSightsFormData((prev) => ({ ...prev, sights: newlist }));
              }}
            />
          </div>
        )}

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

export default EditSightseeingModal;
