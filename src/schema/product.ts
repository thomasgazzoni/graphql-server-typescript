import {
    GraphQLEnumType,
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt
} from 'graphql';

import { getProducts, addProduct } from '../db/products';

const productTypeEnum = new GraphQLEnumType({
    name: 'ProductType',
    description: 'Types of products',
    values: {
        FOOD: {
            value: 1,
            description: 'Food.',
        },
        DRINK: {
            value: 2,
            description: 'Drink',
        },
    }
});

const productType = new GraphQLObjectType({
    name: 'Product',
    description: 'Product belong to a user',
    fields: () => ({
        name: {
            type: GraphQLString,
            description: 'The name',
        },
        description: {
            type: GraphQLString,
            description: 'The description',
        },
        barcode: {
            type: GraphQLString,
            description: 'The description',
        },
        type: {
            type: new GraphQLList(productTypeEnum),
            description: 'Type of the product',
        },
    }),
});

const query = {
    products: {
        type: new GraphQLList(productType),
        args: {
            limit: {
                description: 'limit items in the results',
                type: GraphQLInt
            }
        },
        resolve: (root, { limit }) => getProducts(limit)
    },
};

const mutation = {
    addProduct: {
        type: productType,
        args: {
            name: {
                type: GraphQLString
            },
            description: {
                type: GraphQLString
            },
            barcode: {
                type: new GraphQLNonNull(GraphQLString)
            },
        },
        resolve: (obj, input) => addProduct(input)
    },
};

const subscription = {

};

export const ProductSchema = {
    query,
    mutation,
    subscription,
    types: [productType]
};
