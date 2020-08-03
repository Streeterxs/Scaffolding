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

    const { createAuthor, createBook, addBookToAuthor, changeAuthorName } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new author', async () => {

        const response = await createAuthor('New Author');

        log('response body: ', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.AuthorCreation).toBeTruthy();
    });

    it('should change author name', async () => {

        const createAuthorResponse = await createAuthor('New Author');
        log('createAuthorResponse body: ', createAuthorResponse.body);
        expect(createAuthorResponse.status).toBe(200);
        expect(createAuthorResponse.body.data.AuthorCreation).toBeTruthy();

        const {id: authorId, name, updatedAt} = createAuthorResponse.body.data.AuthorCreation.author;
        const newName = 'New Name';

        const changeAuthorNameResponse = await changeAuthorName(newName, authorId);
        log('changeAuthorNameResponse body: ', changeAuthorNameResponse.body);
        log('changeAuthorNameResponse body.data: ', changeAuthorNameResponse.body.data);
        expect(changeAuthorNameResponse.status).toBe(200);
        expect(changeAuthorNameResponse.body.data.ChangeAuthorName).toBeTruthy();
        expect(changeAuthorNameResponse.body.data.ChangeAuthorName.author.name).toBe(newName);
        expect(changeAuthorNameResponse.body.data.ChangeAuthorName.author.name).not.toBe(name);
        expect(changeAuthorNameResponse.body.data.ChangeAuthorName.author.updatedAt).not.toBe(updatedAt);
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
