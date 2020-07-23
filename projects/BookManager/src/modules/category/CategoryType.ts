import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";

import { ICategory } from "./CategoryModel";
import BookType from "../book/BookType";
import { IBook } from "../book/BookModel";
import { loadBook } from "../book/BookLoader";

const CategoryType = new GraphQLObjectType({
    name: 'CategoryType',
    description: 'Category Type',
    fields: {
        name: {
            type: GraphQLString,
            resolve: (category: ICategory) => category.name
        },
        books: {
            type: GraphQLList(BookType),
            resolve: async (category: ICategory) => {

                const bookList: IBook[] = [];

                for (const bookId in category.books) {
                    if (category.books.hasOwnProperty(bookId)) {

                        bookList.push(await loadBook(bookId));
                    }
                }

                return bookList;
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
    }
});

export default CategoryType;
