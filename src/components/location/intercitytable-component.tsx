import { useState } from "react";
import { useGlobalStore } from "../../store/globalStore";
import EditHotelModal from "./edithotel-modal";
import EditIntercityModal from "./editIntercity-model";

const IntercityTableComponent = () => {
  const { location, setLocation } = useGlobalStore();
  const { intercityData } = location;
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editIntercityIndex, setEditIntercityIndex] = useState<number>(0);
  const handleIntercityDelete = (indexToDelete: number) => {
    const updatedIntercityData = intercityData.filter(
      (_, index) => index !== indexToDelete
    );
    setLocation("intercityData", updatedIntercityData);
  };
  return (
    <div className="w-full px-4 mx-auto ">
      <div className="mt-12 overflow-x-hidden border rounded-lg shadow-sm">
        <table className="w-full text-sm text-left table-auto">
          <thead className="font-medium text-gray-600 border-b">
            <tr>
              <th className="flex items-center px-6 py-3 gap-x-4">
                {/* <div>
                  <input
                    type="checkbox"
                    id="checkbox-all-items"
                    className="hidden checkbox-item peer"
                    // checked={areAllChecked}
                    // onChange={handleCheckboxItems}
                  />
                  <label
                    htmlFor="checkbox-all-items"
                    className="relative flex w-5 h-5 bg-white peer-checked:bg-indigo-600 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                  ></label>
                </div> */}
                From
              </th>
              <th className="px-6 py-3">To</th>
              <th className="px-6 py-3">Mode</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {intercityData.map((item, idx) => (
              <tr key={idx} className="odd:bg-graydark/5 even:bg-white">
                <td className="flex items-center px-6 py-4 whitespace-nowrap gap-x-4">
                  {/* <div>
                      <input
                        type="checkbox"
                        id={`checkbox-${idx}`}
                        name={`checkbox-${idx}`}
                        className="hidden checkbox-item peer"
                        //   checked={checkboxItems[`checkbox${idx}`]}
                        //   onChange={(e) => handleCheckboxChange(e, idx)}
                      />
                      <label
                        htmlFor={`checkbox-${idx}`}
                        className="relative flex w-5 h-5 bg-white peer-checked:bg-indigo-600 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                      ></label>
                    </div> */}
                  {item.fromCity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.toCity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.mode}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.description}
                </td>
                <td className="px-6 text-right whitespace-nowrap">
                  <button
                    onClick={() => {
                      setEditIntercityIndex(idx);
                      setIsEditModalOpen(true);
                    }}
                    className="px-3 py-2 font-medium duration-150 rounded-lg text-meta-5 hover:text-indigo-500 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleIntercityDelete(idx)}
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
          <EditIntercityModal
            intercity={intercityData[editIntercityIndex]}
            setModal={setIsEditModalOpen}
          />
        )}
      </div>
    </div>
  );
};

export default IntercityTableComponent;
