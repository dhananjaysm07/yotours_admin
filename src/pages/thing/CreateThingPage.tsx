import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_ATTRACTION_MUTATION,
  CREATE_THING_MUTATION,
} from "../../graphql/mutations";
import {
  GET_DESTINATIONS_QUERY,
  GET_TAGS_QUERY,
  GET_THINGS_QUERY,
  GET_TOURS_QUERY,
} from "../../graphql/query";
import { Tag } from "../../components/settings/create-tag";
import { Destination } from "../../components/destination/destination-card";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../utils/firebase";
import { Thing } from "./AllThingsPage";
import { useNavigate } from "react-router";
import { ErrorModal } from "../../components/common/ErrorModal";

type GetThingsQueryResponse = {
  getThings: Thing[];
};

const CreateThingPage = () => {
  const [thingTitle, setThingTitle] = useState("");
  const [thingDescription, setThingDescription] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [tagId, setTagId] = useState("");
  const [thingImage, setThingImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [thingHyperlink, setThingHyperlink] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();

  const [createThing, { data, loading, error }] = useMutation(
    CREATE_THING_MUTATION,
    {
      update(cache, { data: { createThing } }) {
        // Retrieve the current tour list from the cache
        const existingThings = cache.readQuery<GetThingsQueryResponse>({
          query: GET_THINGS_QUERY,
        });

        // Add the new tour to the list
        const newThings = existingThings
          ? [...existingThings.getThings, createThing]
          : [createThing];

        // Write the updated list back to the cache
        cache.writeQuery({
          query: GET_THINGS_QUERY,
          data: { getThings: newThings },
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
    setIsSubmitting(true); // Start loading

    try {
      const response = await createThing({
        variables: {
          createThingInput: {
            thingTitle: thingTitle,
            thingDescription: thingDescription,
            thingHyperlink: thingHyperlink,
            imageUrls: [thingImage],
            destinationId: destinationId,
            tagId: tagId, // This is the tag ID selected from the dropdown
          },
        },
      });
      if (response.data.createThing) {
        navigate("/allthings");
      } else {
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

    const storageRef = ref(storage, `thingImages/${file.name}`);
    try {
      setIsUploading(true);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setThingImage(downloadURL);
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
          Thing Details
        </h3>
      </div>
      <div className="p-6.5">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="thingTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="thingTitle"
              value={thingTitle}
              onChange={(e) => setThingTitle(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="thingTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Description
            </label>
            <input
              type="text"
              id="thingDescription"
              value={thingDescription}
              onChange={(e) => setThingDescription(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="destination"
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
              htmlFor="thingHyperlink"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Thing Hyperlink
            </label>
            <input
              type="text"
              id="thingHyperlink"
              value={thingHyperlink}
              onChange={(e) => setThingHyperlink(e.target.value)}
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
            {thingImage && (
              <div className="flex justify-center w-full">
                <img
                  src={thingImage}
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
            {isSubmitting ? "Creating..." : "Create Thing"}
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

export default CreateThingPage;
