import { databaseTestModule } from '../../../tests/database';

import { mutationsRequestBaseModule } from '../../../tests/mutations';
import { testsLogger } from '../../../tests/testsLogger';

const log = testsLogger.extend('authorMutations');

describe('author mutations', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, createBook, addBookToAuthor } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new author', async () => {

        const response = await createAuthor('New Author');

        log('response body: ', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.AuthorCreation).toBeTruthy();
    });

    it('should add book to a author', async () => {

        const authorResponse = await createAuthor('New Author');
        expect(authorResponse.body.data.AuthorCreation).toBeTruthy();
        const {id: authorId} = authorResponse.body.data.AuthorCreation.author;

        const bookResponse = await createBook({name: 'New Book', author: `${authorId}`, categories: []});
        expect(bookResponse.body.data.BookCreation).toBeTruthy();


        const {cursor: bookId} = bookResponse.body.data.BookCreation.book;

        const addBookResponse = await addBookToAuthor(authorId, bookId);

        log('addBookResponse: ', addBookResponse.body);

        expect(addBookResponse.status).toBe(200);
        expect(addBookResponse.body.data.AddBook).toBeTruthy();

        log('addBookResponse.body.data.AddBook.author.books: ', addBookResponse.body.data.AddBook.author.books);
        log('addBookResponse.body.data.AddBook.author.books.edges[0].node: ', addBookResponse.body.data.AddBook.author.books.edges[0].node);
        
        expect(addBookResponse.body.data.AddBook.author.books.edges[0].node.id).toBe(bookId);

    });
});
