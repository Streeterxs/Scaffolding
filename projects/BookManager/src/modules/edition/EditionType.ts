import { GraphQLObjectType, GraphQLString, GraphQLFloat } from "graphql";
import { IEdition } from "./EditionModel";
import BookType from "../book/BookType";
import { loadBook } from "../book/BookLoader";

const EditionType = new GraphQLObjectType({
    name: 'EditionType',
    description: 'Edition type',
    fields: {
        edition: {
            type: GraphQLString,
            resolve: (edition: IEdition) => edition.edition
        },
        publishing: {
            type: GraphQLFloat,
            resolve: (edition: IEdition) => edition.publishing
        },
        year: {
            type: GraphQLFloat,
            resolve: (edition: IEdition) => edition.year
        },
        pages: {
            type: GraphQLString,
            resolve: (edition: IEdition) => edition.pages
        },
        language: {
            type: GraphQLString,
            resolve: (edition: IEdition) => edition.language
        },
        book: {
            type: BookType,
            resolve: (edition: IEdition) => loadBook(edition.book)
        },
        createdAt: {
            type: GraphQLString,
            resolve: (edition: IEdition) => edition.createdAt
        },
        updatedAt: {
            type: GraphQLString,
            resolve: (edition: IEdition) => edition.updatedAt
        }
    }
});

export default EditionType;
