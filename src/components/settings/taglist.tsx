import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TAGS_QUERY } from "../../graphql/query";
import {
  ACTIVATE_TAG_MUTATION,
  DEACTIVATE_TAG_MUTATION,
  UPDATE_TAG_MUTATION,
} from "../../graphql/mutations";
import { ToggleSwitch } from "./toggleswitch";

const TagsList: React.FC = () => {
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editedName, setEditedName] = useState<{ [key: string]: string }>({});

  const { data, loading, error } = useQuery(GET_TAGS_QUERY);
  //   / In your React component
  const [activateTag] = useMutation(ACTIVATE_TAG_MUTATION, {
    update(cache, { data: { activateTag } }) {
      const data: any = cache.readQuery({ query: GET_TAGS_QUERY });
      cache.writeQuery({
        query: GET_TAGS_QUERY,
        data: {
          getAllTags: data.getAllTags.map((tag: any) =>
            tag.id === activateTag.id ? { ...tag, active: true } : tag
          ),
        },
      });
    },
  });
  const [deactivateTag] = useMutation(DEACTIVATE_TAG_MUTATION, {
    update(cache, { data: { deactivateTag } }) {
      const data: any = cache.readQuery({ query: GET_TAGS_QUERY });
      cache.writeQuery({
        query: GET_TAGS_QUERY,
        data: {
          getAllTags: data.getAllTags.map((tag: any) =>
            tag.id === deactivateTag.id ? { ...tag, active: false } : tag
          ),
        },
      });
    },
  });

  const handleActivateTag = async (id: string) => {
    try {
      await activateTag({
        variables: { tagId: id },
      });
    } catch (error) {
      console.error("Error while activating tag:", error);
      // Handle error appropriately
    }
  };

  // Deactivate tag handler
  const handleDeactivateTag = async (id: string) => {
    try {
      await deactivateTag({
        variables: { tagId: id },
      });
    } catch (error) {
      console.error("Error while deactivating tag:", error);
      // Handle error appropriately
    }
  };

  // Usage in a toggle handler could look like this:
  const handleToggleActive = (id: string, isActive: boolean) => {
    if (isActive) {
      handleDeactivateTag(id);
    } else {
      console.log("activating");
      handleActivateTag(id);
    }
  };

  // Edit tag handler
  const [editTag] = useMutation(UPDATE_TAG_MUTATION, {
    onCompleted: () => {
      // Exit edit mode and possibly clear editedName state
    },
    onError: (error) => {
      // Handle error
      console.error("Error while updating tag:", error);
    },
  });
  const handleEdit = (id: string, name: string) => {
    // Set edit mode to true for this specific tag
    setEditMode((prev) => ({ ...prev, [id]: true }));
    // Set the current name of the tag to the editedName state
    setEditedName((prev) => ({ ...prev, [id]: name }));
  };

  const handleSaveEdit = (id: string) => {
    // Call the editTag mutation with the new name
    editTag({
      variables: {
        updateTagDto: {
          id: id,
          name: editedName[id],
        },
      },
    });

    // Set edit mode to false for this specific tag
    setEditMode((prev) => ({ ...prev, [id]: false }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>An error occurred</p>;

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
            >
              Tag Name
            </th>
            <th
              scope="col"
              className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.getAllTags.map((tag: any) => (
            <tr key={tag.id} className="hover:bg-gray-100">
              <td className="px-5 py-2 text-sm bg-white border-b border-gray-200">
                {editMode[tag.id] ? (
                  <input
                    type="text"
                    className="block w-full mt-1 form-input"
                    value={editedName[tag.id]}
                    onChange={(e) =>
                      setEditedName({ ...editedName, [tag.id]: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-gray-900 whitespace-no-wrap">{tag.name}</p>
                )}
              </td>
              <td className="px-5 py-2 text-sm bg-white border-b border-gray-200">
                <div className="flex justify-start align-center">
                  {editMode[tag.id] ? (
                    <button
                      className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-meta-3 hover:bg-blue-700"
                      onClick={() => handleSaveEdit(tag.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        className="px-4 py-2 mr-3 text-sm font-semibold text-white rounded-lg bg-meta-3 hover:bg-blue-700"
                        onClick={() => handleEdit(tag.id, tag.name)}
                      >
                        Edit
                      </button>
                      <ToggleSwitch
                        isActive={tag.active}
                        onToggle={() => handleToggleActive(tag.id, tag.active)}
                      />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TagsList;
