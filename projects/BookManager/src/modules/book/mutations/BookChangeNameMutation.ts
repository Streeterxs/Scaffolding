import { mutationWithClientMutationId, fromGlobalId } from "graphql-relay";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { loadBook } from "../BookLoader";
import { testsLogger } from "../../../tests/testsLogger";
import { appLogger } from "../../../appLogger";
import { BookType } from "../BookType";

let log;
if (process.env.JEST_WORKER_ID) {
    log = testsLogger.extend('modules:book:mutations:changeName');
} else {
    log = appLogger.extend('modules:book:mutations:changeName')
}

const ChangeBookName = mutationWithClientMutationId({
    name: 'ChangeBookName',
    description: 'A mutation to change a book name',
    inputFields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        book: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        book: {
            type: BookType,
            resolve: (bookIdObj: {id: string}) => {

                if (!bookIdObj.id) {
                    return null
                }
                log('bookIdObj: ', bookIdObj);
                return loadBook(bookIdObj.id);
            }
        }
    },
    mutateAndGetPayload: async ({name, book}) => {
        try {
            log('book: ', book);

            const {id: bookId} = fromGlobalId(book);
            log('bookId: ', bookId);

            const bookFinded = await loadBook(bookId);
            bookFinded.name = name;
            await bookFinded.save();

            return {id: bookId};
        } catch(err) {

            log('error: ', err);
        }
    }
});

export default ChangeBookName;
