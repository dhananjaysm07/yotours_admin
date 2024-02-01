import React, { ChangeEvent, useEffect, useState } from "react";
import { QueryResult, useMutation, useQuery } from "@apollo/client";
import {
  CREATE_DESTINATION_MUTATION,
  UPDATE_DESTINATION_MUTATION,
} from "../../graphql/mutations";
import DestinationPhotos from "../../components/settings/destination-photos";
import DestinationBanner from "../../components/settings/destination-banner";
import {
  GET_DESTINATIONS_QUERY,
  GET_SINGLE_DESTINATION,
  GET_TAGS_QUERY,
} from "../../graphql/query";
import { Tag } from "../../components/settings/create-tag";
import { Destination } from "../../components/destination/destination-card";
import { Country, countryData } from "../../utils/countries";
import { useDataStore } from "../../store/store";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../utils/firebase";
import { ErrorModal } from "../../components/common/ErrorModal";
import { useNavigate, useParams } from "react-router";
import { BestTime, DateInput } from "./CreateDestinationPage";
import TncComponent from "../../components/general/tnc-input-component";
import { priorityList } from "../../utils/role";
import { Thing } from "../thing/AllThingsPage";

type GetDestinationsQueryResponse = {
  getDestinations: Destination[]; // Assuming `Tag` is the type of your tags
};

