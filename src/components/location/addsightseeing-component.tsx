import React, { useState } from "react";
import CustomSelect from "../common/CustomSelect";
import { SightSeeingData, useGlobalStore } from "../../store/globalStore";
import DynamicInputList from "../common/DynamicDataInput";

const SightSeeingComponent: React.FC = () => {
  const [sightsFormData, setSightsFormData] = useState<SightSeeingData>({
    city: "",
    sights: [],
  });
  const store = useGlobalStore();
  const { general, location, setLocation } = store;
  const { sightseeingData } = location;
  const cityOptions = general.basicData.cities.map((city) => ({
    label: city,
    value: city,
  }));

  const handleSave = () => {
    let updatedsightseeingData = [...sightseeingData, sightsFormData];

    setLocation("sightseeingData", updatedsightseeingData);
    setSightsFormData({
      city: "",
      sights: [],
    });
  };

  return (
    <div className="p-6.5 border shadow-sm border-gray">
        <div className="w-full mb-3 sm:w-1/2">
          <label className="block text-black dark:text-white">City:</label>
          <CustomSelect
            isMulti={false}
            requiredField={false}
            placeholder="Select cities"
            options={cityOptions}
            value={[{ value: sightsFormData.city, label: sightsFormData.city }]}
            onSelect={(selectedCity) => {
              setSightsFormData((prev) => ({
                ...prev,
                city: selectedCity[0].value,
              }));
            }}
          />
        </div>
        {sightsFormData.city !== "" && (
          <div className="w-full mb-4 sm:w-1/2">
            <DynamicInputList
              initialItemList={sightsFormData.sights}
              label="Sights"
              onUpdateItemList={(newlist) => {
                setSightsFormData((prev) => ({ ...prev, sights: newlist }));
              }}
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 font-bold text-white rounded-lg bg-meta-3 hover:bg-blue-700"
        >
          Save
        </button>
    </div>
  );
};

export default SightSeeingComponent;
