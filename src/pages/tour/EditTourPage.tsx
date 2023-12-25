import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  UPDATE_TOUR_MUTATION,
  DELETE_TOUR_MUTATION,
} from "../../graphql/mutations";
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
import { useDataStore } from "../../store/store";
import { useNavigate } from "react-router";
import { ErrorModal } from "../../components/common/ErrorModal";

type GetToursQueryResponse = {
  getTours: Tour[];
};

const EditTourPage = () => {
  const { selectedTour } = useDataStore();
  const defaultImg =
    "https://firebasestorage.googleapis.com/v0/b/marketingform-d32c3.appspot.com/o/bannerImages%2Fbackground.png?alt=media&token=4c357a20-703d-41df-a5e0-b1f1a585a4a1";
  const navigate = useNavigate();
  const [tourTitle, setTourTitle] = useState(selectedTour?.tourTitle || "");
  const [tourPrice, setTourPrice] = useState(selectedTour?.price || "");
  //add currency state
  const [currency, setCurrency] = useState(selectedTour?.currency || "");
  const [tourLocation, setTourLocation] = useState(
    selectedTour?.location || ""
  );
  const [destinationId, setDestinationId] = useState(
    selectedTour?.destination?.id || ""
  );
  const [tourImage, setTourImage] = useState(
    selectedTour?.images?.[0]?.imageUrl || defaultImg
  );
  const [tagId, setTagId] = useState(selectedTour?.tag?.id || "");
  const [tourHyperlink, setTourHyperlink] = useState(
    selectedTour?.tourHyperlink || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(!selectedTour.id);
  const [tourBokunId, setTourBokunId] = useState(
    selectedTour?.tourBokunId || ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // const navigate = useNavigate();

  useEffect(() => {
    // If selectedTour changes and has an id, we're no longer loading
    if (selectedTour.id) {
      setIsLoading(false);
    }
  }, [selectedTour]);
  // Initialize destinationId when destinationsData is loaded or when the selected tour changes

  if (isLoading) {
    return <div>Loading...</div>; // Put your loading spinner or message here
  }

  const [updateTour, { data, loading, error }] = useMutation(
    UPDATE_TOUR_MUTATION,
    {
      update(cache, { data: { updateTour } }) {
        // Retrieve the current tour list from the cache
        const existingTours = cache.readQuery<GetToursQueryResponse>({
          query: GET_TOURS_QUERY,
        });

        if (existingTours) {
          // Find the index of the tour that was updated
          const updatedTourIndex = existingTours.getTours.findIndex(
            (tour) => tour.id === updateTour.id
          );

          if (updatedTourIndex > -1) {
            // Replace the old tour with the updated one
            const updatedTours = [
              ...existingTours.getTours.slice(0, updatedTourIndex),
              updateTour,
              ...existingTours.getTours.slice(updatedTourIndex + 1),
            ];

            // Write the updated list back to the cache
            cache.writeQuery({
              query: GET_TOURS_QUERY,
              data: { getTours: updatedTours },
            });
          }
        }
      },
      refetchQueries: [
        GET_TOURS_QUERY, // You can also use { query: GET_ATTRACTIONS_QUERY } for more options
      ],
    }
  );
  const [deleteTour] = useMutation(DELETE_TOUR_MUTATION, {
    update(cache, { data: { deleteTour } }) {
      // Retrieve the current tour list from the cache
      const existingTours = cache.readQuery<GetToursQueryResponse>({
        query: GET_TOURS_QUERY,
      });

      if (existingTours) {
        // Filter out the deleted tour from the list
        const updatedTours = existingTours.getTours.filter(
          (tour) => tour.id !== deleteTour.id
        );

        // Write the updated list back to the cache
        cache.writeQuery({
          query: GET_TOURS_QUERY,
          data: { getTours: updatedTours },
        });
      }
    },
    refetchQueries: [
      GET_TOURS_QUERY, // You can also use { query: GET_ATTRACTIONS_QUERY } for more options
    ],
  });

  const handleDeleteTour = async () => {
    console.log("ffunction called");
    try {
      // Call the deleteTour mutation
      const res = await deleteTour({
        variables: {
          deleteTourId: selectedTour.id,
        },
      });
      console.log("respone", res);
      if (res?.data?.deleteTour?.id) {
        navigate("../../alltours");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

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
    setIsSubmitting(true); // Start loading

    try {
      const response = await updateTour({
        variables: {
          updateTourInput: {
            tourId: selectedTour.id,
            tourTitle: tourTitle,
            price: tourPrice,
            currency: currency,
            location: tourLocation,
            tourHyperlink: tourHyperlink,
            tourBokunId: tourBokunId,
            imageUrls: [tourImage],
            destinationId: destinationId,
            tagId: tagId, // This is the tag ID selected from the dropdown
          },
        },
      });
      // Check if the mutation was successful
      if (response.data.updateTour) {
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
      <div className="border-b bg-gray-3 dark:bg-graydark  border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center ">
        <h3 className="font-semibold text-black dark:text-white ">
          Tour Details
        </h3>
        <button
          type="submit"
          className="flex justify-center px-4 py-2 font-medium text-white rounded-lg bg-primary"
          onClick={handleDeleteTour}
        >
          Delete
        </button>
      </div>
      <div className="p-6.5">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="toutTitle"
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
                <option
                  key={item.id}
                  value={item.id}
                  // selected={item.id === destinationId}
                >
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
              htmlFor="tourTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Tour Location
            </label>
            <input
              type="text"
              id="destinationDescription"
              value={tourLocation}
              onChange={(e) => setTourLocation(e.target.value)}
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
              value={currency}
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
              htmlFor="tourTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Tour Price
            </label>
            <input
              type="text"
              id="destinationDescription"
              value={tourPrice}
              onChange={(e) => setTourPrice(e.target.value)}
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
              {tourImage && (
                <div className="relative flex justify-center w-full">
                  <img
                    src={tourImage}
                    alt="Tour"
                    className="object-cover h-40 rounded-md shadow-md"
                  />
                  <label
                    htmlFor="file-upload"
                    className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 cursor-pointer"
                  >
                    Change
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

          <button
            type="submit"
            className="flex justify-center px-4 py-2 font-medium text-white rounded-lg bg-primary"
            disabled={loading}
          >
            {isSubmitting ? "Updating..." : "Update Tour"}
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

export default EditTourPage;
