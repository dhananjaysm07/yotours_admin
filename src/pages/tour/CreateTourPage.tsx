import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TOUR_MUTATION } from "../../graphql/mutations";
import {
  GET_DESTINATIONS_QUERY,
  GET_TAGS_QUERY,
  GET_TOURS_QUERY,
} from "../../graphql/query";
import { Tag } from "../../components/settings/create-tag";
import { Destination } from "../../components/destination/destination-card";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../utils/firebase";
import { Tour } from "./AllToursPage";
import { useNavigate } from "react-router";
import { ErrorModal } from "../../components/common/ErrorModal";

type GetToursQueryResponse = {
  getTours: Tour[];
};

const CreateTourPage = () => {
  const [tourTitle, setTourTitle] = useState("");
  const [tourPrice, setTourPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [tourLocation, setTourLocation] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [tagId, setTagId] = useState("");

  const [tourHyperlink, setTourHyperlink] = useState("");
  const [tourBokunId, setTourBokunId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  const defaultImg =
    "https://firebasestorage.googleapis.com/v0/b/marketingform-d32c3.appspot.com/o/bannerImages%2Fbackground.png?alt=media&token=4c357a20-703d-41df-a5e0-b1f1a585a4a1";
  const [tourImage, setTourImage] = useState("");
  const [createTour, { data, loading, error }] = useMutation(
    CREATE_TOUR_MUTATION,
    {
      update(cache, { data: { createTour } }) {
        // Retrieve the current tour list from the cache
        const existingTours = cache.readQuery<GetToursQueryResponse>({
          query: GET_TOURS_QUERY,
        });

        // Add the new tour to the list
        const newTours = existingTours
          ? [...existingTours.getTours, createTour]
          : [createTour];

        // Write the updated list back to the cache
        cache.writeQuery({
          query: GET_TOURS_QUERY,
          data: { getTours: newTours },
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
    setIsSubmitting(true);
    try {
      const response = await createTour({
        variables: {
          createTourInput: {
            tourTitle: tourTitle,
            price: tourPrice,
            location: tourLocation,
            currency: currency,
            imageUrls: [tourImage || defaultImg],
            tourHyperlink: tourHyperlink,
            destinationId: destinationId,
            tagId: tagId, // This is the tag ID selected from the dropdown
            tourBokunId: tourBokunId,
          },
        },
      });
      // Handle success (e.g., clear form, display message, etc.)
      if (response.data.createTour) {
        navigate("/alltours"); // Replace '/all-tours' with the actual path to your tours page
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

    const storageRef = ref(storage, `bannerImages/${file.name}`);
    try {
      setIsUploading(true);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setTourImage(downloadURL);
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
          Tour Details
        </h3>
      </div>
      <div className="p-6.5">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="tourTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Tour Title
            </label>
            <input
              type="text"
              id="tourTitle"
              value={tourTitle}
              onChange={(e) => setTourTitle(e.target.value)}
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
              htmlFor="tourLocation"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Tour Location
            </label>
            <input
              type="text"
              id="tourLocation"
              value={tourLocation}
              onChange={(e) => setTourLocation(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="tourPrice"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Tour Price
            </label>
            <input
              type="text"
              id="tourPrice"
              value={tourPrice}
              onChange={(e) => setTourPrice(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
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
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
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
              htmlFor="bokunId"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Tour Bokun ID
            </label>
            <input
              type="text"
              id="bokunId"
              value={tourBokunId}
              onChange={(e) => setTourBokunId(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="toutTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Tour Hyperlink
            </label>
            <input
              type="text"
              id="tourTitle"
              value={tourHyperlink}
              onChange={(e) => setTourHyperlink(e.target.value)}
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
            {tourImage && (
              <div className="flex justify-center w-full">
                <img
                  src={tourImage}
                  alt="Banner"
                  className="object-cover h-40 rounded-md shadow-md"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="flex justify-center px-4 py-2 font-medium text-white rounded-lg bg-primary"
            disabled={loading}
          >
            {isSubmitting ? "Creating..." : "Create Tour"}
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

export default CreateTourPage;
