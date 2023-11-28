import React from "react";
import { useGlobalStore } from "../../store/globalStore";
interface Step {
  label: string;
}

interface StepProgressBarProps {
  steps: Step[];
}
const StepProgressBar: React.FC<StepProgressBarProps> = ({ steps }) => {
  const { activeStep } = useGlobalStore();

  return (
    <ol className="items-center hidden w-full p-3 my-2 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
      {steps.map((step, index) => (
        <li key={index} className="flex items-center">
          <span
            className={`flex items-center text-white justify-center w-5 h-5 mr-2 text-xs border ${
              index <= activeStep ? "bg-primary" : "bg-body"
            } rounded-full shrink-0`}
          >
            {index + 1}
          </span>
          <span
            className={`font-medium ${
              index <= activeStep ? "text-primary" : "text-graydark"
            }`}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <svg
              aria-hidden="true"
              className={`w-4 h-4 ml-2 sm:ml-4 ${
                index < activeStep ? "text-primary" : "text-graydark"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              ></path>
            </svg>
          )}
        </li>
      ))}
    </ol>
  );
};

export default StepProgressBar;
