import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";

import { BookType } from "../BookType";
import { loadBook } from "../BookLoader";

import { loadAuthor } from "../../author/AuthorLoader";
import AuthorType from "../../author/AuthorType";

import { testsLogger } from "../../../tests/testsLogger";
import { appLogger } from "../../../appLogger";

let log;

if (process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:book:mutations:changeAuthor');
} else {

    log = appLogger.extend('modules:book:mutations:changeAuthor');
}

const BookChangeAuthor = mutationWithClientMutationId({
    name: 'BookChangeAuthor',
    description: 'A mutation to change author from a book to another',
    inputFields: {
        author: {
            type: new GraphQLNonNull(GraphQLString)
        },
        book: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        book: {
            type: BookType,
            resolve: (bookIdObj: {bookId: string}) => {

                if (!bookIdObj.bookId) {
                    return null;
                }

                return loadBook(bookIdObj.bookId)
            }
        },
        author: {
            type: AuthorType,
            resolve: (authorIdObj: {authorId: string}) => {

                if (!authorIdObj.authorId) {
                    return null;
                }

                return loadAuthor(authorIdObj.authorId);
            }
        },
        lastAuthor: {
            type: AuthorType,
            resolve: (lastAuthorIdObj: {lastAuthorId: string}) => {

                if (!lastAuthorIdObj.lastAuthorId) {
                    return null;
                }

                return loadAuthor(lastAuthorIdObj.lastAuthorId);
            }}
    },
    mutateAndGetPayload: async ({author, book}) => {

        try {

            const {id: bookId} = fromGlobalId(book);
            const {id: authorId} = fromGlobalId(author);

            const bookFinded = await loadBook(bookId);
            const lastAuthor = await loadAuthor(bookFinded.author);

            const indexOfTheBook = lastAuthor.books.indexOf(bookId);
            if (indexOfTheBook >= 0) {

                (await lastAuthor).books.splice(indexOfTheBook, 1)
                await lastAuthor.save();
            }

            bookFinded.author = authorId;
            await bookFinded.save();

            const authorFinded = await loadAuthor(authorId);
            (await authorFinded).books.splice(0, 0, bookId);

            return {
                bookId,
                authorId,
                lastAuthorId: lastAuthor.id
            }
        } catch (err) {

            log('error: ', err);
        }
    }
});

export default BookChangeAuthor;
