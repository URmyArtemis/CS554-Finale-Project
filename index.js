const { ApolloServer, gql } = require('apollo-server');
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const typeDefs = gql`
type Query {
    yelpPosts(pageNum: Int):[Post]
    userPosted : [Post]
  }

  type Post {
    id: ID!
    url: String!
    name: String!
    rating: Int!
    price: String!
    location: String!
    phone: String!
}
type Mutation {
    upload(
        url: String
        name: String
        rating: Int
        price: String
        location: String
        phone: String
    ):Post
    update(
        id: ID!
        url: String 
        name: String
        rating: Int
        price: String
        location: String
        phone: String
    ):Post
    delete(
        id: ID!
    ):Post
    
  }

`
const resolvers = {

};