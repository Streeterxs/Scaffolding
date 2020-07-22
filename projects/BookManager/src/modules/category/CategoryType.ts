import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLFloat } from "graphql";

import { ICategory } from "./CategoryModel";

const CategoryType = new GraphQLObjectType({
    name: 'CategoryType',
    description: 'Category Type',
    fields: {
        name: {
            type: GraphQLString,
            resolve: (category: ICategory) => category.name
        },
        count: {
            type: GraphQLFloat,
            resolve: (category: ICategory) => category.count
        },
        createdAt: {
            type: GraphQLString,
            resolve: (category: ICategory) => category.createdAt
        },
        updatedAt: {
            type: GraphQLString,
            resolve: (category: ICategory) => category.updatedAt
        }
    }
});

export default CategoryType;
