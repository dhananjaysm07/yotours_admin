import React, { useState, ChangeEvent } from "react";

interface DynamicInputListProps {
  label: string;
  initialItemList: string[];
  onUpdateItemList: (newItemList: string[]) => void;
}

const DynamicInputList: React.FC<DynamicInputListProps> = ({
  label,
  initialItemList,
  onUpdateItemList,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [itemList, setItemList] = useState<string[]>(initialItemList);
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  // console.log("item list", itemList);
  React.useEffect(() => {
    setItemList(initialItemList);
  }, [initialItemList]);

  const handleAddInput = () => {
    if (inputValue.trim() === "") {
      setError(`Please enter ${label.toLowerCase()}`);
      return;
    }
    setItemList([...itemList, inputValue]);
    setInputValue("");
    setError("");
    onUpdateItemList([...itemList, inputValue]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItemList = itemList.filter((_, i) => i !== index);
    setItemList(updatedItemList);
    onUpdateItemList(updatedItemList);
  };

  return (
    <div className="w-full mt-4 sm:mt-0 sm:pl-2">
      <label className="block mb-1 font-medium text-gray-800">{label}</label>
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          placeholder={`Enter ${label.toLowerCase()}`}
        />

        <button
          type="button"
          className="px-4 py-2 ml-2 text-white rounded-lg bg-primary hover:bg-blue-600"
          onClick={handleAddInput}
        >
          Add
        </button>
      </div>
      {error && <p className="mt-1 text-danger">{error}</p>}
      {itemList.length > 0 && (
        <ul className="py-2 mt-2">
          {itemList.map((item, index) => (
            <li key={index} className="flex items-center mb-1 text-graydark">
              <div className="flex items-center justify-between w-full px-3 py-2 border rounded-md shadow-sm text-graydark border-meta-5">
                <div className="flex items-center">
                  <span>{item}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 ml-2 cursor-pointer text-graydark hover:text-danger"
                  onClick={() => handleRemoveItem(index)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DynamicInputList;
