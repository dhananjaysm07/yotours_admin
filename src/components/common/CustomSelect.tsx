import React, { useState } from "react";
import Select, {OnChangeValue } from "react-select";

export type OptionType = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  placeholder: string;
  requiredField: boolean;
  options: OptionType[];
  onSelect: (selectedItems: OptionType[]) => void;
  isMulti?: boolean; // Added isMulti prop
  isDisabled?: boolean;
  value: { value: string; label: string; }[];
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  placeholder,
  requiredField,
  options,
  onSelect,
  isMulti = false, // Default value for isMulti is false
  isDisabled,
  value = [{label:"",value:""}],
}) => {
  const [selectedOptions, setSelectedOptions] = useState<OptionType[] | null>();

  React.useEffect(() => {
    // setSelectedOptions(null);
    if (value.length) {
        const data: OptionType[] = options.filter((el) => {
          return value?.some(val => val.value === el.value);
        });
        setSelectedOptions(data);
      }
  }, [value]);

  const handleSelect = (data: OnChangeValue<OptionType, boolean>) => {
    if (isMulti) {
      const selectedItems = data as OptionType[];
      setSelectedOptions(selectedItems.length > 0 ? selectedItems : null);
      onSelect(selectedItems); // Pass the selected items to the callback function
    } else {
      const selectedItem = data as OptionType | null;
      setSelectedOptions(selectedItem ? [selectedItem] : null);
      onSelect(selectedItem ? [selectedItem] : []); // Pass a single-item array or an empty array to the callback function
    }
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "1px solid #E2E8F0",
      borderRadius: "4px",
      padding: "5px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#555",
      },
    }),
    option: (provided: any) => ({
      ...provided,
      backgroundColor: "#fff",
      color: "#333",
      "&:hover": {
        backgroundColor: "#f2f2f2",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#000",
      borderRadius: "20px",
      padding: "2px 4px",
      "&:hover": {},
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#fff",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#999",
      margin: "4px 0px",
      padding: "0px 4px",
      "&:hover": {
        color: "#fff",
        backgroundColor: "#E15963",
      },
    }),
  };

  return (
    <div className="app">
      <div className="dropdown-container">
        <Select
          isDisabled={isDisabled}
          required={requiredField}
          options={options}
          placeholder={placeholder}
          value={selectedOptions}
          onChange={handleSelect}
          isSearchable={true}
          styles={customStyles}
          isMulti={isMulti} // Pass the isMulti prop to the Select component
        />
      </div>
    </div>
  );
};

export default CustomSelect;
