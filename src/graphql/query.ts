import { gql } from "@apollo/client";

export const GET_PACKAGES = gql`
  query GetPackages($page: Int!, $limit: Int!) {
    getPackages(pagination: { page: $page, limit: $limit }) {
      items {
        id
        productTitle
        productType
      }
      totalCount
    }
  }
`;

//TAGS

// Query to get the tags
export const GET_TAGS_QUERY = gql`
  query GetAllTags {
    getAllTags {
      active
      id
      name
    }
  }
`;

//DESTINATIONS

export const GET_DESTINATIONS_QUERY = gql`
  query GetDestinations {
    getDestinations {
      id
      destinationName
      description
      country
      continent
      isPopular
      bannerImage
      bannerHeading
      images {
        id
        imageUrl
      }
      tag {
        id
        name
      }
      fromDate
      toDate
      fromOccasion
      toOccasion
      introduction
      priority
    }
  }
`;
export const GET_DESTINATIONS_LIST_QUERY = gql`
  query GetDestinations {
    getDestinations {
      id
      destinationName
      description
      country
      continent
      isPopular
      bannerImage
      bannerHeading
      images {
        id
        imageUrl
      }
      tag {
        id
        name
      }
      fromDate
      toDate
      fromOccasion
      toOccasion
      introduction
      priority
    }
  }
`;
export const GET_FILTERED_DESTINATION = gql`
  query GetFilteredDestination(
    $page: Int!
    $loadCount: Int!
    $filter: TourFilterInput!
  ) {
    getFilteredDestination(
      page: $page
      loadCount: $loadCount
      filter: $filter
    ) {
      destinations {
        id
        destinationName
        description
        bannerImage
        isPopular
        continent
        country
        bannerHeading
        fromDate
        toDate
        fromOccasion
        toOccasion
        introduction
        images {
          id
          imageUrl
        }
        tours {
          id
        }
        attractions {
          id
        }

        priority
      }
      totalCount
    }
  }
`;

export const GET_SINGLE_DESTINATION = gql`
  query GetDestination($getDestinationId: String!) {
    getDestination(id: $getDestinationId) {
      id
      destinationName
      continent
      country
      bannerImage
      bannerHeading
      description
      isPopular
      fromDate
      toDate
      fromOccasion
      toOccasion
      images {
        id
        imageUrl
      }
      priority
      tag {
        id
        name
        active
      }
      tours {
        id
        tourTitle
        location
        active
        images {
          id
          imageUrl
        }
      }
      attractions {
        id
        attractionTitle
        location
        images {
          id
          imageUrl
        }
        active
      }
      introduction
      things {
        id
        thingTitle
        images {
          id
          imageUrl
        }
        active
      }
    }
  }
`;
//TOURS
export const GET_TOURS_QUERY = gql`
  query GetTours {
    getTours {
      id
      tourTitle
      tourHyperlink
      images {
        id
        imageUrl
      }
      location
      destination {
        id
        destinationName
      }
      price
      currency
      tourBokunId
      tag {
        id
        name
      }
      active
    }
  }
`;
//
export const GET_TOURS_LIST_QUERY = gql`
  query GetTours {
    getTours {
      id
      tourTitle
      tourHyperlink
      images {
        id
        imageUrl
      }
      location
      destination {
        id
        destinationName
      }
      price
      currency
      tourBokunId
      tag {
        id
        name
      }
      active
    }
  }
`;
// Attractions

export const GET_ATTRACTIONS_QUERY = gql`
  query GetAttractions {
    getAttractions {
      id
      attractionTitle
      location
      attractionBokunId
      attractionHyperlink
      price
      currency
      destination {
        id
        destinationName
      }
      images {
        id
        imageUrl
      }
      tag {
        id
        name
      }
    }
  }
`;

