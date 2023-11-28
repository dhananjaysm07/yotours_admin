import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TAG_MUTATION } from "../../graphql/mutations";
import { GET_TAGS_QUERY } from "../../graphql/query";
type GetTagsQueryResponse = {
  getAllTags: Tag[]; // Assuming `Tag` is the type of your tags
};

export interface Tag {
  name: string;
  id: string;
  active: boolean;
}
const CreateTag: React.FC = () => {
  const [tagName, setTagName] = useState("");
  const [isActive, setIsActive] = useState(true); // Assume you want the tag to be active by default

  // Use the useMutation hook with the defined mutation and an update function
  const [createTag, { data, loading, error }] = useMutation(
    CREATE_TAG_MUTATION,
    {
      update(cache, { data: { createTag } }) {
        // Read the current state of the GET_TAGS_QUERY from the cache
        const existingTags = cache.readQuery<GetTagsQueryResponse>({
          query: GET_TAGS_QUERY,
        });

        // Add the new tag to the cache
        if (existingTags && createTag) {
          cache.writeQuery({
            query: GET_TAGS_QUERY,
            data: {
              getAllTags: [...existingTags.getAllTags, createTag],
            },
          });
        }
      },
      onError(err) {
        // Handle error
        console.error("Error creating tag:", err);
      },
    }
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Call the mutation with the variables
      await createTag({
        variables: {
          createTagDto: {
            name: tagName,
            active: isActive, // Make sure to send the active state if it's a part of your DTO
          },
        },
      });
      // Reset the form if needed and handle success
      setTagName("");
      setIsActive(true);
    } catch (err) {
      // Handle the error case
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <form
        className="w-full p-8 bg-white rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">
          Create a New Tag
        </h2>
        <div className="mb-6 md:flex md:items-center">
          <div className="md:w-1/2">
            <label
              className="block pr-4 mb-1 font-bold text-gray-700 md:text-right md:mb-0"
              htmlFor="inline-name"
            >
              Tag Name
            </label>
          </div>
          <div className="md:w-3/4">
            <input
              className="w-full px-4 py-3 mb-3 leading-tight text-gray-700 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-name"
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Enter tag name"
            />
          </div>
        </div>
        <div className="md:flex md:items-center">
          <div className="md:w-1/4"></div>
          <div className="flex justify-start md:w-3/4 md:justify-end">
            <button
              className="px-5 py-2 font-bold text-white transition-colors duration-150 transform rounded shadow-lg bg-meta-5 hover:bg-purple-600 focus:shadow-outline focus:outline-none"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Tag"}
            </button>
          </div>
        </div>
        {error && (
          <p className="mt-4 text-xs italic text-center text-red-500">
            Error creating tag: {error.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateTag;
