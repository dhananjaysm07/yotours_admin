import React, { useState } from "react";
import DynamicInputList from "../common/DynamicDataInput";
import CustomFloatingInput from "../common/CustomFloatingInput";
import CustomSelect, { OptionType } from "../common/CustomSelect";
import { HotelData, useGlobalStore } from "../../store/globalStore";
interface EditHotelModalProps {
  hotel: HotelData;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditHotelModal: React.FC<EditHotelModalProps> = ({ hotel, setModal }) => {
  const store = useGlobalStore();
  const [sameForAll, setSameForAll] = useState<boolean>(false);
  const [hotelFormData, setHotelFormData] = useState<HotelData>(hotel);
  const { general, location, setLocation } = store;
  const { hotelsData } = location;

  const cityOptions = general.basicData.cities.map((city) => ({
    label: city,
    value: city,
  }));

  const handleCitySelection = (selectedCities: OptionType[]) => {
    setHotelFormData((prev) => ({
      ...prev,
      cities: selectedCities.map((cityOption) => cityOption.value),
    }));
  };
  const handleSave = () => {
    const updatedHotelData = hotelsData.map((item) => {
      if (item.name === hotel.name) {
        // Assuming hotelId is the unique identifier of the hotel being edited
        return hotelFormData;
      }
      return hotel;
    });

    setLocation("hotelsData", updatedHotelData);
    setModal(false);
  };

  // Input validation function to accept only numeric characters
  const validateNumericInput = (inputValue: string) => {
    const numericValue = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    return numericValue;
  };
  return (
    <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="p-6.5 border bg-white shadow-sm border-gray">
        <div className="w-full mb-3">
          <label className="block text-black dark:text-white">City:</label>
          <CustomSelect
            isMulti={true}
            isDisabled={sameForAll}
            options={cityOptions}
            onSelect={handleCitySelection}
            value={
              hotelFormData.cities?.map((city) => ({
                label: city,
                value: city,
              })) ?? []
            }
            requiredField={false}
            placeholder="Select cities"
          />
        </div>
        <div className="w-full mb-4 ">
          <label
           
            className="block text-black dark:text-white"
          >
            Hotel Name:
          </label>
          <input
            type="text"
            id="hotelName"
            placeholder="Enter hotel name"
            className="custom-input w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={hotelFormData.name}
            onChange={(e) => {
              setHotelFormData((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
        </div>

        <div className="w-full mb-4 ">
          <label  className="font-medium">
            Rating:
          </label>
          <CustomSelect
            isMulti={false}
            requiredField={false}
            placeholder="Select rating"
            value={[
              { label: hotelFormData.rating, value: hotelFormData.rating },
            ]}
            options={[
              { label: "3 Star", value: "3star" },
              { label: "4 Star", value: "4star" },
              { label: "5 Star", value: "5star" },
            ]}
            onSelect={(ratings: OptionType[]) => {
              setHotelFormData((prev) => ({
                ...prev,
                rating: ratings[0].value,
              }));
            }}
          />
          {/* {!state.sameForAllDestinations &&
        hotelFormDataChanged.selectedHotelCategories &&
        state.selectedHotelCategories.length === 0 && (
          <p className="m-1 text-xs text-danger">
            Please input the hotel category
          </p>
        )} */}
        </div>
        <div className="w-full mb-4 ">
          <label className="block mb-3 text-black dark:text-white">
            Duration
          </label>
          <div className="flex gap-4">
            <CustomFloatingInput
              label="Days"
              placeholder="Enter Days"
              value={
                hotelFormData.days === 0 ? "" : hotelFormData.days.toString()
              }
              onChange={(e) => {
                const newValue = validateNumericInput(e.target.value);

                setHotelFormData((prev) => ({
                  ...prev,
                  days: newValue === "" ? 0 : parseInt(newValue, 10),
                }));
              }}
            />
            {/* {!state.sameForAllDestinations &&
          hotelFormDataChanged.days &&
          state.days === '' && <p className="m-1 text-danger text-md">*</p>} */}
            <CustomFloatingInput
              label="Nights"
              placeholder="Enter nights"
              value={
                hotelFormData.nights === 0
                  ? ""
                  : hotelFormData.nights.toString()
              }
              onChange={(e) => {
                const newValue = validateNumericInput(e.target.value);

                setHotelFormData((prev) => ({
                  ...prev,
                  nights: newValue === "" ? 0 : parseInt(newValue, 10),
                }));
              }}
            />
            {/* {hotelFormDataChanged.nights && state.nights === '' && (
          <p className="m-1 text-danger text-md">*</p>
        )} */}
          </div>
        </div>

        <div className="w-full mb-4 ">
          <DynamicInputList
            initialItemList={hotelFormData.meals}
            label="Meals"
            onUpdateItemList={(newlistmeals) => {
              setHotelFormData((prev) => ({ ...prev, meals: newlistmeals }));
            }}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 font-bold text-white rounded-lg bg-meta-3 hover:bg-blue-700"
            onClick={handleSave}
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

export default EditHotelModal;
