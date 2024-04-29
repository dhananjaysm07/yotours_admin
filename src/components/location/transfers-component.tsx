import { useGlobalStore } from "../../store/globalStore";

export type CheckboxInfo = {
  airportTransfers: boolean;
  localTransfers: boolean;
};

const TransferComponent: React.FC = () => {
  const { location, setLocation } = useGlobalStore();
  const { transfers } = location;
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    checkboxType: keyof CheckboxInfo
  ) => {
    const isChecked = e.target.checked;
    const updatedTransfersData = { ...transfers, [checkboxType]: isChecked };
    setLocation("transfers", updatedTransfersData);
  };
  return (
    <div className="p-4">
      <div className="flex items-center ">
        <input
          type="checkbox"
          id="airportTransfers"
          checked={transfers.airportTransfers}
          onChange={(e) => handleCheckboxChange(e, "airportTransfers")}
          className="w-5 h-5 mr-2 rounded-sm form-checkbox text-primary border-gray-3 dark:border-gray-7"
        />
        <label
          htmlFor="airportTransfers"
          className="text-black dark:text-white"
        >
          Airport Transfers
        </label>
      </div>
      <div className="flex items-center mt-3">
        <input
          type="checkbox"
          id="localTransfers"
          checked={transfers.localTransfers}
          onChange={(e) => handleCheckboxChange(e, "localTransfers")}
          className="w-5 h-5 mr-2 rounded-sm form-checkbox text-primary border-gray-3 dark:border-gray-7"
        />
        <label htmlFor="localTransfers" className="text-black dark:text-white">
          Local Transfers
        </label>
      </div>
    </div>
  );
};

export default TransferComponent;
