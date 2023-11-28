import { useState } from "react";
import { useGlobalStore } from "../../store/globalStore";
import EditSightseeingModal from "./editsightseeing-modal";

const SightseeingTableComponent = () => {
  const store = useGlobalStore();
  const { location, setLocation } = store;
  const { sightseeingData } = location;
  const [editSightIndex, setEditSightIndex] = useState<number>(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const handleIntercityDelete = (indexToDelete: number) => {
    const updatedSightSeeingData = sightseeingData.filter(
      (_, index) => index !== indexToDelete
    );
    setLocation("sightseeingData", updatedSightSeeingData);
  };
  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">City</th>
            <th className="px-4 py-2 border-b">Sights</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {sightseeingData.map((item, index) => (
            <tr key={index} className="text-center">
              <td className="px-4 py-2 border">{item.city}</td>
              <td className="px-4 py-2 border">{item.sights.join(", ")}</td>
              <td className="px-6 text-right border whitespace-nowrap">
                <button
                  onClick={() => {
                    setEditSightIndex(index);
                    setIsEditModalOpen(true);
                  }}
                  className="px-3 py-2 font-medium duration-150 rounded-lg text-meta-5 hover:text-indigo-500 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleIntercityDelete(index)}
                  className="px-3 py-2 font-medium leading-none duration-150 rounded-lg text-danger hover:text-red-500 hover:bg-gray-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditModalOpen && (
        <EditSightseeingModal
          sightseeing={sightseeingData[editSightIndex]}
          setModal={setIsEditModalOpen}
        />
      )}
    </div>
  );
};

export default SightseeingTableComponent;
