import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";

import { IAuthor } from "./AuthorModel";
import BookType from "../book/BookType";

const AuthorType = new GraphQLObjectType({
    name: 'AuthorType',
    description: 'Author Type',
    fields: {
        name: {
            type: GraphQLString,
            resolve: (author: IAuthor) => author.name
        },
        books: {
            type: GraphQLList(BookType),
            resolve: (author: IAuthor) => author.books
        },
        createdAt: {
            type: GraphQLString,
            resolve: (author: IAuthor) => author.createdAt
        },
        updatedAt: {
            type: GraphQLString,
            resolve: (author: IAuthor) => author.updatedAt
        }
    }
});

export default AuthorType;
