import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_CAR_MUTATION,
  // CREATE_ATTRACTION_MUTATION,
} from "../../graphql/mutations";
import {
  GET_CARS_QUERY,
  GET_DESTINATIONS_QUERY,
  GET_TAGS_QUERY,
  // GET_TOURS_QUERY,
} from "../../graphql/query";
import { Tag } from "../../components/settings/create-tag";
import { Destination } from "../../components/destination/destination-card";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../utils/firebase";
import { Car } from "./AllCar";
import { useNavigate } from "react-router";
import { ErrorModal } from "../../components/common/ErrorModal";
import { priorityList } from "../../utils/role";

type GetCarsQueryResponse = {
  getCars: Car[];
};

const CreateCar = () => {
  const [carTitle, setCarTitle] = useState("");
  const [carDescription, setCarDescription] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [tagId, setTagId] = useState("");
  const [carImage, setCarImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [carHyperLink, setCarHyperLink] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [carBokunId, setCarBokunId] = useState("");
  const navigate = useNavigate();

  const [createCar, { loading, error }] = useMutation(CREATE_CAR_MUTATION, {
    update(cache, { data: { createCar } }) {
      // Retrieve the current tour list from the cache
      const existingThings = cache.readQuery<GetCarsQueryResponse>({
        query: GET_CARS_QUERY,
      });

      // Add the new tour to the list
      const newCars = existingThings
        ? [...existingThings.getCars, createCar]
        : [createCar];

      // Write the updated list back to the cache
      cache.writeQuery({
        query: GET_CARS_QUERY,
        data: { getCars: newCars },
      });
    },
  });

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
      const response = await createCar({
        variables: {
          createCarInput: {
            carTitle: carTitle,
            carDescription: carDescription,
            carHyperlink: carHyperLink,
            imageUrls: [carImage],
            destinationId: destinationId,
            tagId: tagId, // This is the tag ID selected from the dropdown
            priority,
            carBokunId,
            // active: true,
          },
        },
      });
      console.log("create cars");
      if (response.data.createCar) {
        navigate("/allcars");
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

    const uniqueId =
      new Date().getTime() + "_" + Math.random().toString(36).slice(2, 11);

    // If carTitle is available, use it in the file name, otherwise use the unique identifier
    const fileNamePrefix = carTitle.trim()
      ? carTitle.replace(/[^a-zA-Z0-9]/g, "_")
      : `car_${uniqueId}`;
    const fileName = `${fileNamePrefix}_${file.name}`;

    const storageRef = ref(storage, `carImages/${fileName}`);
    try {
      setIsUploading(true);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setCarImage(downloadURL);
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
          Car Details
        </h3>
      </div>
      <div className="p-6.5">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="carTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="carTitle"
              value={carTitle}
              onChange={(e) => setCarTitle(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="carTitle"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Description
            </label>
            <input
              type="text"
              id="carDescription"
              value={carDescription}
              onChange={(e) => setCarDescription(e.target.value)}
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
              htmlFor="carHyperLink"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Car Hyperlink
            </label>
            <input
              type="text"
              id="carHyperLink"
              value={carHyperLink}
              onChange={(e) => setCarHyperLink(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="attractionBokunId"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Car Bokun ID
            </label>
            <input
              type="text"
              id="attractionBokunId"
              value={carBokunId}
              onChange={(e) => setCarBokunId(e.target.value)}
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
            {carImage && (
              <div className="flex justify-center w-full">
                <img
                  src={carImage}
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
            {isSubmitting ? "Creating..." : "Create Car"}
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

export default CreateCar;
