import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { connectionDefinitions, globalIdField, connectionArgs, connectionFromArray } from "graphql-relay";

import { EditionConnection } from "../edition/EditionType";
import AuthorType from "../author/AuthorType";
import { CategoryConnection } from "../category/CategoryType";

import { IBook } from "./BookModel";

import { loadCategory } from "../category/CategoryLoader";
import { loadEdition } from "../edition/EditionLoader";
import { loadAuthor } from "../author/AuthorLoader";
import { nodeInterface } from "../../interface/nodeDefinitions";

const BookType = new GraphQLObjectType({
    name: 'BookType',
    description: 'Covid Position',
    interfaces: [nodeInterface],
    fields: () => ({
        id: globalIdField('Book'),
        name: {
            type: GraphQLString,
            resolve: (book: IBook) => book.name
        },
        author: {
            type: AuthorType,
            resolve: (book: IBook) => (loadAuthor(book.author))
        },
        categories: {
            type: CategoryConnection.connectionType,
            args: connectionArgs,
            resolve: (book: IBook, args) => {
                return connectionFromArray(book.categories.map(loadCategory), args);
            }
        },
        editions: {
            type: EditionConnection.connectionType,
            args: connectionArgs,
            resolve: (book: IBook, args) => {
                return connectionFromArray(book.editions.map(loadEdition), args);
            }
        },
        createdAt: {
            type: GraphQLString,
            resolve: (book: IBook) => book.createdAt
        },
        updatedAt: {
            type: GraphQLString,
            resolve: (book: IBook) => book.updatedAt
        },
    })
});

const BookConnection =
    // TODO correct types
    // Don't use GraphQLNonNull or 'undefinedConnection' is created
    connectionDefinitions({name: 'Book', nodeType: BookType});

console.log('booktype BookConnection: ', BookConnection);

export {BookType, BookConnection};
