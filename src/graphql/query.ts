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
      tag {
        id
        name
      }
    }
  }
`;
//

// Attractions

export const GET_ATTRACTIONS_QUERY = gql`
  query GetAttractions {
    getAttractions {
      id
      attractionTitle
      location
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

export const GET_ATTRACTION_QUERY = gql`
  query GetAttraction($getAttractionId: String!) {
    getAttraction(id: $getAttractionId) {
      id
      attractionTitle
      location
      price
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
    }
  }
`;
