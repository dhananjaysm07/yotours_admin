import React, { useEffect, useState } from "react";
import { QueryResult, useMutation, useQuery } from "@apollo/client";
import {
  UPDATE_THING_MUTATION,
  DELETE_THING_MUTATION,
  ACTIVATE_THING_MUTATION,
} from "../../graphql/mutations";
import {
  GET_DESTINATIONS_QUERY,
  GET_SINGLE_THING,
  GET_TAGS_QUERY,
  GET_THINGS_QUERY,
} from "../../graphql/query";
import { Tag } from "../../components/settings/create-tag";
import { Destination } from "../../components/destination/destination-card";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../utils/firebase";
import { Thing } from "./AllThingsPage";
import { useDataStore } from "../../store/store";
import { useNavigate, useParams } from "react-router";
import { ErrorModal } from "../../components/common/ErrorModal";
import { priorityList } from "../../utils/role";

type GetThingsQueryResponse = {
  getThings: Thing[];
};

const EditThingPage = () => {
  // const { selectedThing } = useDataStore();
  const { selectedThing, setSelectedThing } = useDataStore();
  const { thingId } = useParams();
  const {
    data: thingData,
    loading: thingLoading,
    error: thingError,
  }: QueryResult = useQuery(GET_SINGLE_THING, {
    variables: { getThingId: thingId },
  });

  const [thingTitle, setThingTitle] = useState(selectedThing?.thingTitle || "");
  const [thingDescription, setThingDescription] = useState(
    selectedThing?.thingDescription || ""
  );
  const [thingHyperlink, setThingHyperlink] = useState(
    selectedThing?.thingHyperlink || ""
  );
  const [destinationId, setDestinationId] = useState(
    selectedThing?.destination?.id || ""
  );
  const [tagId, setTagId] = useState(selectedThing?.tag?.id || "");
  const [thingImage, setThingImage] = useState(
    selectedThing?.images?.[0]?.imageUrl || ""
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(!selectedThing.id);
  const [priority, setPriority] = useState<number | null>(
    selectedThing?.priority || null
  );
  const [isActive, setIsActive] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (thingData) {
      setSelectedThing(thingData?.getThing);
      setIsLoading(false);
      setThingImage(thingData?.getThing?.images?.[0]?.imageUrl || "");
      setTagId(thingData?.getThing?.tag?.id || "");
      setDestinationId(thingData?.getThing?.destination?.id || "");
      setThingHyperlink(thingData?.getThing?.images?.[0]?.imageUrl || "");
      setThingDescription(thingData?.getThing?.thingDescription || "");
      setThingTitle(thingData?.getThing?.thingTitle || "");
      setIsActive(thingData?.getThing?.active || false);
      setPriority(thingData?.getThing?.priority || null);
    }
  }, [thingData]);

  const [updateThing, { data, loading, error }] = useMutation(
    UPDATE_THING_MUTATION,
    {
      update(cache, { data: { updateThing } }) {
        const existingThings = cache.readQuery<GetThingsQueryResponse>({
          query: GET_THINGS_QUERY,
        });

        if (existingThings) {
          // Find the index of the tour that was updated
          const updatedThingIndex = existingThings.getThings.findIndex(
            (thing) => thing.id === updateThing.id
          );

          if (updatedThingIndex > -1) {
            // Replace the old tour with the updated one
            const updatedThings = [
              ...existingThings.getThings.slice(0, updatedThingIndex),
              updateThing,
              ...existingThings.getThings.slice(updatedThingIndex + 1),
            ];

            // Write the updated list back to the cache
            cache.writeQuery({
              query: GET_THINGS_QUERY,
              data: { getThings: updatedThings },
            });
          }
        }
      },
      refetchQueries: [GET_THINGS_QUERY],
    }
  );

  //Destinations
  const {
    loading: destinationsLoading,
    error: destinationsError,
    data: destinationsData,
  } = useQuery(GET_DESTINATIONS_QUERY, {
    variables: {
      isTourActive: true, // Your variable value here
    },
  });
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
      const response = await updateThing({
        variables: {
          updateThingInput: {
            thingId: selectedThing.id,
            thingTitle: thingTitle,
            thingDescription: thingDescription,
            thingHyperlink: thingHyperlink,
            imageUrls: [thingImage],
            destinationId: destinationId,
            tagId: tagId, // This is the tag ID selected from the dropdown
            priority,
          },
        },
      });
      if (response.data.updateThing) {
        navigate("/allthings");
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
    const uniqueId =
      new Date().getTime() + "_" + Math.random().toString(36).slice(2, 11);

    // If thingTitle is available, use it in the file name, otherwise use the unique identifier
    const fileNamePrefix = thingTitle.trim()
      ? thingTitle.replace(/[^a-zA-Z0-9]/g, "_")
      : `thing_${uniqueId}`;
    const fileName = `${fileNamePrefix}_${file.name}`;
    const storageRef = ref(storage, `thingImages/${fileName}`);
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
  const [deleteThing] = useMutation(DELETE_THING_MUTATION, {
    update(cache, { data: { deleteThing } }) {
      // Retrieve the current tour list from the cache
      const existingTours = cache.readQuery<GetThingsQueryResponse>({
        query: GET_THINGS_QUERY,
      });

      if (existingTours) {
        // Filter out the deleted tour from the list
        const updatedThings = existingTours.getThings.filter(
          (tour) => tour.id !== deleteThing.id
        );

        // Write the updated list back to the cache
        cache.writeQuery({
          query: GET_THINGS_QUERY,
          data: { getThings: updatedThings },
        });
      }
    },
    refetchQueries: [
      GET_THINGS_QUERY, // You can also use { query: GET_ATTRACTIONS_QUERY } for more options
    ],
  });

  const [activateThing] = useMutation(ACTIVATE_THING_MUTATION, {
    update(cache, { data: { activateThing } }) {
      // Retrieve the current tour list from the cache
      const existingTours = cache.readQuery<GetThingsQueryResponse>({
        query: GET_THINGS_QUERY,
      });

      if (existingTours) {
        // Filter out the deleted tour from the list
        const updatedThings = existingTours.getThings.filter(
          (tour) => tour.id !== activateThing.id
        );

        // Write the updated list back to the cache
        cache.writeQuery({
          query: GET_THINGS_QUERY,
          data: { getThings: updatedThings },
        });
      }
    },
    refetchQueries: [
      GET_THINGS_QUERY, // You can also use { query: GET_ATTRACTIONS_QUERY } for more options
    ],
  });

  const handleDeleteThing = async () => {
    // console.log("ffunction called");
    try {
      // Call the deleteTour mutation
      const res = await deleteThing({
        variables: {
          deleteThingId: selectedThing.id,
        },
      });
      console.log("respone", res);
      if (res?.data?.deleteThing?.id) {
        navigate("../../allthings");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };
  const handleActivateThing = async () => {
    // console.log("ffunction called");
    try {
      // Call the deleteTour mutation
      const res = await activateThing({
        variables: {
          activateThingId: selectedThing.id,
        },
      });
      console.log("respone", res);
      if (res?.data?.activateThing?.id) {
        navigate("../../allthings");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };
  if (thingLoading) {
    return <div>Loading...</div>; // Put your loading spinner or message here
  }

  if (thingError) {
    return <div>Error Loading</div>; // Put your loading spinner or message here
  }

  return (
    <div className="mb-4.5 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b bg-gray-3 dark:bg-graydark  border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
        <h3 className="font-semibold text-black dark:text-white ">
          Thing Details
        </h3>
        <button
          type="submit"
          className="flex justify-center px-4 py-2 font-medium text-white rounded-lg bg-primary"
          onClick={() => {
            if (isActive) {
              handleDeleteThing();
            } else {
              handleActivateThing();
            }
          }}
        >
          {isActive ? "Delete" : "Activate"}
        </button>
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
              id="destinationDescription"
              value={thingDescription}
              onChange={(e) => setThingDescription(e.target.value)}
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
              htmlFor="toutTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Thing Hyperlink
            </label>
            <input
              type="text"
              id="tourTitle"
              value={thingHyperlink}
              onChange={(e) => setThingHyperlink(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              {thingImage && (
                <div className="relative flex justify-center w-full">
                  <img
                    src={thingImage}
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
                className={thingImage ? "hidden" : ""}
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
            {isSubmitting ? "Updating..." : "Update Thing"}
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

export default EditThingPage;
