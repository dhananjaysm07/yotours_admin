import React, { useState } from "react";
import DynamicInputList from "../common/DynamicDataInput";
import CustomFloatingInput from "../common/CustomFloatingInput";
import CustomSelect, { OptionType } from "../common/CustomSelect";
import { HotelData, useGlobalStore } from "../../store/globalStore";

const HotelComponent: React.FC = () => {
  const store = useGlobalStore();
  // const [sameForAll, setSameForAll] = useState<boolean>(false);
  const [hotelFormData, setHotelFormData] = useState<HotelData>({
    cities: [],
    days: 0,
    nights: 0,
    meals: [],
    name: "",
    rating: "",
  });
  const { general, location, setLocation } = store;
  const { hotelsData } = location;

  const cityOptions = general.basicData.destinations.map((city) => ({
    label: city.name,
    value: city.id,
  }));

  const handleCitySelection = (selectedCities: OptionType[]) => {
    setHotelFormData((prev) => ({
      ...prev,
      cities: selectedCities.map((cityOption) => ({
        id: cityOption.value,
        name: cityOption.label,
      })),
    }));
  };
  const handleSave = () => {
    const updatedHotelData = [...hotelsData];
    // if (sameForAll) {
    //   cityOptions.forEach((cityOption) => {
    //     const dataForCity = {
    //       ...hotelFormData,
    //       cities: [{ id: cityOption.value, name: cityOption.label }],
    //     };
    //     updatedHotelData.push(dataForCity);
    //   });
    // } else {
    updatedHotelData.push(hotelFormData);
    // }
    setLocation("hotelsData", updatedHotelData);
    setHotelFormData({
      cities: [...hotelFormData.cities],
      days: 0,
      nights: 0,
      meals: [],
      name: "",
      rating: "",
    });
  };

  // console.log("hotel form data", hotelFormData);
  // Input validation function to accept only numeric characters
  const validateNumericInput = (inputValue: string) => {
    const numericValue = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    return numericValue;
  };
  return (
    <div className="p-6.5 border shadow-sm border-gray">
      {/* <div className="flex items-center mb-4">
        <input
          type="checkbox"
          className="w-6 h-6"
          id="sameForAllDestinations"
          checked={sameForAll}
          onChange={() => setSameForAll(!sameForAll)}
        />
        <label htmlFor="sameForAllDestinations" className="ml-2">
          Same for all destinations
        </label>
      </div> */}
      <div className="w-full mb-3 sm:w-1/2">
        <label className="block text-black dark:text-white">City:</label>
        <CustomSelect
          isMulti={true}
          // isDisabled={sameForAll}

          options={cityOptions}
          onSelect={handleCitySelection}
          value={
            hotelFormData.cities?.map((city) => ({
              label: city.name,
              value: city.id,
            })) ?? []
          }
          requiredField={
            // sameForAll ||
            hotelsData.length > 0 ? false : true
          }
          placeholder="Select cities"
        />
      </div>
      <div className="w-full mb-4 sm:w-1/2">
        <label className="block text-black dark:text-white">Hotel Name:</label>
        <input
          type="text"
          id="hotelName"
          required={hotelsData.length > 0 ? false : true}
          placeholder="Enter hotel name"
          className="custom-input w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={hotelFormData.name}
          onChange={(e) => {
            setHotelFormData((prev) => ({ ...prev, name: e.target.value }));
          }}
        />
      </div>

      <div className="w-full mb-4 sm:w-1/2">
        <label className="font-medium">Rating:</label>
        <CustomSelect
          isMulti={false}
          requiredField={false}
          placeholder="Select rating"
          value={[{ label: hotelFormData.rating, value: hotelFormData.rating }]}
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
      <div className="w-full mb-4 xl:w-1/2 xl:mb-2">
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
              hotelFormData.nights === 0 ? "" : hotelFormData.nights.toString()
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

      <div className="w-full mb-4 sm:w-1/2">
        <DynamicInputList
          initialItemList={hotelFormData.meals}
          label="Meals"
          onUpdateItemList={(newlistmeals) => {
            setHotelFormData((prev) => ({ ...prev, meals: newlistmeals }));
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

export default HotelComponent;
