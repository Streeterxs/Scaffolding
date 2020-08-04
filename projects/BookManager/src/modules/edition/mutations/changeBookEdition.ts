import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";

import { BookType } from "../../book/BookType";
import { loadBook } from "../../book/BookLoader";

import EditionType from "../EditionType";
import { loadEdition } from "../EditionLoader";

import { appLogger } from "../../../appLogger";
import { testsLogger } from "../../../tests/testsLogger";

let log;

if (process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:edition:mutations:changeBookEdition');
} else {

    log = appLogger.extend('modules:edition:mutations:changeBookEdition');
}

const ChangeBookEdition = mutationWithClientMutationId({
    name: 'ChangeBookEdition',
    description: 'A mutation to change edition to another book',
    inputFields: {
        book: {
            type: new GraphQLNonNull(GraphQLString)
        },
        edition: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        edition: {
            type: EditionType,
            resolve: (editionIdObj: {editionId: string}) => {

                if (!editionIdObj.editionId) {

                    return null;
                }

                return loadEdition(editionIdObj.editionId);
            }
        },
        book: {
            type: BookType,
            resolve: (bookIdObj: {bookId: string}) => {

                if (!bookIdObj.bookId) {

                    return null;
                }

                return loadBook(bookIdObj.bookId);
            }
        },
        lastBook: {
            type: BookType,
            resolve: (lastBookIdObj: {lastBookId: string}) => {

                if (!lastBookIdObj.lastBookId) {
                    
                    return null;
                }

                return loadBook(lastBookIdObj.lastBookId);
            }
        }
    },
    mutateAndGetPayload: async ({book, edition}) => {

        try {

            const {id: editionId} = fromGlobalId(edition);
            const {id: bookId} = fromGlobalId(book);

            const editionFinded = await loadEdition(editionId);
            const lastBook = await loadBook(editionFinded.book);

            editionFinded.book = bookId;
            await editionFinded.save();

            const indexOfEdition = lastBook.editions.indexOf(editionId);
            if (indexOfEdition >= 0) {

                (await lastBook).editions.splice(indexOfEdition, 1);
                await lastBook.save();
            }

            const bookFinded = await loadBook(bookId);
            (await bookFinded).editions.splice(0, 0, editionId);
            await bookFinded.save();
            
            return {
                editionId,
                lastBookId: lastBook.id,
                bookId
            }
        } catch (err) {

            log('error: ', err);            
        }
    }
});

export default ChangeBookEdition;
