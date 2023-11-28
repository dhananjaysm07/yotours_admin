import HighlightsComponent from "./highlights-component";
import InclusionExclusionComponent from "./inclusion-exclusion-component";
import PhotosComponent from "./photos-component";
import ProductSummaryComponent from "./product-summary-component";

const SummaryDetailsSection = () => {
  return (
    <>
      <InclusionExclusionComponent />
      <ProductSummaryComponent />
      <HighlightsComponent/>
      <PhotosComponent/>
    </>
  );
};

export default SummaryDetailsSection;
