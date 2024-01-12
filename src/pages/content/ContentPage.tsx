import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CONTENT_QUERY, GET_THINGS_QUERY } from "../../graphql/query";
import app from "../../utils/firebase";
import { useNavigate } from "react-router";
import { ErrorModal } from "../../components/common/ErrorModal";
import {
  CREATE_CONTENT_MUTATION,
  UPDATE_CONTENT_MUTATION,
} from "../../graphql/mutations";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { BsTrash2 } from "react-icons/bs";
import TncComponent from "../../components/general/tnc-input-component";
import PrivacyComponent from "../../components/general/privacy-input-component";
export interface Content {
  id: string;
  heroHeading: string;
  heroImage: string;
  footerlinks: string[];
  footerLogo: string;
  sociallinks: string[];
  tnc:string;
  privacy:string;
  bokunChannelId:string;
  leftDiscountImage:string;
  rightDiscountImage:string;
}
type GetContentQueryResponse = {
  getContent: Content;
};

const ContentPage = () => {
  // const { selectedThing } = useDataStore();
  //write query to fetch content

  const [heroHeading, setHeroHeading] = useState("");
  const [heroSubheading, setHeroSubheading] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [tnc, setTnc] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [footerLogo, setFooterLogo] = useState("");
  const [footerLinks, setFooterLinks] = useState([""]);
  const [socialLinks, setSocialLinks] = useState([""]);

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bokunChannelId, setBokunChannelId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [leftDiscountImage, setLeftDiscountImage] = useState("");
  const [rightDiscountImage, setRightDiscountImage] = useState("");
  const navigate = useNavigate();

  // Queries
  const {
    loading: contentLoading,
    error: contentError,
    data: contentData,
  } = useQuery(GET_CONTENT_QUERY);

  console.log("get content", contentData);

  useEffect(() => {
    if (contentData && contentData.getContent) {
      // Assuming 'getContent' is the field in the query response containing your content data
      const {
        heroHeading,
        heroSubheading,
        heroImage,
        footerLogo,
        footerLinks,
        socialLinks,
        tnc,
        bokunChannelId,
        privacy,
        leftDiscountImage,
        rightDiscountImage
      } = contentData.getContent;
      setHeroHeading(heroHeading || "");
      setHeroImage(heroImage || "");
      setHeroSubheading(heroSubheading || "");
      setFooterLogo(footerLogo || "");
      setFooterLinks(footerLinks || []);
      setSocialLinks(socialLinks || []);
      setTnc(tnc || "");
      setPrivacy(privacy || "");
      setBokunChannelId(bokunChannelId || "");
      setLeftDiscountImage(leftDiscountImage||"");
      setRightDiscountImage(rightDiscountImage||"");
    }
  }, [contentData]);
  // Mutations

  const [updateContent, { data, loading, error }] = useMutation(
    UPDATE_CONTENT_MUTATION,
    {
      update(cache, { data: { updateContent } }) {
        const existingContent = cache.readQuery<GetContentQueryResponse>({
          query: GET_CONTENT_QUERY,
        });

        if (existingContent) {
          cache.writeQuery({
            query: GET_CONTENT_QUERY,
            data: { getContent: updateContent },
          });
        }
      },
    }
  );

  const [createContent, { data: createData }] = useMutation(
    CREATE_CONTENT_MUTATION
  );

  // ... existing useEffect and other functions ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const contentInput = {
      heroHeading: heroHeading,
      heroSubheading: heroSubheading,
      heroImage: heroImage,
      footerLogo: footerLogo,
      footerLinks: footerLinks,
      socialLinks: socialLinks,
      tnc: tnc,
      privacy: privacy,
      bokunChannelId: bokunChannelId,
      leftDiscountImage:leftDiscountImage,
      rightDiscountImage:rightDiscountImage

      // include other fields as needed
    };

    try {
      let response;
      if (contentData && contentData.getContent && contentData.getContent.id) {
        // Update existing content
        response = await updateContent({
          variables: {
            updateContentInput: {
              id: contentData.getContent.id,
              ...contentInput,
            },
          },
        });
      } else {
        // Create new content
        response = await createContent({
          variables: { createContentInput: contentInput },
        });
      }

      if (response.data) {
        navigate("/");
      } else {
        setShowErrorModal(true);
      }
    } catch (err) {
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to update an individual footer link
  const updateFooterLink = (index: number, value: string) => {
    const updatedLinks = [...footerLinks];
    updatedLinks[index] = value;
    setFooterLinks(updatedLinks);
  };

  // Function to delete a footer link
  const deleteFooterLink = (index: number) => {
    const updatedLinks = footerLinks.filter((_, i) => i !== index);
    setFooterLinks(updatedLinks);
  };

  // Function to update an individual social link
  const updateSocialLink = (index: number, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = value;
    setSocialLinks(updatedLinks);
  };
  // Function to delete a social link
  const deleteSocialLink = (index: number) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
  };

  // Firebase storage logic
  const storage = getStorage(app);

  const handleBannerUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    const maxSize = 3 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File size should not exceed 3MB.");
      return;
    }
    const storageRef = ref(storage, `heroImages/${file.name}`);
    try {
      setIsUploading(true);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setHeroImage(downloadURL);
    } catch (error) {
      console.error("Error uploading banner image", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFooterImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File size should not exceed 2MB.");
      return;
    }
    const storageRef = ref(storage, `footerImage/${file.name}`);
    try {
      setIsUploading(true);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFooterLogo(downloadURL);
    } catch (error) {
      console.error("Error uploading banner image", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLeftDiscountImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File size should not exceed 2MB.");
      return;
    }
    const storageRef = ref(storage, `leftdiscount/${file.name}`);
    try {
      setIsUploading(true);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("this is left hero image",heroImage);
      setLeftDiscountImage(downloadURL);
    } catch (error) {
      console.error("Error uploading banner image", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRightDiscountImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File size should not exceed 2MB.");
      return;
    }
    const storageRef = ref(storage, `rightdiscount/${file.name}`);
    try {
      setIsUploading(true);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setRightDiscountImage(downloadURL);
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
          Static Content
        </h3>
      </div>
      <div className="p-6.5">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="heroHeading"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Hero Heading
            </label>
            <input
              type="text"
              id="heroHeading"
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="heroSubheading"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Hero Subheading
            </label>
            <input
              type="text"
              id="heroSubheading"
              value={heroSubheading}
              onChange={(e) => setHeroSubheading(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Hero Banner
            </label>
            <div className="flex items-center space-x-2">
              {heroImage && (
                <div className="relative flex justify-center w-full">
                  <img
                    src={heroImage}
                    alt="Hero Banner"
                    className="object-cover h-40 rounded-md shadow-md"
                  />
                  <label
                    htmlFor="heroimage"
                    className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 cursor-pointer"
                  >
                    Change
                  </label>
                </div>
              )}
              <input
                id="heroimage"
                type="file"
                className={heroImage ? "hidden" : ""}
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
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Footer logo
            </label>
            <div className="flex items-center space-x-2">
              {footerLogo && (
                <div className="relative flex justify-center w-full">
                  <img
                    src={footerLogo}
                    alt="Footer Logo"
                    className="object-cover h-40 rounded-md shadow-md"
                  />
                  <label
                    htmlFor="footerlogo"
                    className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 cursor-pointer"
                  >
                    Change
                  </label>
                </div>
              )}
              <input
                id="footerlogo"
                type="file"
                className={footerLogo ? "hidden" : ""}
                onChange={handleFooterImage}
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
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Footer Links
            </label>
            <div>
              {footerLinks.map((link, index) => (
                <div key={index} className="flex items-center mb-2 space-x-2">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => updateFooterLink(index, e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => deleteFooterLink(index)}
                    className="px-4 py-2 text-sm text-white rounded bg-danger"
                  >
                    <BsTrash2 />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFooterLinks([...footerLinks, ""])}
                className="px-4 py-2 text-sm text-white rounded bg-meta-3"
              >
                Add Link
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Social Links
            </label>
            <div>
              {socialLinks.map((link, index) => (
                <div key={index} className="flex items-center mb-2 space-x-2">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => updateSocialLink(index, e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => deleteSocialLink(index)}
                    className="px-4 py-2 text-sm text-white rounded bg-danger"
                  >
                    <BsTrash2 />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSocialLinks([...socialLinks, ""])}
                className="px-4 py-2 text-sm text-white rounded bg-meta-3"
              >
                Add Link
              </button>
            </div>
          </div>
          <TncComponent
            setText={setTnc}
            text={tnc}
            heading={"Terms and Condition"}
          />
          <PrivacyComponent setPrivacy={setPrivacy} privacy={privacy} />

          <div className="mb-4">
            <label
              htmlFor="bokunChannelId"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Bokun Channel UUID
            </label>
            <input
              type="text"
              id="bokunChannelId"
              value={bokunChannelId}
              onChange={(e) => setBokunChannelId(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="leftDiscountBanner"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Left Discount Banner
            </label>

            <div className="flex items-center space-x-2">
              {leftDiscountImage && (
                <div className="relative flex justify-center w-full">
                  <img
                    src={leftDiscountImage}
                    alt="Left Discount Banner"
                    className="object-cover h-40 rounded-md shadow-md"
                  />
                  <label
                    htmlFor="leftdiscount"
                    className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 cursor-pointer"
                  >
                    Change
                  </label>
                </div>
              )}
              <input
                id="leftdiscount"
                type="file"
                className={leftDiscountImage ? "hidden" : ""}
                onChange={handleLeftDiscountImage}
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
            <div className="mb-4">
            <label
              htmlFor="leftDiscountBanner"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Right Discount Banner
            </label>
            <div className="flex items-center space-x-2">
              {rightDiscountImage && (
                <div className="relative flex justify-center w-full">
                  <img
                    src={rightDiscountImage}
                    alt="Right Discount Image"
                    className="object-cover h-40 rounded-md shadow-md"
                  />
                  <label
                    htmlFor="rightdiscount"
                    className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 cursor-pointer"
                  >
                    Change
                  </label>
                </div>
              )}
              <input
                id="rightdiscount"
                type="file"
                className={rightDiscountImage ? "hidden" : ""}
                onChange={handleRightDiscountImage}
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
            {isSubmitting ? "Updating..." : "Update Content"}
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

export default ContentPage;
