import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import app from "../../utils/firebase";
import AlertComponent from "../common/AlertComponent";

interface DestinationPhotosProps {
  onPhotosChange: (photos: Array<{ name: string; url: string }>) => void;
}

const DestinationPhotos: React.FC<DestinationPhotosProps> = ({
  onPhotosChange,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSizeError, setIsSizeError] = useState<boolean>(false);
  const [photos, setPhotos] = useState<Array<{ name: string; url: string }>>(
    []
  );

  // Define the size limit (5MB in bytes)
  const SIZE_LIMIT = 5242880;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      // Check the file size against the size limit
      if (file.size > SIZE_LIMIT) {
        setIsSizeError(true);
        return; // Stop the function if the file is too big
      }

      const downloadUrl = await uploadToFirebase(file);
      // Update the photos state
      setPhotos((prevPhotos) => {
        const updatedPhotos = [
          ...prevPhotos,
          { name: file.name, url: downloadUrl },
        ];

        // Pass the updated photos array to the parent
        onPhotosChange(updatedPhotos);

        return updatedPhotos;
      });
    }
  };

  // Firebase storage logic
  const storage = getStorage(app);
  const storageRef = ref(storage, "destination_photos"); // Update the path as needed

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

  const handleDelete = async (fileName: string) => {
    // Delete logic here, you may need to delete the file from Firebase storage
    // After deleting from Firebase, update local state to remove the photo
    setPhotos((prevPhotos) =>
      prevPhotos.filter((photo) => photo.name !== fileName)
    );
  };

  return (
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
          {/* Spinner or upload indicator */}
        </div>
      )}
      {/* Images grid */}
      {photos.reverse().map((photo, index) => (
        <div key={index} className="relative w-24 h-24">
          <img
            src={photo.url}
            alt={`Uploaded ${index}`}
            className="object-cover w-full h-full"
          />
          <button
            onClick={() => handleDelete(photo.name)}
            className="absolute top-0 right-0 p-1 text-white rounded-bl-lg bg-danger hover:bg-red-600"
          >
            x
          </button>
        </div>
      ))}
      {isSizeError && (
        <AlertComponent
          toggleAlert={setIsSizeError}
          title="Size Error"
          message="File size exceeds 5MB. Please choose a smaller file."
        />
      )}
    </div>
  );
};

export default DestinationPhotos;
