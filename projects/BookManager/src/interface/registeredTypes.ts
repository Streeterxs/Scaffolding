import Author from "../modules/author/AuthorModel";
import Book from "../modules/book/BookModel";
import Edition from "../modules/edition/EditionModel";
import Category from "../modules/category/CategoryModel";

import { loadEdition } from "../modules/edition/EditionLoader";
import { loadBook } from "../modules/book/BookLoader";
import { loadCategory } from "../modules/category/CategoryLoader";
import { loadAuthor } from "../modules/author/AuthorLoader";


const registeredTypes = [
    {
        name: 'Author',
        qlType: 'AuthorType',
        dbType: Author,
        loader: loadAuthor
    },
    {
        name: 'Book',
        qlType: 'BookType',
        dbType: Book,
        loader: loadBook
    },
    {
        name: 'Edition',
        qlType: 'EditionType',
        dbType: Edition,
        loader: loadEdition
    },
    {
        name: 'Category',
        qlType: 'CategoryType',
        dbType: Category,
        loader: loadCategory
    }
]

export default registeredTypes;
