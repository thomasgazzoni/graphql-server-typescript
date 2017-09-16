import {
    GraphQLSchema,
    GraphQLObjectType,
} from 'graphql';

// Import each models schema
import { UserSchema } from './user';
import { ProductSchema } from './product';

export const graphqlSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: () => Object.assign(
            UserSchema.query,
            ProductSchema.query,
        )
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: () => Object.assign(
            UserSchema.mutation,
            ProductSchema.mutation,
        )
    }),
    // subscription: new GraphQLObjectType({
    //     name: 'Subscription',
    //     fields: () => Object.assign(
    //         UserSchema.subscription,
    //         ProductSchema.subscription,
    //     )
    // }),
    types: [
        ...ProductSchema.types,
        ...UserSchema.types,
    ]
});
