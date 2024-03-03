import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
    }
  }
`;

export const CREATE_PACKAGE_MUTATION = gql`
  mutation CreatePackage(
    $createPackageGeneralInput: CreatePackageGeneralInput!
  ) {
    createPackageGeneral(
      createPackageGeneralInput: $createPackageGeneralInput
    ) {
      id
    }
  }
`;

export const CREATE_ITENERARY_MUTATION = gql`
  mutation AddItineraryToPackage(
    $packageId: ID!
    $itineraryInput: [ItineraryInput!]!
  ) {
    addItineraryToPackage(
      packageId: $packageId
      itineraryInput: $itineraryInput
    )
  }
`;

export const UPDATE_PACKAGE_MUTATION = gql`
  mutation UpdatePackage(
    $updatePackageGeneralInput: CreatePackageGeneralInput!
  ) {
    updatePackageGeneral(
      updatePackageGeneralInput: $updatePackageGeneralInput
    ) {
      id
    }
  }
`;

export const DELETE_PACKAGE_MUTATION = gql`
  mutation DeletePackageGeneral($deletePackageGeneralId: String!) {
    deletePackageGeneral(id: $deletePackageGeneralId)
  }
`;

// TAGS

export const CREATE_TAG_MUTATION = gql`
  mutation CreateTag($createTagDto: CreateTagDTO!) {
    createTag(createTagDto: $createTagDto) {
      id
      name
      active
    }
  }
`;

// Mutation to update the tag's active status
export const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTag($updateTagDto: UpdateTagDTO!) {
    updateTag(updateTagDto: $updateTagDto) {
      active
      id
      name
    }
  }
`;

export const DEACTIVATE_TAG_MUTATION = gql`
  mutation DeactivateTag($tagId: String!) {
    deactivateTag(tagId: $tagId) {
      active
      id
      name
    }
  }
`;

export const ACTIVATE_TAG_MUTATION = gql`
  mutation ActivateTag($tagId: String!) {
    activateTag(tagId: $tagId) {
      active
      id
      name
    }
  }
`;

//Destinations
export const CREATE_DESTINATION_MUTATION = gql`
  mutation CreateDestination($createDestinationInput: CreateDestinationInput!) {
    createDestination(createDestinationInput: $createDestinationInput) {
      id
      destinationName
      bannerHeading
      bannerImage
      description
    }
  }
`;

//Update destination
export const UPDATE_DESTINATION_MUTATION = gql`
  mutation UpdateDestination($updateDestinationInput: UpdateDestinationInput!) {
    updateDestination(updateDestinationInput: $updateDestinationInput) {
      id
      destinationName
      bannerHeading
      bannerImage
      description
    }
  }
`;

//TOUR
export const CREATE_TOUR_MUTATION = gql`
  mutation CreateTour($createTourInput: CreateTourInput!) {
    createTour(createTourInput: $createTourInput) {
      id
      tourTitle
      location
      price
      tourBokunId
      images {
        id
        imageUrl
      }
    }
  }
`;

//UPDATE TOUR
export const UPDATE_TOUR_MUTATION = gql`
  mutation UpdateTour($updateTourInput: UpdateTourInput!) {
    updateTour(updateTourInput: $updateTourInput) {
      id
      tourTitle
      location
      price
      tourBokunId
      images {
        id
        imageUrl
      }
    }
  }
`;
export const DELETE_TOUR_MUTATION = gql`
  mutation DeleteTour($deleteTourId: String!) {
    deleteTour(id: $deleteTourId) {
      id
    }
  }
`;

export const ACTIVATE_TOUR_MUTATION = gql`
  mutation ActivateTour($activateTourId: String!) {
    activateTour(id: $activateTourId) {
      id
    }
  }
`;

// /ATT

export const CREATE_ATTRACTION_MUTATION = gql`
  mutation CreateAttraction($createAttractionInput: CreateAttractionInput!) {
    createAttraction(createAttractionInput: $createAttractionInput) {
      id
      attractionTitle
      attractionBokunId
      attractionHyperlink
      location
      price
      images {
        id
        imageUrl
      }
    }
  }
`;

export const UPDATE_ATTRACTION_MUTATION = gql`
  mutation UpdateAttraction($updateAttractionInput: UpdateAttractionInput!) {
    updateAttraction(updateAttractionInput: $updateAttractionInput) {
      id
      attractionTitle
      attractionBokunId
      location
      price
      images {
        id
        imageUrl
      }
    }
  }
`;

export const DELETE_ATTRACTION_MUTATION = gql`
  mutation DeleteAttraction($deleteAttractionId: String!) {
    deleteAttraction(id: $deleteAttractionId) {
      id
    }
  }
`;

export const ACTIVATE_ATTRACTION_MUTATION = gql`
  mutation ActivateAttraction($activateAttractionId: String!) {
    activateAttraction(id: $activateAttractionId) {
      id
    }
  }
`;

export const CREATE_THING_MUTATION = gql`
  mutation CreateThing($createThingInput: CreateThingInput!) {
    createThing(createThingInput: $createThingInput) {
      id
      thingTitle
      thingDescription
      thingHyperlink
      images {
        id
        imageUrl
      }
    }
  }
`;

export const CREATE_CAR_MUTATION = gql`
  mutation CreateCar($createCarInput: CreateCarInput!) {
    createCar(createCarInput: $createCarInput) {
      id
      carTitle
      carDescription
      carHyperlink
      images {
        id
        imageUrl
      }
    }
  }
`;

export const UPDATE_THING_MUTATION = gql`
  mutation UpdateThing($updateThingInput: UpdateThingInput!) {
    updateThing(updateThingInput: $updateThingInput) {
      id
      thingTitle
      thingDescription
      thingHyperlink
      images {
        id
        imageUrl
      }
    }
  }
`;

export const UPDATE_CAR_MUTATION = gql`
  mutation UpdateCar($updateCarInput: UpdateCarInput!) {
    updateCar(updateCarInput: $updateCarInput) {
      id
      carTitle
      carDescription
      carHyperlink
      images {
        imageUrl
      }
    }
  }
`;

export const DELETE_THING_MUTATION = gql`
  mutation DeleteThing($deleteThingId: String!) {
    deleteThing(id: $deleteThingId) {
      id
    }
  }
`;

export const DELETE_CAR_MUTATION = gql`
  mutation DeleteCar($deleteCarId: String!) {
    deleteCar(id: $deleteCarId) {
      id
    }
  }
`;

export const ACTIVATE_THING_MUTATION = gql`
  mutation ActivateThing($activateThingId: String!) {
    activateThing(id: $activateThingId) {
      id
    }
  }
`;

export const ACTIVATE_CAR_MUTATION = gql`
  mutation ActivateCar($activateCarId: String!) {
    activateCar(id: $activateCarId) {
      id
    }
  }
`;

export const CREATE_CONTENT_MUTATION = gql`
  mutation CreateContent($createContentInput: CreateContentInput!) {
    createContent(createContentInput: $createContentInput) {
      id
      heroHeading
      heroImage
      footerLinks
      footerLogo
      socialLinks
    }
  }
`;
export const UPDATE_CONTENT_MUTATION = gql`
  mutation UpdateContent($updateContentInput: UpdateContentInput!) {
    updateContent(updateContentInput: $updateContentInput) {
      id
      heroHeading
      heroImage
      footerLinks
      footerLogo
      socialLinks
      tnc
    }
  }
`;
