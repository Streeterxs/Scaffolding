import { GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { mutationWithClientMutationId, toGlobalId, fromGlobalId } from 'graphql-relay';

import Book from '../BookModel';
import { BookConnection } from '../BookType';
import { loadBook } from '../BookLoader';
import { loadAuthor } from '../../author/AuthorLoader';

import { testsLogger } from '../../../tests/testsLogger';
import { appLogger } from '../../../appLogger';

let log;
if(process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:book:mutations:createBook');
} else {

    log = appLogger.extend('modules:book:mutations:createBook');
}

const BooksCreation = mutationWithClientMutationId({
    name: 'BooksCreation',
    description: 'Books Creation',
    inputFields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        author: {
            type: new GraphQLNonNull(GraphQLString)
        },
        categories: {
            type: new GraphQLNonNull(GraphQLList(GraphQLString))
        }
    },
    outputFields: {
        book: {
            type: BookConnection.edgeType,
            resolve: async (bookIdObj: {id: string}) => {

                if (!bookIdObj.id) {

                    return null;
                };

                return {
                    cursor: toGlobalId('Book', bookIdObj.id),
                    node: await loadBook(bookIdObj.id)
                }
            }
        }
    },
    mutateAndGetPayload: async ({name, author, categories}) => {
        try {

            const authorIdObj = fromGlobalId(author);

            const categoriesList = categories.map(category => fromGlobalId(category));

            const BooksCreated = new Book({name, author: authorIdObj.id, categories: categoriesList});
            await BooksCreated.save();

            const findedAuthor = await loadAuthor(authorIdObj.id);

            (await findedAuthor).books.splice(0, 0, `${BooksCreated.id}`);
            await findedAuthor.save();

            return {id: BooksCreated.id};
        } catch (err) {

            log('error: ', err);
        }
    }
});

export default BooksCreation;