export const GET_FILTERED_TOURS = gql`
  query GetFilteredTours(
    $page: Int!
    $loadCount: Int!
    $filter: TourFilterInput!
  ) {
    getFilteredTours(page: $page, loadCount: $loadCount, filter: $filter) {
      tours {
        id
        tourTitle
        images {
          id
          imageUrl
        }
        tourHyperlink
        tourBokunId
        location
        destination {
          id
          destinationName
          fromDate
          toDate
        }
        price
        currency
        tag {
          id
          name
          active
        }
        active
      }
      totalCount
    }
  }
`;

export const GET_SINGLE_TOUR = gql`
  query FindOne($findOneId: String!) {
    findOne(id: $findOneId) {
      id
      tourTitle
      price
      currency
      location
      tourHyperlink
      tourBokunId
      active
      images {
        id
        imageUrl
      }
      tag {
        id
        name
        active
      }
      destination {
        id
        destinationName
        fromDate
        toDate
      }
    }
  }
`;

export const GET_ATTRACTION_QUERY = gql`
  query GetAttraction($getAttractionId: String!) {
    getAttraction(id: $getAttractionId) {
      id
      attractionTitle
      location
      price
      attractionBokunId
      destination {
        id
        destinationName
      }
      images {
        id
        imageUrl
      }
      tag {
        id
        name
      }
    }
  }
`;
export const GET_SINGLE_ATTRACTION = gql`
  query GetAttraction($getAttractionId: String!) {
    getAttraction(id: $getAttractionId) {
      id
      attractionTitle
      price
      currency
      location
      attractionBokunId
      attractionHyperlink
      active
      images {
        id
        imageUrl
      }
      tag {
        id
        name
        active
      }
      destination {
        id
        destinationName
        fromDate
        toDate
      }
    }
  }
`;
export const GET_FILTERED_ATTRACTIONs = gql`
  query GetFilteredAttractions(
    $page: Int!
    $loadCount: Int!
    $filter: TourFilterInput!
  ) {
    getFilteredAttractions(
      page: $page
      loadCount: $loadCount
      filter: $filter
    ) {
      attractions {
        id
        attractionTitle
        images {
          id
          imageUrl
        }
        location
        attractionBokunId
        attractionHyperlink
        destination {
          id
          destinationName
          continent
        }
        price
        currency
        tag {
          id
          name
          active
        }
        active
      }
      totalCount
    }
  }
`;

export const GET_FILTERED_THINGS = gql`
  query GetFilteredThings(
    $page: Int!
    $loadCount: Int!
    $filter: TourFilterInput!
  ) {
    getFilteredThings(page: $page, loadCount: $loadCount, filter: $filter) {
      things {
        id
        thingTitle
        thingDescription
        thingHyperlink
        destination {
          id
          destinationName
        }
        images {
          id
          imageUrl
        }
        tag {
          id
          name
        }
        active
      }
      totalCount
    }
  }
`;

export const GET_THINGS_QUERY = gql`
  query GetThings {
    getThings {
      id
      thingTitle
      thingDescription
      thingHyperlink
      destination {
        id
        destinationName
      }
      images {
        id
        imageUrl
      }
      tag {
        id
        name
      }
    }
  }
`;

export const GET_SINGLE_THING = gql`
  query GetThing($getThingId: String!) {
    getThing(id: $getThingId) {
      id
      thingTitle
      thingDescription
      thingHyperlink
      images {
        id
        imageUrl
      }
      tag {
        id
        name
        active
      }
      destination {
        id
        destinationName
        fromDate
        toDate
      }
      active
    }
  }
`;

//Get content Query
export const GET_CONTENT_QUERY = gql`
  query GetContent {
    getContent {
      id
      heroHeading
      heroSubheading
      heroImage
      footerLinks
      footerLogo
      socialLinks
      tnc
      privacy
      about
      agent
      bokunChannelId
      leftDiscountImage
      rightDiscountImage
    }
  }
`;

export const GET_COUNTRIES_CONTINENTS_QUERY = gql`
  query GetCountriesAndContinents {
    getCountriesAndContinents {
      country
      continent
      destinationCount
    }
  }
`;
