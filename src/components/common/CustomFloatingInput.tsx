import React, { useState, ChangeEvent, FocusEvent } from "react";

interface FloatingInputProps {
  label: string;
  value: string;
  required?: boolean;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  value,
  required,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className={`relative w-1/2 ${isFocused ? "focused" : ""}`}>
      <input
        required={required}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`block w-full px-2.5 py-3.5 text-sm text-gray-900 bg-transparent rounded border-[1.5px] dark:text-white dark:bg-form-input focus:outline-none transition-all duration-300 ${
          isFocused ? "border-primary" : "border-stroke"
        }`}
        {...props}
      />
      <label
        className={`absolute top-0 rounded-2xl left-1/2 px-2.5 py-1.5 bg-white dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400 transform -translate-y-1/2 ${
          isFocused || value
            ? "-translate-x-2/4 scale-75 border-[1.5px] border-primary"
            : "translate-x-0 scale-100 border-stroke "
        } transition-all duration-300 origin-0`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;
