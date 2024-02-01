export interface TourPackage {
  id: string;
  productTitle: string;
  productType: string;
  duration?: string;
}

export type filterType = {
  priceMin: null | string;
  startDate: null | string;
  priceMax: null | string;
  location: null | string;
  endDate: null | string;
  continent: [string] | [];
  country: [string] | [];
  tagName: [string] | [];
};
//   interface TourPackage {
//     basicDetails: {
//       packageName: string;
//       destination: string;
//       startDate: Date;
//       endDate: Date;
//       // ... other fields
//     };
//     pricing: {
//       price: string;
//       discounts: {
//         earlyBird: boolean;
//         groupDiscount: boolean;
//         // ... other nested fields
//       };
//     };
//     images: {
//       coverImage: File;
//       gallery: File[];
//     };
//     // ... more nested objects for other steps
//   }
