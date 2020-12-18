import { gql } from "@apollo/client";

const GET_YELPBUSINESSES = gql`
    query ($term: String, $location: String!) {
        yelpBusinesses(term: $term, location: $location) {
            id
            alias
            name
            image_url
            rating
            location
            display_phone
            price
        }        
    }
`;

const GET_SINGLEBUSINESS = gql`
    query ($id: ID!) {
        singleBusiness(id: $id) {
            id
            alias
            name
            image_url
            rating
            location
            display_phone
            price
        }
    }
`;

const GET_BUSINESSREVIEWS = gql`
    query ($alias: String!) {
        businessReviews(alias: $alias) {
            id
            text
            rating
            time_created
            username
        }
    }
`;

const GET_BINNEDBUSINESSES = gql`
    query ($uid: ID!) {
        binnedBusinesses(uid: $uid) {
            id
            alias
            name
            image_url
            rating
            location
            display_phone
            price
        }
    }
`;

const GET_POSTEDREVIEWS = gql`
    query ($uid: ID!) {
        postedReviews(uid: $uid) {
            id
            text
            rating
            time_created
            username
        }
    }
`;

const UPLOAD_REVIEW = gql`
    mutation ($businessAlias: String!, $text: String!, $rating: Int!, $username: String!) {
        uploadReview(businessAlias: $businessAlias, text: $text, rating: $rating, username: $username) {
            id
            text
            rating
            time_created
            username
        }
    }
`;

const UPDATE_REVIEW = gql`
    mutation ($businessAlias: String!, $id: ID!, $text: String, $rating: Int) {
        updateReview(businessAlias: $businessAlias, id: $id, text: $text, rating: $rating) {
            id
            text
            rating
            time_created
            username
        }
    }
`;

const DELETE_REVIEW = gql`
    mutation ($businessAlias: String!, $id: ID!) {
        deleteReview(businessAlias: $businessAlias, id: $id) {
            id
            text
            rating
            time_created
            username
        }
    }
`;

const UPDATE_BUSINESS = gql`
    mutation ($id: ID!, $binned: Boolean!) {
        updateBusiness(id: $id, binned: $binned) {
            id
            alias
            name
            image_url
            rating
            location
            display_phone
            price
        }
    }
`;

export default {
    GET_YELPBUSINESSES,
    GET_SINGLEBUSINESS,
    GET_BUSINESSREVIEWS,
    GET_BINNEDBUSINESSES,
    GET_POSTEDREVIEWS,
    UPLOAD_REVIEW,
    UPDATE_REVIEW,
    DELETE_REVIEW,
    UPDATE_BUSINESS
}