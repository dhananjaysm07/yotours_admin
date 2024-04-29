import { ChangeEvent } from "react";
import { DatesData, useGlobalStore } from "../../store/globalStore";

const DateInput = ({
  label,
  value,
  required,
  minDate,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  minDate: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label>{label}</label>
    <input
      type="date"
      required={required}
      value={value}
      min={minDate}
      className="custom-input-date w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      onChange={onChange}
    />
  </div>
);

const DatesDetailsSection = () => {
  const { general, setGeneral } = useGlobalStore();
  const { datesData } = general;
  const handleDateChange = (
    index: number,
    field: keyof DatesData,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const updatedDatesData = [...datesData];
    if (field == "bookingFromDate") {
      updatedDatesData[index].bookingFromDate = e.target.value;
    } else {
      updatedDatesData[index].bookingToDate = e.target.value;
    }
    setGeneral("datesData", updatedDatesData);
  };

  const handleAddTravelDate = (index: number) => {
    const updatedDatesData = [...datesData];
    updatedDatesData[index].travelDates.push({ fromDate: "", toDate: "" });
    setGeneral("datesData", updatedDatesData);
  };

  const handleRemoveTravelDate = (dateIndex: number, travelIndex: number) => {
    const updatedDatesData = [...datesData];
    updatedDatesData[dateIndex].travelDates.splice(travelIndex, 1);
    setGeneral("datesData", updatedDatesData);
  };

  const handleTravelDateChange = (
    dateIndex: number,
    travelIndex: number,
    field: keyof DatesData["travelDates"][0],
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const updatedDatesData = [...datesData];
    updatedDatesData[dateIndex].travelDates[travelIndex][field] =
      e.target.value;
    setGeneral("datesData", updatedDatesData);
  };

  const handleAddDate = () => {
    console.log("Adding new Date");
    const newDateEntry = {
      // bookingDates: { from: "", to: "" },
      travelDates: [],
    };

    setGeneral("datesData", [...datesData, newDateEntry]);
  };

  const handleRemoveDate = (index: number) => {
    const updatedDatesData = [...datesData];
    updatedDatesData.splice(index, 1);
    setGeneral("datesData", updatedDatesData);
  };

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    let month = (now.getMonth() + 1).toString();
    let day = now.getDate().toString();

    if (month.length === 1) {
      month = "0" + month; // Add leading zero if month is single digit
    }

    if (day.length === 1) {
      day = "0" + day; // Add leading zero if day is single digit
    }

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="mb-4.5 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b bg-gray-3 dark:bg-graydark border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-semibold text-black dark:text-white">
          Booking Dates and Travel Dates
        </h3>
      </div>
      <div className="flex flex-wrap py-6 px-6.5">
        {datesData.map((date, index) => (
          <div key={index} className="w-full p-2 mb-2 border border-body">
            <div className="flex justify-between">
              <h3>Dates {index + 1}</h3>
              <button
                type="button"
                className="px-6 py-2 text-white rounded-sm bg-danger hover:bg-danger focus:outline-none"
                onClick={() => handleRemoveDate(index)}
              >
                Remove
              </button>
            </div>
            {date && (
              <DateInput
                required={true}
                label="Booking From"
                value={date.bookingFromDate || ""}
                minDate={getCurrentDate()}
                onChange={(e) => handleDateChange(index, "bookingFromDate", e)}
              />
            )}
            {date && (
              <DateInput
                required={true}
                label="Booking To"
                value={date.bookingToDate || ""}
                minDate={getCurrentDate()}
                onChange={(e) => handleDateChange(index, "bookingToDate", e)}
              />
            )}

            <div className="mt-2 border bg-whiten border-body">
              <div className="flex justify-between p-2 bg-bodydark1">
                <label>Travel Dates</label>
                <button
                  type="button"
                  className="px-6 py-2 text-white rounded-sm bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => handleAddTravelDate(index)}
                >
                  Add Travel Date
                </button>
              </div>
              {date.travelDates.map((travelDate, travelIndex) => (
                <div
                  key={travelIndex}
                  className="p-2 mx-2 mt-2 border border-b-graydark"
                >
                  <DateInput
                    label="From"
                    required={true}
                    value={travelDate.fromDate || ""}
                    minDate={getCurrentDate()}
                    onChange={(e) =>
                      handleTravelDateChange(index, travelIndex, "fromDate", e)
                    }
                  />
                  <DateInput
                    label="To"
                    required={true}
                    value={travelDate.toDate || ""}
                    minDate={getCurrentDate()}
                    onChange={(e) =>
                      handleTravelDateChange(index, travelIndex, "toDate", e)
                    }
                  />
                  <button
                    type="button"
                    className="px-3 py-1 mt-2 text-white rounded bg-danger hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={() => handleRemoveTravelDate(index, travelIndex)}
                  >
                    Remove Date
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            className="px-6 py-2 mx-auto mt-4 text-white rounded-sm bg-meta-3 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"
            type="button"
            onClick={handleAddDate}
          >
            Add Dates
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatesDetailsSection;
