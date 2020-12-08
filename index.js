'use strict';
const { ApolloServer, gql } = require('apollo-server');
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
const yelp = require('yelp-fusion');

const apiKey = 't0fVoVqzvxnLr24kh-D9tyOgSChqAblbdiYT79jivXb-RON1SR8CgOjp7wHeJHy_bv8OucEwe7cHe66AO7EyK1soEsnbEQJzrCBzCg8EO2DO8-hZglzKJnZP3CGaX3Yx';
const yelpclient = yelp.client(apiKey);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const typeDefs = gql`
type Query {
    yelpPosts:[Post]
    userPosted : [Post]
}
type Post {
    id: ID!
    url: String
    name: String!
    rating: String
    price: String
    location: String
    phone: String!
}
type Mutation {
    upload(
        url: String
        name: String
        rating: String
        price: String
        location: String
        phone: String
    ):Post
    update(
        id: ID!
        url: String 
        name: String
        rating: String
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
    Query: {
        yelpPosts: async (_, args) => {
            try {
                const searchRequest = {
                    term: 'barber',
                    location: 'hoboken, nj'
                };
                let yelpPosts = null
                await yelpclient.search(searchRequest).then(response => {
                    const firstResult = response.jsonBody.businesses;
                    // const prettyJson = JSON.stringify(firstResult, null, 4);
                    // console.log(prettyJson);
                    yelpPosts = firstResult.map((Post) => ({
                        id: Post.id,
                        url: Post.url,
                        name: Post.name,
                        rating: Post.rating,
                        price: Post.price,
                        location: Post.location.address1 + ' ,' + Post.location.city + ' ,' + Post.location.state,
                        phone: Post.phone,
                    }));
                    console.log(yelpPosts);
                    // return yelpPosts
                    // const prettyJson = JSON.stringify(firstResult, null, 4);
                    // console.log(prettyJson);
                    // console.log(prettyJson);
                }).catch(e => {
                    console.log(e);
                });
                return yelpPosts
            } catch (error) {
                console.log(error)
            }
        },
        userPosted: async () => {
            let Posts = JSON.parse(await client.getAsync('posted')) || [];
            return Posts
        },
    },
    Mutation: {
        upload: async (_, args) => {
            let newPost = {
                id: uuid.v4(),
                url: args.url,
                name: args.name,
                rating: args.rating,
                price: args.price,
                location: args.location.address1 + args.location.city + args.location.state,
                phone: args.phone,
            }

            let Posts = JSON.parse(await client.getAsync('posted')) || [];
            Posts.push(newPost);
            await client.setAsync('posted', JSON.stringify(Posts));
            return newPost;

        },
        // update: async (_, args) => { 
        //     let Posts = JSON.parse(await client.getAsync('posted')) || [];

        // },
    }
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url} 🚀`);
});
