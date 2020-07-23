import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId, fromGlobalId } from 'graphql-relay';
import { BookConnection } from '../BookType';
import { loadBook } from '../BookLoader';
import Book from '../BookModel';
import { loadAuthor } from '../../author/AuthorLoader';

const BooksCreation = mutationWithClientMutationId({
    name: 'BooksCreation',
    description: 'Books Creation',
    inputFields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        author: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        book: {
            type: BookConnection.edgeType,
            resolve: (bookId: string) => {

                if (!bookId) {

                    return null;
                };

                return {
                    cursor: toGlobalId('Books', bookId),
                    node: loadBook(bookId)
                }
            }
        }
    },
    mutateAndGetPayload: async ({name, author}) => {
        try {

            const authorIdObj = fromGlobalId(author);

            const BooksCreated = new Book({name, author: authorIdObj.id});
            await BooksCreated.save();

            const findedAuthor = await loadAuthor(authorIdObj.id);

            (await findedAuthor).books.splice(0, 0, `${BooksCreated.id}`);
            await findedAuthor.save();

            return BooksCreated.id;
        } catch (err) {

            console.log(err);
        }
    }
});

export default BooksCreation;
