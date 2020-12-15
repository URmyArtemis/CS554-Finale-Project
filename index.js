const { ApolloServer, gql } = require('apollo-server');
const redis = require('redis');
const redisClient = redis.createClient();
const bluebird = require('bluebird');
const uuid = require('uuid');
const yelp = require('yelp-fusion');
const apiKey = 't0fVoVqzvxnLr24kh-D9tyOgSChqAblbdiYT79jivXb-RON1SR8CgOjp7wHeJHy_bv8OucEwe7cHe66AO7EyK1soEsnbEQJzrCBzCg8EO2DO8-hZglzKJnZP3CGaX3Yx';
const yelpClient = yelp.client(apiKey);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const typeDefs = gql`
    type Query {
        yelpBusinesses(term: String, location: String!): [Business]
        binnedBusinesses(uid: ID!): [Business]
        postedReviews(uid: ID!): [Review]
    }

    type Business {
        id: ID!
        alias: String!
        name: String!
        image_url: String
        rating: Float
        location: [String]
        display_phone: String
        price: String
        reviews: [Review]
    }

    type Review {
        id: ID!
        text: String
        rating: Int
        time_created: String!
        username: String!
    }

    type Mutation {
        uploadReview(businessAlias: String!, text: String!, rating: Int!, username: String!): Review
        updateReview(businessAlias: String!, id: ID!, text: String, rating: Int): Review
        deleteReview(businessAlias: String!, id: ID!): Review
        updateBusiness(id: ID!, binned: Boolean!): Business
    }
`;

const resolvers = {
    Query: {
        yelpBusinesses: async (_, args) => {
            try {
                const response = await yelpClient.search({ term: args.term, location: args.location });
                const { businesses } = response.jsonBody;
                return businesses.map(async (data) => {
                    if (await redisClient.existsAsync(data.id)) {
                        const stringBusiness = await redisClient.getAsync(data.id);
                        return JSON.parse(stringBusiness);
                    } else {
                        const business = {
                            id: data.id,
                            alias: data.alias,
                            name: data.name,
                            image_url: data.image_url,
                            rating: data.rating,
                            location: data.location.display_address,
                            display_phone: data.display_phone,
                            price: data.price
                        }
                        await redisClient.setAsync(data.id, JSON.stringify(businesses));
                        return business;
                    }
                });
            } catch (e) {
                console.log(e);
            }
        },
        binnedBusinesses: async (_, args) => {
            const businessIDs = await redisClient.smembersAsync(`${args.uid}binned`);
            return businessIDs.map(async (businessID) => {
                return await redisClient.getAsync(businessID);
            });
        },
        postedReviews: async (_, args) => {
            const reviews = await redisClient.smembersAsync(`${args.uid}posted`);
            return reviews.map((review) => {
                return JSON.parse(review);
            });
        }
    },
    Business: {
        reviews: async (parentValue) => {
            if (await redisClient.scardAsync(parentValue.alias)) {
                const reviews = await redisClient.smembersAsync(parentValue.alias);
                return reviews.map((review) => {
                    return JSON.parse(review);
                })
            } else {
                try {
                    const response = await yelpClient.reviews(parentValue.alias);
                    const { reviews } = response.jsonBody;
                    return reviews.map(async (data) => {
                        const review = {
                            id: data.id,
                            text: data.text,
                            rating: data.rating,
                            time_created: data.time_created,
                            username: data.user.name
                        }
                        await redisClient.saddAsync(parentValue.alias, JSON.stringify(review));
                        return review;
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        }
    },
    Mutation: {
        uploadReview: async (_, args) => {
            const myDate = new Date();
            const newReview = {
                id: uuid.v4(),
                text: args.text,
                rating: args.rating,
                time_created: myDate.toLocaleString(),
                username: args.uid
            }
            await redisClient.saddAsync(args.businessAlias, JSON.stringify(newReview));
            await redisClient.saddAsync(`${args.uid}posted`, JSON.stringify(newReview));
            return newReview;
        },
        updateReview: async (_, args) => {
            let myDate = new Date();
            let updatedReview = {};
            const privateReviews = await redisClient.smembersAsync(`${args.uid}posted`);
            privateReviews.map(async (string) => {
                let review = JSON.parse(string);
                if (review.id === args.id) {
                    updatedReview = review;
                    await redisClient.sremAsync(args.businessAlias, string);
                    await redisClient.sremAsync(`${args.uid}posted`, string);
                    if (args.text) {
                        updatedReview.text = args.text;
                    }
                    if (args.rating) {
                        updatedReview.rating = args.rating;
                    }
                    updatedReview.time_created = myDate.toLocaleString();
                    await redisClient.saddAsync(args.businessAlias, JSON.stringify(updatedReview));
                    await redisClient.saddAsync(`${args.uid}posted`, JSON.stringify(updatedReview));
                }
                return review;
            });
            return updatedReview;
        },
        deleteReview: async (_, args) => {
            let deletedReview = {};
            const privateReviews = await redisClient.smembersAsync(`${args.uid}posted`);
            privateReviews.map(async (string) => {
                let review = JSON.parse(string);
                if (review.id === args.id) {
                    deletedReview = review;
                    await redisClient.sremAsync(args.businessAlias, string);
                    await redisClient.sremAsync(`${args.uid}posted`, string);
                }
                return review;
            });
            return deletedReview;
        },
        updateBusiness: async (_, args) => {
            if (args.binned) {
                await redisClient.saddAsync(`${args.uid}binned`, args.id);
            } else {
                await redisClient.sremAsync(`${args.uid}binned`, args.id);
            }
            return await redisClient.getAsync(args.id);
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url} 🚀`);
});
