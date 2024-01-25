import React, { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_DESTINATION_MUTATION } from "../../graphql/mutations";
import DestinationPhotos from "../../components/settings/destination-photos";
import DestinationBanner from "../../components/settings/destination-banner";
import { GET_DESTINATIONS_QUERY, GET_TAGS_QUERY } from "../../graphql/query";
import { Tag } from "../../components/settings/create-tag";
import { Destination } from "../../components/destination/destination-card";
import { Country, countryData } from "../../utils/countries";
import { useNavigate } from "react-router";
import { ErrorModal } from "../../components/common/ErrorModal";
import TncComponent from "../../components/general/tnc-input-component";
import { priorityList } from "../../utils/role";

export type BestTime = {
  fromDate: string;
  toDate: string;
};
type GetDestinationsQueryResponse = {
  getDestinations: Destination[]; // Assuming `Tag` is the type of your tags
};

const CreateDestinationPage = () => {
  const defaultImg =
    "https://firebasestorage.googleapis.com/v0/b/marketingform-d32c3.appspot.com/o/bannerImages%2Fbackground.png?alt=media&token=4c357a20-703d-41df-a5e0-b1f1a585a4a1";

  const navigate = useNavigate();
  const [destinationName, setDestinationName] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerHeading, setBannerHeading] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [tagId, setTagId] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [bannerData, setBannerData] = useState({
    image: "",
    title: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priority, setPriority] = useState<number | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [bestTime, setBestTime] = useState<BestTime>({
    fromDate: "",
    toDate: "",
  });
  const [fromOccasion, setFromOccasion] = useState("");
  const [toOccasion, setToOccasion] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [createDestination, { data, loading, error }] = useMutation(
    CREATE_DESTINATION_MUTATION,
    {
      update(cache, { data: { createDestination } }) {
        // Retrieve the current destination list from the cache
        const existingDestinations =
          cache.readQuery<GetDestinationsQueryResponse>({
            query: GET_DESTINATIONS_QUERY,
          });

        // Add the new destination to the list
        const newDestinations = existingDestinations
          ? [...existingDestinations.getDestinations, createDestination]
          : [createDestination];

        // Write the updated list back to the cache
        cache.writeQuery({
          query: GET_DESTINATIONS_QUERY,
          data: { getDestinations: newDestinations },
        });
      },
    }
  );

  const {
    loading: tagsLoading,
    error: tagsError,
    data: tagsData,
  } = useQuery(GET_TAGS_QUERY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bannerImageToUse = bannerData.image || bannerImage;
    const bannerHeadingToUse = bannerData.title || bannerHeading;
    try {
      const response = await createDestination({
        variables: {
          createDestinationInput: {
            destinationName: destinationName,
            continent: selectedContinent,
            country: selectedCountry,
            bannerImage: bannerImageToUse,
            bannerHeading: bannerHeadingToUse,
            isPopular: isPopular,
            description: description,
            imageUrls: imageUrls.length ? imageUrls : [defaultImg],
            tagId: tagId, // This is the tag ID selected from the dropdown
            fromDate: bestTime.fromDate,
            toDate: bestTime.toDate,
            fromOccasion: fromOccasion,
            toOccasion: toOccasion,
            introduction: introduction,
            priority: priority || 1,
          },
        },
      });

      // Handle success (e.g., clear form, display message, etc.)
      if (response.data.createDestination) {
        navigate("/alldestinations"); // Replace '/all-tours' with the actual path to your tours page
      } else {
        // Handle no data from mutation
        setShowErrorModal(true);
      }
    } catch (err) {
      setShowErrorModal(true); // Show error modal
    } finally {
      setIsSubmitting(false); // End loading
    }
  };
  // In your parent component
  const handlePhotosChange = (
    newPhotos: Array<{ name: string; url: string }>
  ) => {
    setImageUrls((currentUrls) => {
      // Create a map of current URLs for quick lookup
      const urlMap = new Map(currentUrls.map((url) => [url, true]));

      // Filter out new photos that are already in the state
      const newUniqueUrls = newPhotos
        .map((photo) => photo.url)
        .filter((url) => !urlMap.has(url));

      // Only append new unique URLs to the state
      return [...currentUrls, ...newUniqueUrls];
    });
  };

  const handleBannerChange = (image: string, title: string) => {
    setBannerData({ image, title });
  };

  useEffect(() => {
    if (tagsData) {
      // Handle fetched tags, perhaps format them if needed, or set them directly in state
    }
  }, [tagsData]);

  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [countries, setCountries] = useState<Country[]>([]);

  // Handler for when the continent changes
  const handleContinentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const continent = e.target.value;
    setSelectedContinent(continent);

    // Update the countries based on the selected continent
    const continentData = countryData.find((c) => c.continent === continent);
    setCountries(continentData ? continentData.countries : []);
    setSelectedCountry(""); // Reset the selected country when the continent changes
  };

  // Handler for when the country changes
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  const handleDateChange = (
    field: keyof BestTime,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setBestTime((prevBestTime) => ({
      ...prevBestTime,
      [field]: e.target.value,
    }));
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    let month = (now.getMonth() + 1).toString();
    let day = now.getDate().toString();

    if (month.length === 1) {
      month = "0" + month; // Add leading zero if month is single digit
    }

    if (day.length === 1) {
      day = "0" + day; // Add leading zero if day is single digit
    }

    return `${year}-${month}-${day}`;
  };
  return (
    <div className="mb-4.5 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b bg-gray-3 dark:bg-graydark  border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-semibold text-black dark:text-white ">
          Destination Details
        </h3>
      </div>
      <div className="p-6.5">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="destinationName"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Destination Name
            </label>
            <input
              type="text"
              id="destinationName"
              value={destinationName}
              onChange={(e) => setDestinationName(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          {/* Continent dropdown */}
          <div className="mb-4">
            <label
              htmlFor="continent"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Continent
            </label>
            <select
              id="continent"
              value={selectedContinent}
              onChange={(e) => handleContinentChange(e)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="">Select a continent</option>
              {countryData.map((item, index) => (
                <option key={index} value={item.continent}>
                  {item.continent}
                </option>
              ))}
            </select>
          </div>

          {/* Country dropdown */}
          <div className="mb-4">
            <label
              htmlFor="country"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Country
            </label>
            <select
              id="country"
              value={selectedCountry}
              onChange={handleCountryChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              disabled={!selectedContinent}
              required
            >
              <option value="">Select a country</option>
              {countries.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="destinationName"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Destination Description
            </label>
            <input
              type="text"
              id="destinationDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="popular-destination"
              type="checkbox"
              checked={isPopular}
              onChange={() => setIsPopular(!isPopular)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="popular-destination"
              className="text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Is Destination Popular?
            </label>
          </div>
          <div className="mb-4">
            <DestinationBanner onBannerChange={handleBannerChange} />
          </div>
          <div className="mb-4">
            <label
              htmlFor="tagId"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Tags
            </label>
            <select
              id="tagId"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              disabled={tagsLoading}
            >
              <option value="">Select a tag (optional)</option>
              {tagsData?.getAllTags
                ?.filter((tag: Tag) => tag.active) // This will filter out inactive tags
                .map((tag: Tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
            </select>
            {tagsError && (
              <p className="text-xs italic text-red-500">{tagsError.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="priorityID"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Priority
            </label>
            <select
              id="prorityID"
              value={priority || ""}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              // disabled={tagsLoading}
            >
              <option value="">Select a priority (optional)</option>
              {Object.values(priorityList) // This will filter out inactive tags
                .map((el, index) => (
                  <option key={index} value={Object.keys(priorityList)[index]}>
                    {el}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="besttime"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Best time to visit
            </label>
            <DateInput
              required={false}
              label="From Date"
              value={bestTime.fromDate || ""}
              minDate={getCurrentDate()}
              onChange={(e) => handleDateChange("fromDate", e)}
            />
            <div className="mb-4">
              <label
                htmlFor="fromOccasion"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                From Occasion
              </label>
              <input
                type="text"
                id="fromOccasion"
                value={fromOccasion}
                onChange={(e) => setFromOccasion(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <DateInput
              required={false}
              label="To Date"
              value={bestTime.toDate || ""}
              minDate={getCurrentDate()}
              onChange={(e) => handleDateChange("toDate", e)}
            />
            <div className="mb-4">
              <label
                htmlFor="toOccasion"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                To Occasion
              </label>
              <input
                type="text"
                id="toOccasion"
                value={toOccasion}
                onChange={(e) => setToOccasion(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
          <TncComponent
            heading={"Introduction"}
            setText={setIntroduction}
            text={introduction}
          />
          <div>
            <DestinationPhotos onPhotosChange={handlePhotosChange} />
          </div>
          <button
            type="submit"
            className="px-4 py-2 font-bold text-white rounded bg-meta-5 hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {isSubmitting ? "Creating..." : "Create Destination"}
          </button>
          {error && (
            <p className="text-xs italic text-red-500">{error.message}</p>
          )}
        </form>
      </div>
      {showErrorModal && <ErrorModal setErrorModalOpen={setShowErrorModal} />}
    </div>
  );
};

export const DateInput = ({
  label,
  value,
  required,
  minDate,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  minDate: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label>{label}</label>
    <input
      type="date"
      required={required}
      value={value}
      min={minDate}
      className="custom-input-date w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      onChange={onChange}
    />
  </div>
);

export default CreateDestinationPage;
