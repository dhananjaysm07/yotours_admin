import { useEffect } from "react";
import FloatingInput from "../common/CustomFloatingInput";
import { useGlobalStore } from "../../store/globalStore";

function DurationDetailsSection() {
  const { general, setGeneral } = useGlobalStore();
  const { durationData } = general;

  useEffect(() => {
    const expectedNights = durationData.days - 1;

    // Only update if nights are different to avoid unnecessary state updates.
    if (durationData.days > 0 && durationData.nights !== expectedNights) {
      setGeneral("durationData", {
        nights: expectedNights,
      });
    }
  }, [durationData.days]);

  // Input validation function to accept only numeric characters
  const validateNumericInput = (inputValue: string) => {
    const numericValue = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    return numericValue;
  };
  return (
    <div className="mb-4.5 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b bg-gray-3 dark:bg-graydark border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-semibold text-black dark:text-white ">
          Duration and Dates Details
        </h3>
      </div>
      <div className="flex flex-wrap py-6 px-6.5">
        <div className="w-full pr-4 mb-4 xl:w-1/2 xl:mb-0">
          <div className="flex gap-4">
            <FloatingInput
              label="Days"
              required={true}
              value={
                durationData.days === 0 ? "" : durationData.days.toString()
              }
              onChange={(e) => {
                const newValue = validateNumericInput(e.target.value);

                setGeneral("durationData", {
                  days: newValue === "" ? 0 : parseInt(newValue, 10),
                });
              }}
              placeholder="Enter Days"
              onFocus={() => console.log("Input focused")}
              onBlur={() => console.log("Input blurred")}
            />
            <FloatingInput
              label="Nights"
              required={true}
              placeholder="Enter Nights"
              value={
                durationData.nights === 0 ? "" : durationData.nights.toString()
              }
              onChange={(e) => {
                const newValue = validateNumericInput(e.target.value);

                setGeneral("durationData", {
                  nights: newValue === "" ? 0 : parseInt(newValue, 10),
                });
              }}
              onFocus={() => console.log("Input focused")}
              onBlur={() => console.log("Input blurred")}
            />
          </div>
        </div>

        <div className="w-full sm:pl-4 xl:w-1/2">
          <div className="flex gap-2">
            <FloatingInput
              label="Validity"
              required={true}
              placeholder="Enter Validity"
              value={
                durationData.validity === 0
                  ? ""
                  : durationData.validity.toString()
              }
              onChange={(e) => {
                const newValue = validateNumericInput(e.target.value);

                setGeneral("durationData", {
                  validity: newValue === "" ? 0 : parseInt(newValue, 10),
                });
              }}
              onFocus={() => console.log("Input focused")}
              onBlur={() => console.log("Input blurred")}
            />

            <select
              name="unit"
              value={durationData.validityUnit}
              onChange={(e) => {
                setGeneral("durationData", {
                  validityUnit: e.target.value,
                });
              }}
              className="custom-select w-1/2 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              <option value="">Select unit</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DurationDetailsSection;
