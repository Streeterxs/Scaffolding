import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";

import EditionType from "../edition/EditionType";
import AuthorType from "../author/AuthorType";
import CategoryType from "../category/CategoryType";

import { IBook } from "./BookModel";
import { ICategory } from "../category/CategoryModel";
import { IEdition } from "../edition/EditionModel";

import { loadCategory } from "../category/CategoryLoader";
import { loadEdition } from "../edition/EditionLoader";
import { loadAuthor } from "../author/AuthorLoader";

const BookType = new GraphQLObjectType({
    name: 'BookType',
    description: 'Covid Position',
    fields: {
        name: {
            type: GraphQLString,
            resolve: (book: IBook) => book.name
        },
        author: {
            type: AuthorType,
            resolve: async (book: IBook) => (await loadAuthor(book.author))
        },
        categories: {
            type: GraphQLList(CategoryType),
            resolve: async (book: IBook) => {

                const categoryList: ICategory[] = [];

                for (const categoryId in book.categories) {
                    if (book.categories.hasOwnProperty(categoryId)) {

                        categoryList.push(await loadCategory(categoryId));
                    }
                }

                return categoryList;
            }
        },
        editions: {
            type: GraphQLList(EditionType),
            resolve: async (book: IBook) => {

                const editionList: IEdition[] = [];

                for (const editionId in book.editions) {
                    if (book.editions.hasOwnProperty(editionId)) {

                        editionList.push(await loadEdition(editionId));
                    }
                }

                return editionList;
            }
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
