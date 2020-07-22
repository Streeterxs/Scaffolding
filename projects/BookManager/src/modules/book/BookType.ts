import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";

import { IBook } from "./BookModel";
import EditionType from "../edition/EditionType";

const BookType = new GraphQLObjectType({
    name: 'BookType',
    description: 'Covid Position',
    fields: {
        name: {
            type: GraphQLString,
            resolve: (book: IBook) => book.name
        },
        author: {
            type: GraphQLString,
            resolve: (book: IBook) => book.author
        },
        categories: {
            type: GraphQLList(GraphQLString),
            resolve: (book: IBook) => book.categories
        },
        editions: {
            type: GraphQLList(EditionType),
            resolve: (book: IBook) => book.editions
        },
        createdAt: {
            type: GraphQLString,
            resolve: (book: IBook) => book.createdAt
        },
        updatedAt: {
            type: GraphQLString,
            resolve: (book: IBook) => book.updatedAt
        }
    }
});

export default BookType;
