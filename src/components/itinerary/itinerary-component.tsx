import { useGlobalStore } from "../../store/globalStore";
import CustomSelect, { OptionType } from "../common/CustomSelect";
import DynamicInputList from "../common/DynamicDataInput";

interface ItineraryComponentProps {
  dayIndex: number;
}

const ItineraryComponent: React.FC<ItineraryComponentProps> = ({
  dayIndex,
}) => {
  const store = useGlobalStore();
  const { general, itinerary, setItinerary } = store;
  const { daywiseItinerary } = itinerary;
  const itineraryDaywiseData = daywiseItinerary[dayIndex];
  const cityOptions = general.basicData.cities.map((city) => ({
    label: city,
    value: city,
  }));

  const handleCitySelection = (selectedCities: OptionType[]) => {
    const updatedItineraryData = [...daywiseItinerary];
    updatedItineraryData[dayIndex].cities = selectedCities.map(
      (cityOption) => cityOption.value
    );

    setItinerary("daywiseItinerary", updatedItineraryData);
  };

  return (
    <div className="w-full mb-4 border shadow-sm border-gray xl:w-1/2 xl:mb-2">
      <div className="flex items-center px-3 py-2 border-b bg-graydark dark:bg-graydark border-stroke dark:border-strokedark">
        <label className="block text-white dark:text-white">
          Day {dayIndex+1}
        </label>
      </div>
      <div className="py-6 px-6.5">
        <div className="mb-3">
          <label className="block text-black dark:text-white">City:</label>
          <CustomSelect
            isMulti={true}
            requiredField={true}
            placeholder="Select cities"
            options={cityOptions}
            onSelect={handleCitySelection}
            value={
              itineraryDaywiseData.cities?.map((city) => ({
                label: city,
                value: city,
              })) ?? []
            }
          />
        </div>
        <div className="mb-3">
          <label className="block text-black dark:text-white">
            Description:
          </label>
          <textarea
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="Enter description"
            value={itineraryDaywiseData.description ?? ""}
            onChange={(e) => {
              const updatedItineraryData = [...daywiseItinerary];
              updatedItineraryData[dayIndex].description = e.target.value;

              setItinerary("daywiseItinerary", updatedItineraryData);
            }}
          />
        </div>
        <div className="mb-3">
          <DynamicInputList
            initialItemList={itineraryDaywiseData.meals ?? []}
            label="Meals"
            onUpdateItemList={(newItemList) => {
              const updatedItineraryData = [...daywiseItinerary];
              updatedItineraryData[dayIndex].meals = newItemList;

              setItinerary("daywiseItinerary", updatedItineraryData);
            }}
          />
        </div>
        <div className="mb-3">
          <DynamicInputList
            initialItemList={itineraryDaywiseData.inclusions ?? []}
            label="Inclusions"
            onUpdateItemList={(newItemList) => {
              const updatedItineraryData = [...daywiseItinerary];
              updatedItineraryData[dayIndex].inclusions = newItemList;

              setItinerary("daywiseItinerary", updatedItineraryData);
            }}
          />
        </div>
        <div className="mb-3">
          <DynamicInputList
            initialItemList={itineraryDaywiseData.exclusions ?? []}
            label="Exclusions"
            onUpdateItemList={(newItemList) => {
              const updatedItineraryData = [...daywiseItinerary];
              updatedItineraryData[dayIndex].exclusions = newItemList;

              setItinerary("daywiseItinerary", updatedItineraryData);
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default ItineraryComponent;
