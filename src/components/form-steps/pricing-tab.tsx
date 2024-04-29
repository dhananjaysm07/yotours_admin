import React from "react";
import { UPDATE_PRICING_MUTATION } from "../../graphql/mutations";
import { useGlobalStore } from "../../store/globalStore";
import CustomSelect, { OptionType } from "../common/CustomSelect";
import { useMutation } from "@apollo/client";

const PricingFormTab = () => {
  const { pricing, setPricing, activeStep, setActiveStep, packageId } =
    useGlobalStore();
  const [updatePricing, { data, loading, error }] = useMutation(
    UPDATE_PRICING_MUTATION
  );
  const currencyOptions = [
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "INR", value: "INR" },
  ];

  const pricingTypeOptions = [
    { label: "Per Person", value: "perperson" },
    { label: "Per Group", value: "pergroup" },
  ];

  const handleAdultPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = validateNumericInput(e.target.value);
    setPricing("adultPrice", newValue === "" ? 0 : parseInt(newValue, 10));
  };
  // Input validation function to accept only numeric characters
  const validateNumericInput = (inputValue: string) => {
    const numericValue = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    return numericValue;
  };

  const handleChildPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = validateNumericInput(e.target.value);

    setPricing("childPrice", newValue === "" ? 0 : parseInt(newValue, 10));
  };

  const handleCurrencySelection = (selectedOption: OptionType[]) => {
    const currencyValue =
      selectedOption.length > 0 ? selectedOption[0].value : "";
    setPricing("currency", currencyValue);
  };

  const handlePricingTypeSelection = (selectedOption: OptionType[]) => {
    const typeValue = selectedOption.length > 0 ? selectedOption[0].value : "";
    setPricing("type", typeValue);
  };

  const handleMaxMembersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = validateNumericInput(e.target.value);

    setPricing("maxMembers", newValue === "" ? 0 : parseInt(newValue, 10));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("pricing", pricing);
    updatePricing({
      variables: {
        updatePricingId: packageId,
        input: {
          pricingData: pricing,
        },
      },
    });
    // setActiveStep(activeStep + 1);
  };
  React.useEffect(() => {
    if (!loading && data?.updatePricing) setActiveStep(activeStep + 1);
  }, [loading]);

  return (
    <>
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <form
          className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark"
          onSubmit={handleSubmit}
        >
          <div className="border-b bg-primary border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-semibold text-white ">Pricing Details</h3>
          </div>

          <div className="p-6.5">
            <div className="mb-4.5 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b bg-gray-3 dark:bg-graydark border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
                <h3 className="font-semibold text-black dark:text-white">
                  Pricing
                </h3>
              </div>

              <div className="p-6.5">
                <div className="w-full mb-3 sm:w-1/2">
                  <label className="block text-black dark:text-white">
                    Currency:
                  </label>
                  <CustomSelect
                    isMulti={false}
                    requiredField={true}
                    placeholder="Select currency"
                    options={currencyOptions}
                    value={[
                      {
                        label: pricing.currency,
                        value: pricing.currency,
                      },
                    ]}
                    onSelect={handleCurrencySelection}
                  />
                  {/* {errors.currency && <p className="p-2 text-danger">{errors.currency}</p>} */}
                </div>
                <div className="w-full mb-3 sm:w-1/2">
                  <label className="block text-black dark:text-white">
                    Pricing Type:
                  </label>
                  <CustomSelect
                    isMulti={false}
                    requiredField={true}
                    placeholder="Select pricing type"
                    options={pricingTypeOptions}
                    value={[{ label: pricing.type, value: pricing.type }]}
                    onSelect={handlePricingTypeSelection}
                  />
                  {/* {errors.pricingType && <p className="p-2 text-danger">{errors.pricingType}</p>} */}
                </div>
                {pricing.type.trim().toLowerCase() === "perperson" && (
                  <>
                    <div className="w-full mb-3 sm:w-1/2">
                      <label className="block text-black dark:text-white">
                        Adult Price:
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        placeholder="Enter adult price"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        name="adultPrice"
                        value={
                          pricing.adultPrice === 0
                            ? ""
                            : pricing.adultPrice.toString()
                        }
                        onChange={handleAdultPriceChange}
                      />
                    </div>
                    <div className="w-full mb-3 sm:w-1/2">
                      <label className="block text-black dark:text-white">
                        Child Price:
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        placeholder="Enter child price"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        name="childPrice"
                        value={
                          pricing.childPrice === 0
                            ? ""
                            : pricing.childPrice.toString()
                        }
                        onChange={handleChildPriceChange}
                      />
                    </div>
                  </>
                )}

                {pricing.type.trim().toLowerCase() == "pergroup" && (
                  <div className="w-full mb-3 sm:w-1/2">
                    <label className="block text-black dark:text-white">
                      Max Members:
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Enter max members"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      name="maxMembers"
                      value={
                        pricing.maxMembers === 0
                          ? ""
                          : pricing.maxMembers.toString()
                      }
                      onChange={handleMaxMembersChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end p-4 mt-1 space-x-2 bg-white">
            {/* Buttons for navigation, validation and submission can be added here */}
            {activeStep > 0 && (
              <button
                className="flex justify-center px-4 py-2 font-medium rounded-lg hover:bg-graydark bg-strokedark text-gray"
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex justify-center px-4 py-2 font-medium text-white rounded-lg bg-primary"
              disabled={loading}
            >
              Submit & Next
            </button>
            {error && error?.message}
          </div>
        </form>
      </div>
    </>
  );
};

export default PricingFormTab;
