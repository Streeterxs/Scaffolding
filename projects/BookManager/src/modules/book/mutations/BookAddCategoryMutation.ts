import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import { BookType } from '../BookType';
import { loadBook } from '../BookLoader';
import { loadCategory } from '../../category/CategoryLoader';

import { testsLogger } from '../../../tests/testsLogger';
import { appLogger } from '../../../appLogger';

let log;
if(process.env.JEST_WORKER_ID) {

    log = testsLogger.extend('modules:book:mutations:addCategory');
} else {

    log = appLogger.extend('modules:book:mutations:addCategory');
}

const BookAddCategory = mutationWithClientMutationId({
    name: 'BookAddCategory',
    description: 'Add a Category to a Book',
    inputFields: {
        book: {
            type: new GraphQLNonNull(GraphQLString)
        },
        category: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        book: {
            type: BookType,
            resolve: async (bookIdObj: {id: string}) => {

                if (!bookIdObj.id) {

                    return null;
                };

                return await loadBook(bookIdObj.id);
            }
        }
    },
    mutateAndGetPayload: async ({book, category}) => {
        try {

            const {id: bookId} = fromGlobalId(book);
            const {id: categoryId} = fromGlobalId(category);

            log('saved bookId: ', bookId);
            log('saved categoryId: ', categoryId);

            const foundedBook = await loadBook(bookId);
            (await foundedBook).categories.splice(0, 0, categoryId);
            await foundedBook.save();

            const findedCategory = await loadCategory(categoryId);
            (await findedCategory).books.splice(0, 0, bookId);
            await findedCategory.save();

            return {id: bookId};
        } catch (err) {

            log('error add category: ', err);
        }
    }
});

export default BookAddCategory;
