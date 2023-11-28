import React, { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../utils/firebase";
export interface DestinationBannerProps {
  onBannerChange: (image: string, title: string) => void;
}
const DestinationBanner: React.FC<DestinationBannerProps> = ({
  onBannerChange,
}) => {
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
 
  const [isUploading, setIsUploading] = useState(false);

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
      setBannerImage(downloadURL);
      onBannerChange(downloadURL, bannerTitle);
    } catch (error) {
      console.error("Error uploading banner image", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    setBannerTitle(newTitle);
    onBannerChange(bannerImage, newTitle);
  };

  return (
    <div className="space-y-4">
  <input
    type="text"
    placeholder="Enter banner title..."
    value={bannerTitle}
    onChange={handleTitleChange}
    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
  />
  <div className="flex items-center space-x-2">
    <label className="block w-full">
      <input
        type="file"
        onChange={handleBannerUpload}
        accept="image/*"
        className="w-full px-4 py-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
    </label>
    {isUploading && (
      <div className="flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-t-2 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
        <span className="text-sm text-gray-500">Uploading...</span>
      </div>
    )}
  </div>
  {bannerImage && (
    <div className="flex justify-center w-full">
      <img
        src={bannerImage}
        alt="Banner"
        className="object-cover h-40 rounded-md shadow-md"
      />
    </div>
  )}
</div>

  );
};

export default DestinationBanner;
