import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import { BookType } from '../../book/BookType';
import { loadBook } from '../../book/BookLoader';

import { testsLogger } from '../../../tests/testsLogger';
import { appLogger } from '../../../appLogger';
import AuthorType from '../AuthorType';
import { loadAuthor } from '../AuthorLoader';

let log;
if(process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:book:mutations:addBook');
} else {

    log = appLogger.extend('modules:book:mutations:addBook');
}

const AddBook = mutationWithClientMutationId({
    name: 'AddBook',
    description: 'Add a Book to a Author',
    inputFields: {
        author: {
            type: new GraphQLNonNull(GraphQLString)
        },
        book: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        author: {
            type: AuthorType,
            resolve: async (authorIdObj: {id: string}) => {

                if (!authorIdObj.id) {

                    return null;
                };

                return await loadAuthor(authorIdObj.id);
            }
        }
    },
    mutateAndGetPayload: async ({author, book}) => {
        try {

            const {id: authorId} = fromGlobalId(author);
            const {id: bookId} = fromGlobalId(book);

            log('saved authorId: ', authorId);
            log('saved bookId: ', bookId);

            const foundedAuthor = await loadAuthor(authorId);
            (await foundedAuthor).books.splice(0, 0, bookId);
            await foundedAuthor.save();

            const findedBook = await loadBook(bookId);
            (await findedBook).author = authorId;
            await findedBook.save();

            return {id: authorId};
        } catch (err) {

            log('error add Book: ', err);
        }
    }
});

export default AddBook;