const EditDestinationPage = () => {
  const { selectedDestination, setSelectedDestination } = useDataStore();
  const { destinationId } = useParams();
  const {
    data: destinationData,
    loading: destinationLoading,
    error: destinationError,
  }: QueryResult = useQuery(GET_SINGLE_DESTINATION, {
    variables: { getDestinationId: destinationId },
  });

  const defaultImg =
    "https://firebasestorage.googleapis.com/v0/b/marketingform-d32c3.appspot.com/o/bannerImages%2Fbackground.png?alt=media&token=4c357a20-703d-41df-a5e0-b1f1a585a4a1";
  const imageArray: string[] = selectedDestination?.images?.map(
    (el) => el.imageUrl
  );
  console.log("selected destination", selectedDestination);
  const [destinationName, setDestinationName] = useState(
    selectedDestination?.destinationName || ""
  );
  const [bannerImage, setBannerImage] = useState(
    selectedDestination?.bannerImage || defaultImg
  );
  const [bannerHeading, setBannerHeading] = useState(
    selectedDestination?.bannerHeading || ""
  );
  const [description, setDescription] = useState(
    selectedDestination?.description || ""
  );
  const [imageUrls, setImageUrls] = useState<string[]>(imageArray);
  // console.log(imageUrls);
  // selectedDestination.images
  const [tagId, setTagId] = useState(selectedDestination?.tag?.id || "");
  const [priority, setPriority] = useState<number | null>(
    selectedDestination?.priority || null
  );
  const [selectedContinent, setSelectedContinent] = useState<string>(
    selectedDestination?.continent || ""
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    selectedDestination?.country || ""
  );
  const [countries, setCountries] = useState<Country[]>([]);
  const [isPopular, setIsPopular] = useState(selectedDestination?.isPopular);
  const [introduction, setIntroduction] = useState(
    selectedDestination.introduction
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(!selectedDestination.id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const [bestTime, setBestTime] = useState<BestTime>({
    fromDate: selectedDestination.fromDate || "",
    toDate: selectedDestination.toDate || "",
  });
  const [fromOccasion, setFromOccasion] = useState(
    selectedDestination.fromOccasion || ""
  );
  const [toOccasion, setToOccasion] = useState(
    selectedDestination.toOccasion || ""
  );
  React.useEffect(() => {
    if (destinationData)
      setSelectedDestination(destinationData?.getDestination);
    setDestinationName(destinationData?.getDestination?.destinationName || "");
    setBannerImage(destinationData?.getDestination?.bannerImage || defaultImg);
    setToOccasion(destinationData?.getDestination.toOccasion || "");
    setFromOccasion(destinationData?.getDestination.fromOccasion || "");
    setBestTime({
      fromDate: destinationData?.getDestination.fromDate || "",
      toDate: destinationData?.getDestination.toDate || "",
    });
    setIsLoading(!destinationData?.getDestination.id);
    setIntroduction(destinationData?.getDestination.introduction);
    setIsPopular(destinationData?.getDestination?.isPopular);
    setSelectedCountry(destinationData?.getDestination?.country || "");
    setSelectedContinent(destinationData?.getDestination?.continent || "");
    setPriority(destinationData?.getDestination?.priority || null);
    setTagId(destinationData?.getDestination?.tag?.id || "");
    setImageUrls(imageArray);
    setDescription(destinationData?.getDestination?.description || "");
    setBannerHeading(destinationData?.getDestination?.bannerHeading || "");
  }, [destinationData]);
  useEffect(() => {
    // If selectedTour changes and has an id, we're no longer loading
    if (selectedDestination.id) {
      setIsLoading(false);
    }
  }, [selectedDestination]);

  useEffect(() => {
    setSelectedContinent(selectedDestination?.continent || "");
  }, [selectedDestination]);
  useEffect(() => {
    if (selectedContinent) {
      const continentCountries =
        countryData.find((c) => c.continent === selectedContinent)?.countries ||
        [];
      setCountries(continentCountries);

      // If the selected country does not exist in the new list of countries, reset it
      if (
        !continentCountries.some((country) => country.name === selectedCountry)
      ) {
        setSelectedCountry("");
      }
    }
  }, [selectedContinent, countryData]);
  // Initialize destinationId when destinationsData is loaded or when the selected tour changes

  const [updateDestination, { data, loading, error }] = useMutation(
    UPDATE_DESTINATION_MUTATION,
    {
      update(cache, { data: { updateDestination } }) {
        // Retrieve the current destination list from the cache
        const existingDestinations =
          cache.readQuery<GetDestinationsQueryResponse>({
            query: GET_DESTINATIONS_QUERY,
          });

        if (existingDestinations) {
          // Find the index of the dest that was updated
          const updatedDestinationIndex =
            existingDestinations.getDestinations.findIndex(
              (destination) => destination.id === updateDestination.id
            );

          if (updatedDestinationIndex > -1) {
            // Replace the old dest with the updated one
            const updatedDestinations = [
              ...existingDestinations.getDestinations.slice(
                0,
                updatedDestinationIndex
              ),
              updateDestination,
              ...existingDestinations.getDestinations.slice(
                updatedDestinationIndex + 1
              ),
            ];

            // Write the updated list back to the cache
            cache.writeQuery({
              query: GET_DESTINATIONS_QUERY,
              data: { getDestinations: updatedDestinations },
            });
          }
        }
      },
      refetchQueries: [
        GET_DESTINATIONS_QUERY, // You can also use { query: GET_ATTRACTIONS_QUERY } for more options
      ],
    }
  );

  const {
    loading: tagsLoading,
    error: tagsError,
    data: tagsData,
  } = useQuery(GET_TAGS_QUERY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading

    try {
      const response = await updateDestination({
        variables: {
          updateDestinationInput: {
            destinationId: selectedDestination.id,
            destinationName: destinationName,
            country: selectedCountry,
            continent: selectedContinent,
            isPopular: isPopular,
            bannerImage: bannerImage || defaultImg,
            bannerHeading: bannerHeading,
            description: description,
            imageUrls: imageUrls,
            tagId: tagId,
            fromDate: bestTime.fromDate,
            toDate: bestTime.toDate,
            fromOccasion: fromOccasion,
            toOccasion: toOccasion,
            introduction: introduction,
            priority: priority || 1,
          },
        },
      });
      console.log(response);
      // Check if the mutation was successful
      if (response.data.updateDestination) {
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
      // console.log("handle change", imageUrls);
      // Only append new unique URLs to the state
      return [...currentUrls, ...newUniqueUrls];
    });
  };

  // useEffect(() => {
  //   if (tagsData) {
  //     // Handle fetched tags, perhaps format them if needed, or set them directly in state
  //   }
  // }, [tagsData]);

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

  const storage = getStorage(app);

  const handleBannerUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    const storageRef = ref(storage, `bannerImages/${file.name}`);
    try {
      setIsUploading(true);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setBannerImage(downloadURL);
    } catch (error) {
      console.error("Error uploading banner image", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    setBannerHeading(newTitle);
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
  if (destinationLoading) {
    return <div>Loading...</div>; // Put your loading spinner or message here
  }

  if (destinationError) {
    return <div>Error Loading</div>; // Put your loading spinner or message here
  }
  if (isLoading) {
    return <div>Loading...</div>; // Put your loading spinner or message here
  }
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
              required
            />
          </div>
          <div className="mb-4">
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
          </div>
          <div className="mb-4">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter banner title..."
                value={bannerHeading}
                onChange={handleTitleChange}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <div className="flex items-center space-x-2">
                {bannerImage && (
                  <div className="relative flex justify-center w-full">
                    <img
                      src={bannerImage}
                      alt="Tour"
                      className="object-cover h-40 rounded-md shadow-md"
                    />
                    <label
                      htmlFor="file-upload"
                      className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 cursor-pointer"
                    >
                      Change Banner
                    </label>
                  </div>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleBannerUpload}
                  accept="image/*"
                />
                {isUploading && (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-t-2 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </div>
                )}
              </div>
            </div>
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
            setText={setIntroduction}
            text={introduction}
            heading="Introduction"
          />
          <div>
            <DestinationPhotos onPhotosChange={handlePhotosChange} />
          </div>
          <button
            type="submit"
            className="flex justify-center px-4 py-2 font-medium text-white rounded-lg bg-primary"
            disabled={loading}
          >
            {isSubmitting ? "Updating..." : "Update Destination"}
          </button>
          {error && (
            <p className="text-xs italic text-red-500">{error.message}</p>
          )}
        </form>
      </div>
      <div className="p-6.5 flex flex-col">
        <h1 className=" text-xl font-semibold">
          Tours ({destinationLoading || selectedDestination?.tours?.length})
        </h1>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {selectedDestination?.tours?.map((tour: any) => (
            <div
              onClick={() => navigate(`/edittour/${tour.id}`)}
              key={tour?.id}
              className="max-w-sm overflow-hidden transition duration-500 transform rounded shadow-lg hover:cursor-pointer hover:scale-105 relative"
            >
              <div className="absolute z-10 py-2 px-4 bg-black rounded-lg">
                <p>{tour.active ? "Active" : "Inactive"}</p>
              </div>
              <div className="relative group">
                <img
                  className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110"
                  src={tour?.images[0].imageUrl || ""}
                  alt={tour?.tourTitle}
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white  duration-500 ease-in-out bg-black  bg-opacity-60 ">
                  {tour?.location}
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-base text-gray-700">{tour?.tourTitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6.5 flex flex-col">
        <h1 className=" text-xl font-semibold">
          Attractions (
          {destinationLoading || selectedDestination?.attractions?.length})
        </h1>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {selectedDestination?.attractions?.map((attraction: any) => (
            <div
              key={attraction.id}
              onClick={() => navigate(`/editattraction/${attraction.id}`)}
              className="max-w-sm overflow-hidden transition duration-500 transform rounded shadow-lg hover:cursor-pointer hover:scale-105 relative"
            >
              <div className="absolute z-10 py-2 px-4 bg-black rounded-lg">
                <p>{attraction.active ? "Active" : "Inactive"}</p>
              </div>
              <div className="relative group">
                <img
                  className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110"
                  src={attraction.images[0].imageUrl}
                  alt={attraction.attractionTitle}
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white transition-opacity duration-500 ease-in-out bg-black  bg-opacity-60 group-hover:opacity-100">
                  {attraction.location}
                </div>
              </div>
              <div className="px-6 py-4">
                <p className="text-base text-gray-700">
                  {attraction.attractionTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6.5 flex flex-col">
        <h1 className=" text-xl font-semibold">
          Things ({destinationLoading || selectedDestination?.things?.length})
        </h1>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {selectedDestination?.things?.map((thing: any) => (
            <>
              <div
                key={thing.id}
                onClick={() => navigate(`/editThing/${thing.id}`)}
                className="max-w-sm overflow-hidden transition duration-500 transform rounded shadow-lg hover:cursor-pointer hover:scale-105 relative"
              >
                <div className="absolute z-10 py-2 px-4 bg-black rounded-lg">
                  <p>{thing.active ? "Active" : "Inactive"}</p>
                </div>
                <div className="relative group">
                  <img
                    className="object-cover w-full h-48 transition-transform duration-500 ease-in-out group-hover:scale-110"
                    src={thing.images[0].imageUrl}
                    alt={thing.thingTitle}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-lg font-bold text-white transition-opacity duration-500 ease-in-out bg-black opacity-0 bg-opacity-60 group-hover:opacity-100">
                    {thing.destination?.destinationName}
                  </div>
                </div>
                <div className="px-6 py-4">
                  <p className="text-base text-gray-700">{thing.thingTitle}</p>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      {showErrorModal && <ErrorModal setErrorModalOpen={setShowErrorModal} />}
    </div>
  );
};

export default EditDestinationPage;
