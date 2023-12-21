import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ATTRACTION_MUTATION } from "../../graphql/mutations";
import {
  GET_ATTRACTIONS_QUERY,
  GET_DESTINATIONS_QUERY,
  GET_TAGS_QUERY,
  GET_TOURS_QUERY,
} from "../../graphql/query";
import { Tag } from "../../components/settings/create-tag";
import { Destination } from "../../components/destination/destination-card";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../utils/firebase";
import { Attraction } from "./AllAttractionsPage";
import { useNavigate } from "react-router";
import { ErrorModal } from "../../components/common/ErrorModal";

type GetAttractionsQueryResponse = {
  getAttractions: Attraction[];
};

const CreateAttractionPage = () => {
  const [attractionTitle, setAttractionTitle] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [attractionLocation, setAttractionLocation] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [tagId, setTagId] = useState("");
  const [attractionBokunId, setAttractionBokunId] = useState("");
  const [attractionImage, setAttractionImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [attractionHyperlink, setAttractionHyperlink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const [createAttraction, { data, loading, error }] = useMutation(
    CREATE_ATTRACTION_MUTATION,
    {
      update(cache, { data: { createAttraction } }) {
        // Retrieve the current tour list from the cache
        const existingAttractions =
          cache.readQuery<GetAttractionsQueryResponse>({
            query: GET_TOURS_QUERY,
          });

        // Add the new tour to the list
        const newAttractions = existingAttractions
          ? [...existingAttractions.getAttractions, createAttraction]
          : [createAttraction];

        // Write the updated list back to the cache
        cache.writeQuery({
          query: GET_ATTRACTIONS_QUERY,
          data: { getTours: newAttractions },
        });
      },
    }
  );

  //Destinations
  const {
    loading: destinationsLoading,
    error: destinationsError,
    data: destinationsData,
  } = useQuery(GET_DESTINATIONS_QUERY);
  //TAGS
  const {
    loading: tagsLoading,
    error: tagsError,
    data: tagsData,
  } = useQuery(GET_TAGS_QUERY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createAttraction({
        variables: {
          createAttractionInput: {
            attractionTitle: attractionTitle,
            price: price,
            currency: currency,
            location: attractionLocation,
            imageUrls: [attractionImage],
            destinationId: destinationId,
            attractionBokunId: attractionBokunId,
            tagId: tagId, // This is the tag ID selected from the dropdown
          },
        },
      });
      // Handle success (e.g., clear form, display message, etc.)
      if (response.data.createAttraction) {
        navigate("/allattractions"); // Replace '/all-tours' with the actual path to your tours page
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

  useEffect(() => {
    if (tagsData) {
      // Handle fetched tags, perhaps format them if needed, or set them directly in state
    }
  }, [tagsData]);

  // Firebase storage logic
  const storage = getStorage(app);

  const handleBannerUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    const storageRef = ref(storage, `attractionImages/${file.name}`);
    try {
      setIsUploading(true);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setAttractionImage(downloadURL);
    } catch (error) {
      console.error("Error uploading banner image", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-4.5 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b bg-gray-3 dark:bg-graydark  border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-semibold text-black dark:text-white ">
          Attraction Details
        </h3>
      </div>
      <div className="p-6.5">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="attractionTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Attraction Title
            </label>
            <input
              type="text"
              id="attractionTitle"
              value={attractionTitle}
              onChange={(e) => setAttractionTitle(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="continent"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Select Destination
            </label>
            <select
              id="destination"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
              disabled={destinationsLoading}
            >
              <option value="">Select a destination</option>
              {destinationsData?.getDestinations.map((item: Destination) => (
                <option key={item.id} value={item.id}>
                  {item.destinationName}
                </option>
              ))}
            </select>
            {destinationsError && (
              <p className="text-xs italic text-red-500">
                {destinationsError.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="attractionTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Attraction Location
            </label>
            <input
              type="text"
              id="destinationDescription"
              value={attractionLocation}
              onChange={(e) => setAttractionLocation(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="currency"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Currency
            </label>
            <select
              id="currency"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              onChange={(e) => setCurrency(e.target.value)} // Assuming you have a state setter function for currency
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
              <option value="CHF">CHF</option>
              <option value="CNY">CNY</option>
              <option value="SEK">SEK</option>
              <option value="NZD">NZD</option>
              // Add more currencies as needed
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="attractionTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Price
            </label>
            <input
              type="text"
              id="destinationDescription"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="tagId"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Tag
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
              htmlFor="attractionBokunId"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Attraction Bokun ID
            </label>
            <input
              type="text"
              id="attractionBokunId"
              value={attractionBokunId}
              onChange={(e) => setAttractionBokunId(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="toutTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Attraction Hyperlink
            </label>
            <input
              type="text"
              id="tourTitle"
              value={attractionHyperlink}
              onChange={(e) => setAttractionHyperlink(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <label className="flex items-center justify-center w-24 h-24 border-2 border-gray-400 border-dashed cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleBannerUpload}
                  accept="image/*"
                />
                <div className="text-4xl text-gray-500">+</div>
              </label>
              {isUploading && (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-t-2 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
                  <span className="text-sm text-gray-500">Uploading...</span>
                </div>
              )}
            </div>
            {attractionImage && (
              <div className="flex justify-center w-full">
                <img
                  src={attractionImage}
                  alt="Banner"
                  className="object-cover h-40 rounded-md shadow-md"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 font-bold text-white rounded bg-meta-5 hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {isSubmitting ? "Creating..." : "Create Attraction"}
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

export default CreateAttractionPage;
