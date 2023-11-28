export interface TourPackage {
  id:string;
  productTitle: string;
  productType: string;
  duration?: string;
}

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
