import React, { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../utils/firebase";
import { Highlight, useGlobalStore } from "../../store/globalStore";

const HighlightsComponent: React.FC = () => {
  const [formData, setFormData] = useState<Highlight>({
    title: "",
    description: "",
    url: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IsUploading, setIsUploading] = useState<boolean>(false);
  const store = useGlobalStore();
  const { general, setGeneral } = store;
  const { summaryData } = general;
  const [previewImage, setPreviewImage] = useState<string | null>();
  const [imageViewModalOpen, setImageViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEdit = (index: number) => {
    const highlight = summaryData.highlights[index];
    setFormData(highlight);
    setModalMode("edit");
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (modalMode === "create") {
      console.log("Modal Mode create");
      const updatedHighlights = [
        ...store.general.summaryData.highlights,
        formData,
      ];
      setGeneral("summaryData", { highlights: updatedHighlights });
    } else if (modalMode === "edit" && editingIndex !== null) {
      const updatedHighlights = [...store.general.summaryData.highlights];
      updatedHighlights[editingIndex] = formData;
      setGeneral("summaryData", { highlights: updatedHighlights });
    }
    setIsModalOpen(false);
    setModalMode("create"); // Reset mode to default
    setEditingIndex(null); // Clear editing index
  };

  // Create a storage reference
  const storage = getStorage(app);
  const storageRef = ref(storage);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    // Define the size limit (5MB in bytes)
    const SIZE_LIMIT = 5242880;
    if (file) {
      if (file.size > SIZE_LIMIT) {
        alert("File size exceeds 5MB. Please choose a smaller file.");
        return; // Stop the function if the file is too big
      }
      const fileRef = ref(storageRef, file.name);
      try {
        setIsUploading(true); // Set isUploading to true when starting upload
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        setPreviewImage(downloadURL);
        setFormData((prev) => ({
          ...prev,
          url: downloadURL,
        }));
      } catch (error) {
        console.error("Error uploading file", error);
      } finally {
        setIsUploading(false); // Set isUploading to false when upload is complete or fails
      }
    }
  };

  const handleHighlightRemoval = (index: number) => {
    const updatedHighlights = store.general.summaryData.highlights.filter(
      (_, i) => i !== index
    );
    setGeneral("summaryData", { highlights: updatedHighlights });
  };

  const closeModalOnClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
      setImageViewModalOpen(false);
    }
  };
  return (
    <div className="mb-4.5 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className=" justify-between border-b bg-gray-3 dark:bg-graydark border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
        <h3 className="font-semibold text-black dark:text-white">Highlights</h3>
        <button
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-meta-3 focus:ring-4 focus:ring-blue-300"
          onClick={() => {
            setFormData({
              title: "",
              description: "",
              url: "",
            });
            setPreviewImage("");
            setModalMode("create");
            setIsModalOpen(true);
          }}
        >
          Add Highlight
        </button>
      </div>
      <div className="p-4">
        {summaryData.highlights.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {summaryData.highlights.map((highlight, index) => (
              <div key={index} className="max-w-lg mx-auto min-w-75">
                <div className="max-w-sm mb-5 bg-white border rounded-lg shadow-md border-gray">
                  <div
                    className="relative w-full h-64 hover:cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(highlight.url);
                      setImageViewModalOpen(true);
                    }}
                  >
                    <img
                      className="object-cover object-center w-full h-64 rounded-t-lg"
                      src={highlight.url}
                      alt={highlight.title}
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 hover:opacity-100">
                      <span className="font-bold text-white">View Image</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                      {highlight.title}
                    </h5>

                    <p className="mb-3 font-normal text-gray-700">
                      {highlight.description}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-meta-6 focus:ring-4 focus:ring-blue-300"
                        onClick={() => handleEdit(index)} // NEW: Add edit button
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleHighlightRemoval(index)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-danger hover:bg-danger focus:ring-4 focus:ring-blue-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <h2 className="text-xl italic font-satoshi">Click on Add highlight to start adding highlights</h2>
          </div>
        )}
        {imageViewModalOpen && (
          <div
            onClick={closeModalOnClickOutside}
            className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
          >
            <div className="flex flex-col items-center p-4 bg-white rounded-md shadow-lg">
              <img
                className="object-contain max-w-full max-h-96"
                src={selectedImage}
                alt="Selected"
              />
              <button
                className="px-4 py-2 mt-4 text-white rounded-md bg-danger hover:bg-red-600"
                onClick={() => setImageViewModalOpen(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div
            onClick={closeModalOnClickOutside}
            className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
          >
            <div className="w-11/12 p-6 bg-white rounded-lg shadow-lg modal md:w-2/3 lg:w-1/2">
              <h2 className="text-2xl">Add Highlight</h2>
              <div className="mb-4">
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Image</label>
                <label className="flex items-center justify-center w-24 h-24 border-2 border-gray-400 border-dashed cursor-pointer">
                  <input
                    accept="image/*"
                    required
                    className="hidden"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <div className="text-4xl text-gray-500">+</div>
                </label>
              </div>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Product Preview"
                  style={{ width: "100px", height: "100px" }}
                />
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 mr-2 text-white rounded-md bg-meta-3"
                >
                  {modalMode == "create" ? "Add" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-white rounded-md bg-danger"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighlightsComponent;
