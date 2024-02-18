import React, { useEffect, useState } from "react";
import { QueryResult, useMutation, useQuery } from "@apollo/client";
import {
  DELETE_THING_MUTATION,
  UPDATE_CAR_MUTATION,
  ACTIVATE_CAR_MUTATION,
  DELETE_CAR_MUTATION,
} from "../../graphql/mutations";
import {
  GET_CARS_QUERY,
  GET_DESTINATIONS_QUERY,
  GET_SINGLE_CAR,
  GET_TAGS_QUERY,
  GET_THINGS_QUERY,
} from "../../graphql/query";
import { Tag } from "../../components/settings/create-tag";
import { Destination } from "../../components/destination/destination-card";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../utils/firebase";
import { Car } from "./AllCar";
import { useDataStore } from "../../store/store";
import { useNavigate, useParams } from "react-router";
import { ErrorModal } from "../../components/common/ErrorModal";
import { priorityList } from "../../utils/role";

type GetCarsQueryResponse = {
  getCars: Car[];
};

const EditCarPage = () => {
  // const { selectedThing } = useDataStore();
  const { selectedCar, setSelectedCar } = useDataStore();
  const { carId } = useParams();
  const {
    data: carData,
    loading: thingLoading,
    error: thingError,
  }: QueryResult = useQuery(GET_SINGLE_CAR, {
    variables: { getCarId: carId },
  });

  const [carTitle, setCarTitle] = useState(selectedCar?.carTitle || "");
  const [carDescription, setCarDescription] = useState(
    selectedCar?.carDescription || ""
  );
  const [carHyperlink, setCarHyperlink] = useState(
    selectedCar?.carHyperlink || ""
  );
  const [destinationId, setDestinationId] = useState(
    selectedCar?.destination?.id || ""
  );
  const [tagId, setTagId] = useState(selectedCar?.tag?.id || "");
  const [carImage, setCarImage] = useState(
    selectedCar?.images?.[0]?.imageUrl || ""
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(!selectedCar.id);
  const [priority, setPriority] = useState<number | null>(
    selectedCar?.priority || null
  );
  const [isActive, setIsActive] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (carData) {
      setSelectedCar(carData?.getCar);
      setIsLoading(false);
      setCarImage(carData?.getCar?.images?.[0]?.imageUrl || "");
      setTagId(carData?.getCar?.tag?.id || "");
      setDestinationId(carData?.getCar?.destination?.id || "");
      setCarHyperlink(carData?.getCar?.images?.[0]?.imageUrl || "");
      setCarDescription(carData?.getCar?.carDescription || "");
      setCarTitle(carData?.getCar?.carTitle || "");
      setIsActive(carData?.getCar?.active || false);
      setPriority(carData?.getCar?.priority || null);
    }
  }, [carData]);

  const [updateCar, { data, loading, error }] = useMutation(
    UPDATE_CAR_MUTATION,
    {
      update(cache, { data: { updateCar } }) {
        const existingCars = cache.readQuery<GetCarsQueryResponse>({
          query: GET_CARS_QUERY,
        });

        if (existingCars) {
          // Find the index of the tour that was updated
          const updatedThingIndex = existingCars.getCars.findIndex(
            (thing) => thing.id === updateCar.id
          );

          if (updatedThingIndex > -1) {
            // Replace the old tour with the updated one
            const updatedThings = [
              ...existingCars.getCars.slice(0, updatedThingIndex),
              updateCar,
              ...existingCars.getCars.slice(updatedThingIndex + 1),
            ];

            // Write the updated list back to the cache
            cache.writeQuery({
              query: GET_CARS_QUERY,
              data: { getCars: updatedThings },
            });
          }
        }
      },
      refetchQueries: [GET_CARS_QUERY],
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
      const response = await updateCar({
        variables: {
          updateCarInput: {
            carId: selectedCar.id,
            carTitle: carTitle,
            carDescription: carDescription,
            carHyperlink: carHyperlink,
            imageUrls: [carImage],
            destinationId: destinationId,
            tagId: tagId, // This is the tag ID selected from the dropdown
            priority,
          },
        },
      });
      if (response.data.updateCar) {
        navigate("/allcars");
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
  const [deleteThing] = useMutation(DELETE_CAR_MUTATION, {
    update(cache, { data: { deleteThing } }) {
      // Retrieve the current tour list from the cache
      const existingTours = cache.readQuery<GetCarsQueryResponse>({
        query: GET_CARS_QUERY,
      });

      if (existingTours) {
        // Filter out the deleted tour from the list
        const updatedThings = existingTours.getCars.filter(
          (tour) => tour.id !== deleteThing.id
        );

        // Write the updated list back to the cache
        cache.writeQuery({
          query: GET_CARS_QUERY,
          data: { getCars: updatedThings },
        });
      }
    },
    refetchQueries: [
      GET_CARS_QUERY, // You can also use { query: GET_ATTRACTIONS_QUERY } for more options
    ],
  });

  const [activateThing] = useMutation(ACTIVATE_CAR_MUTATION, {
    update(cache, { data: { activateThing } }) {
      // Retrieve the current tour list from the cache
      const existingTours = cache.readQuery<GetCarsQueryResponse>({
        query: GET_CARS_QUERY,
      });

      if (existingTours) {
        // Filter out the deleted tour from the list
        const updatedThings = existingTours.getCars.filter(
          (tour) => tour.id !== activateThing.id
        );

        // Write the updated list back to the cache
        cache.writeQuery({
          query: GET_CARS_QUERY,
          data: { getCars: updatedThings },
        });
      }
    },
    refetchQueries: [
      GET_CARS_QUERY, // You can also use { query: GET_ATTRACTIONS_QUERY } for more options
    ],
  });

  const handleDeleteThing = async () => {
    // console.log("ffunction called");
    try {
      // Call the deleteTour mutation
      console.log("delete car", selectedCar.id);
      const res = await deleteThing({
        variables: {
          deleteCarId: selectedCar.id,
        },
      });
      console.log("respone", res);
      if (res?.data?.deleteCar?.id) {
        navigate("../../allcars");
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
          activateCarId: selectedCar.id,
        },
      });
      console.log("respone", res);
      if (res?.data?.activateCar?.id) {
        navigate("../../allcars");
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
          Car Details
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
              id="destinationDescription"
              value={carDescription}
              onChange={(e) => setCarDescription(e.target.value)}
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
              Car Hyperlink
            </label>
            <input
              type="text"
              id="tourTitle"
              value={carHyperlink}
              onChange={(e) => setCarHyperlink(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              {carImage && (
                <div className="relative flex justify-center w-full">
                  <img
                    src={carImage}
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
                className={carImage ? "hidden" : ""}
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
            {isSubmitting ? "Updating..." : "Update Car"}
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

export default EditCarPage;
