import React, { useState } from "react";
import { useGlobalStore } from "../../store/globalStore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../utils/firebase";
import AlertComponent from "../common/AlertComponent";

const PhotosComponent: React.FC = () => {
  const store = useGlobalStore();
  const { general, setGeneral } = store;
  const { summaryData } = general;

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSizeError, setIsSizeError] = useState<boolean>(false);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    // Define the size limit (5MB in bytes)
    const SIZE_LIMIT = 3145728;

    if (file) {
      // Check the file size against the size limit
      if (file.size > SIZE_LIMIT) {
        setIsSizeError(true);
        return; // Stop the function if the file is too big
      }

      const downloadUrl = await uploadToFirebase(file);
      const updatedPhotos = [
        ...store.general.summaryData.photos,
        { url: downloadUrl },
      ];
      setGeneral("summaryData", { photos: updatedPhotos });
    }
  };

  const handleDelete = (photoUrl: string) => {
    const updatedPhotos = summaryData.photos.filter(
      (photo) => photo.url !== photoUrl
    );
    setGeneral("summaryData", { photos: updatedPhotos });
  };

  // Firebase storage logic
  const storage = getStorage(app);
  const storageRef = ref(storage);

  const uploadToFirebase = async (file: File): Promise<string> => {
    const fileRef = ref(storageRef, file.name);
    try {
      setIsUploading(true);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file", error);
      return "";
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="mb-4.5 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className=" justify-between border-b bg-gray-3 dark:bg-graydark border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
        <h3 className="font-semibold text-black dark:text-white">Photos</h3>
      </div>

      <div className="flex flex-wrap gap-6 p-4">
        {/* Upload icon */}
        <label className="flex items-center justify-center w-24 h-24 border-2 border-gray-400 border-dashed cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleImageUpload}
            accept="image/*"
          />
          <div className="text-4xl text-gray-500">+</div>
        </label>

        {isUploading && (
          <div className="flex items-center justify-center w-24 h-24">
            <div className="w-16 h-16 border-4 border-solid rounded-full animate-spin border-primary border-t-transparent"></div>
          </div>
        )}
        {/* Images grid */}
        {[...summaryData.photos].reverse().map((photo, index) => (
          <div key={index} className="relative w-24 h-24">
            <img
              src={photo.url}
              alt={`Uploaded ${index}`}
              className="object-cover w-full h-full"
            />
            <button
              onClick={() => handleDelete(photo.url)}
              className="absolute top-0 right-0 p-1 text-white rounded-bl-lg bg-danger hover:bg-red-600"
            >
              x
            </button>
          </div>
        ))}
        {isSizeError ? (
          <AlertComponent
            toggleAlert={setIsSizeError}
            title="Size Error"
            message="File size exceeds 3MB. Please choose a smaller file."
          />
        ) : null}
      </div>
    </div>
  );
};

export default PhotosComponent;
