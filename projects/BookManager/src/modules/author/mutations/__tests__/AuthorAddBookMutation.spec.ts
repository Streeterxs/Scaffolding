import { databaseTestModule } from '../../../../tests/database';

import { mutationsRequestBaseModule } from '../../../../tests/mutations';
import { testsLogger } from '../../../../tests/testsLogger';

const log = testsLogger.extend('authorMutations');

describe('AuthorAddBookMutation', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, createBook, addBookToAuthor } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should add book to a author', async () => {

        const authorResponse = await createAuthor('New Author');
        expect(authorResponse.body.data.AuthorCreate).toBeTruthy();
        const {id: authorId} = authorResponse.body.data.AuthorCreate.author;

        const bookResponse = await createBook({name: 'New Book', author: `${authorId}`, categories: []});
        expect(bookResponse.body.data.BookCreate).toBeTruthy();


        log('bookId: ', bookResponse.body.data.BookCreate.book.node.id);
        const {cursor: bookId} = bookResponse.body.data.BookCreate.book;
        log('bookId: ', bookId);

        const addBookResponse = await addBookToAuthor(authorId, bookId);

        log('addBookResponse: ', addBookResponse.body);

        expect(addBookResponse.status).toBe(200);
        expect(addBookResponse.body.data.AuthorAddBook).toBeTruthy();

        log('addBookResponse.body.data.AuthorAddBook.author.books: ', addBookResponse.body.data.AuthorAddBook.author.books);
        log('addBookResponse.body.data.AuthorAddBook.author.books.edges[0].node: ', addBookResponse.body.data.AuthorAddBook.author.books.edges[0].node);

        expect(addBookResponse.body.data.AuthorAddBook.author.books.edges[0].node.id).toBe(bookId);

    });
});
