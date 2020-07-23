import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { connectionDefinitions, globalIdField, connectionArgs, connectionFromArray } from "graphql-relay";

import { ICategory } from "./CategoryModel";
import { BookType, BookConnection } from "../book/BookType";
import { IBook } from "../book/BookModel";
import { loadBook } from "../book/BookLoader";
import { nodeInterface } from "../../interface/nodeDefinitions";

console.log('CategoryType: ');

const CategoryType = new GraphQLObjectType({
    name: 'CategoryType',
    description: 'Category Type',
    interfaces: [nodeInterface],
    fields: () => ({
        id: globalIdField('Category'),
        name: {
            type: GraphQLString,
            resolve: (category: ICategory) => category.name
        },
        books: {
            type: BookConnection.connectionType,
            args: connectionArgs,
            resolve: (category: ICategory, args) => {
                return connectionFromArray(category.books.map(loadBook), args);
            }
        },
        createdAt: {
            type: GraphQLString,
            resolve: (category: ICategory) => category.createdAt
        },
        updatedAt: {
            type: GraphQLString,
            resolve: (category: ICategory) => category.updatedAt
        }
    })
});

export const CategoryConnection =
    // TODO correct types
    // Don't use GraphQLNonNull or 'undefinedConnection' is created
    connectionDefinitions({name: 'Category', nodeType: CategoryType});

export default CategoryType;
