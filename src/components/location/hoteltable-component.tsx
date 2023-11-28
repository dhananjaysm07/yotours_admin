import { useState } from "react";
import { useGlobalStore } from "../../store/globalStore";
import HotelComponent from "./addhotel-component";
import EditHotelModal from "./edithotel-modal";

const HotelTableComponent = () => {
  const { location, setLocation } = useGlobalStore();
  const { hotelsData } = location;
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editHotelIndex, setEditHotelIndex] = useState<number>(0);
  const handleHotelDelete = (indexToDelete: number, hotelName: string) => {
    const updatedHotelsData = hotelsData.filter(
      (hotel, index) => index !== indexToDelete && hotel.name == hotelName
    );
    setLocation("hotelsData", updatedHotelsData);
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
                  Name
                </th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">City</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {hotelsData.map((item, idx) => (
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
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.cities.join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {`${item.days}D ${item.nights}N`}
                  </td>
                  <td className="px-6 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditHotelIndex(idx);
                        setIsEditModalOpen(true)
                      }}
                      className="px-3 py-2 font-medium duration-150 rounded-lg text-meta-5 hover:text-indigo-500 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleHotelDelete(idx, item.name)}
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
            <EditHotelModal hotel={hotelsData[editHotelIndex]} setModal={setIsEditModalOpen}/>
          )}
        </div>
      </div>
  );
};

export default HotelTableComponent;
