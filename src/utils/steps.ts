type Step = {
  label: string;
};
function getSteps(): Step[] {
  return [
    { label: "1. General" },
    { label: "2. Itinerary" },
    { label: "3. Location" },
    { label: "4. Pricing" },
    { label: "5. Languages" },
    { label: "6. Policy" },
    // { label: "7. Preview" },
  ];
}

const steps = getSteps();

export { steps };
