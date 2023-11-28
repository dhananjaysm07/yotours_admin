import { useState } from "react";
import { useGlobalStore } from "../../store/globalStore";

const PolicyFormTab = () => {
  const { cancellationPolicy, setCancellationPolicy } = useGlobalStore();
  const [showDescription, setShowDescription] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-9">
      {/* <!-- Contact Form --> */}
      <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b bg-primary border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-semibold text-white ">Policy Details</h3>
        </div>
       
          <div className="p-6.5">
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="applicable-radio"
                name="policy-option"
                value="applicable"
                checked={cancellationPolicy.option === "applicable"}
                onChange={(e) =>
                  setCancellationPolicy({
                    ...cancellationPolicy,
                    option: e.target.value,
                  })
                }
              />
              <label htmlFor="applicable-radio" className="ml-2">
                Applicable
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="not-applicable-radio"
                name="policy-option"
                value="not-applicable"
                checked={cancellationPolicy.option === "not-applicable"}
                onChange={(e) =>
                  setCancellationPolicy({
                    ...cancellationPolicy,
                    option: e.target.value,
                  })
                }
              />
              <label htmlFor="not-applicable-radio" className="ml-2">
                Not Applicable
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="non-refundable-radio"
                name="policy-option"
                value="non-refundable"
                checked={cancellationPolicy.option === "non-refundable"}
                onChange={(e) =>
                  setCancellationPolicy({
                    ...cancellationPolicy,
                    option: e.target.value,
                  })
                }
              />
              <label htmlFor="non-refundable-radio" className="ml-2">
                Non Refundable
              </label>
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-black dark:text-white"
              >
                Description:
              </label>
              <textarea
                id="description"
                value={cancellationPolicy.description}
                onChange={(e) =>
                  setCancellationPolicy({
                    ...cancellationPolicy,
                    description: e.target.value,
                  })
                }
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
      </div>
    </div>
  );
};

export default PolicyFormTab;
