import React, { useEffect, useState, useCallback } from "react";
import CustomSelect, { OptionType } from "../common/CustomSelect";
import { useGlobalStore } from "../../store/globalStore";
// interface BasicDetailsSectionProps {
//   basicData: BasicData;
// }

type City = string;

interface Destination {
  name: string;
  cities: City[];
}

interface JsonData {
  destinations: Destination[];
}

const jsonData: JsonData = {
  destinations: [
    {
      name: "USA",
      cities: ["New York", "Los Angeles", "Chicago"],
    },
    {
      name: "69790710-08f4-4ffb-9c72-0759af333f8d",
      cities: ["9acbc8f6-1ae5-4b2a-82b2-a820d0f6eab2", "Delhi", "Bangalore"],
    },
    {
      name: "Australia",
      cities: ["Sydney", "Melbourne", "Brisbane"],
    },
  ],
};

const BasicDetailsSection: React.FC = () => {
  const { general, setGeneral, errors } = useGlobalStore();
  const { basicData } = general;
  const [destinationOptions, setDestinationOptions] = useState<
    { value: string; label: string }[]
  >(
    jsonData.destinations.map((dest) => ({
      value: dest.name,
      label: dest.name,
    }))
  );
  const [cityOptions, setCityOptions] = useState<
    { value: City; label: City }[]
  >([]);
  const handleDestinationChange = (selectedDestinations: OptionType[]) => {
    // Update your global state or local state as needed
    // For instance, update the destinations in the global state:
    findCityOptions(selectedDestinations);
    const destinationValues = selectedDestinations.map(
      (option) => option.value
    );
    setGeneral("basicData", {
      destinations: destinationValues,
    });
  };
  const findCityOptions = useCallback(
    (selectedDestinations: OptionType[]) => {
      if (!jsonData || !jsonData.destinations) return;
      const allRelatedCities: string[] = [];

      selectedDestinations.forEach((selectedDestinationOption) => {
        const selectedDestination = jsonData.destinations.find(
          (dest) => dest.name === selectedDestinationOption.value
        );
        if (selectedDestination) {
          allRelatedCities.push(...selectedDestination.cities);
        }
      });

      // De-duplicate cities
      const uniqueCities = [...new Set(allRelatedCities)];

      const cityOptionValues = uniqueCities.map((city) => ({
        value: city,
        label: city,
      }));

      setCityOptions(cityOptionValues);
    },
    [jsonData]
  );
  const handleCitySelect = (selectedCities: OptionType[]) => {
    // Extract values from the selected options
    const selectedCityValues = selectedCities.map(
      (cityOption) => cityOption.value
    );
    setGeneral("basicData", {
      cities: selectedCityValues,
    });
  };

  useEffect(() => {
    findCityOptions(
      basicData.destinations.map((dest) => ({ value: dest, label: dest }))
    );
  }, [basicData.destinations]);
  return (
    <div className="mb-4.5 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b bg-gray-3 dark:bg-graydark  border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-semibold text-black dark:text-white ">
          Basic Details
        </h3>
      </div>
      <div className="p-6.5">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Product Title
            </label>
            <input
              required
              type="text"
              name="productTitle"
              value={basicData.title}
              onChange={(e) =>
                setGeneral("basicData", { title: e.target.value })
              }
              placeholder="Enter product title"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            {errors.basicData && errors.basicData.title && (
              <span className="text-danger">{errors.basicData.title}</span>
            )}
          </div>
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Product Type
            </label>
            <CustomSelect
              isMulti={false}
              requiredField={true}
              placeholder="Select product type"
              options={[
                { value: "private", label: "Private" },
                { value: "group", label: "Group" },
              ]}
              onSelect={(option) =>
                setGeneral("basicData", { type: option[0].value })
              }
              value={[{ value: basicData.type, label: basicData.type }]}
            />
          </div>
        </div>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Destinations
            </label>
            <CustomSelect
              isMulti={true}
              requiredField={true}
              placeholder="Select destinations"
              options={destinationOptions}
              onSelect={handleDestinationChange}
              value={basicData.destinations.map((dest) => ({
                value: dest,
                label: dest,
              }))}
            />
          </div>
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Cities
            </label>
            <CustomSelect
              isMulti={true}
              requiredField={true}
              placeholder="Select cities"
              options={cityOptions}
              onSelect={handleCitySelect}
              value={basicData.cities.map((city) => ({
                value: city,
                label: city,
              }))}
            />
          </div>
        </div>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Theme
            </label>
            <CustomSelect
              isMulti={true}
              requiredField={false}
              placeholder="Select theme(s)"
              options={[
                { value: "red", label: "Red" },
                { value: "green", label: "Green" },
                { value: "yellow", label: "Yellow" },
                { value: "blue", label: "Blue" },
                { value: "white", label: "White" },
              ]}
              value={basicData.themes.map((theme) => ({
                value: theme,
                label: theme,
              }))}
              onSelect={(options) => {
                const selectedThemeValues = options.map((theme) => theme.value);
                setGeneral("basicData", {
                  themes: selectedThemeValues,
                });
              }}
            />
          </div>
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Preferences
            </label>
            <CustomSelect
              isMulti={true}
              requiredField={false}
              value={basicData.preferences.map((pref) => ({
                value: pref,
                label: pref,
              }))}
              placeholder="Select preferences"
              options={[
                { value: "red", label: "Red" },
                { value: "green", label: "Green" },
                { value: "yellow", label: "Yellow" },
                { value: "blue", label: "Blue" },
                { value: "white", label: "White" },
              ]}
              onSelect={(options) => {
                const selectedPreferencesValues = options.map(
                  (pref) => pref.value
                );
                setGeneral("basicData", {
                  preferences: selectedPreferencesValues,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsSection;
