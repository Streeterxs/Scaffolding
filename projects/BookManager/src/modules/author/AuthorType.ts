import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { connectionDefinitions, globalIdField, connectionArgs, connectionFromArray } from "graphql-relay";

import { IAuthor } from "./AuthorModel";
import { BookConnection } from "../book/BookType";
import { loadBook } from "../book/BookLoader";
import { nodeInterface } from "../../interface/nodeDefinitions";

console.log('authortype');

const AuthorType = new GraphQLObjectType({
    name: 'AuthorType',
    description: 'Author Type',
    interfaces: [nodeInterface],
    fields: () => ({
        id: globalIdField('Author'),
        name: {
            type: GraphQLString,
            resolve: (author: IAuthor) => author.name
        },
        books: {
            type: BookConnection.connectionType,
            args: connectionArgs,
            resolve: (author: IAuthor, args) => {
                return connectionFromArray(author.books.map(loadBook), args);
            }
        },
        createdAt: {
            type: GraphQLString,
            resolve: (author: IAuthor) => author.createdAt
        },
        updatedAt: {
            type: GraphQLString,
            resolve: (author: IAuthor) => author.updatedAt
        }
    })
});

export const AuthorConnection =
    // TODO correct types
    // Don't use GraphQLNonNull or 'undefinedConnection' is created
    connectionDefinitions({name: 'Author', nodeType: AuthorType});

export default AuthorType;
