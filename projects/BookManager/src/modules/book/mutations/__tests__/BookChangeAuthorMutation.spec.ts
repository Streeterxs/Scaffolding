import { databaseTestModule } from '../../../../tests/database';

import { mutationsRequestBaseModule } from '../../../../tests/mutations';
import { testsLogger } from '../../../../tests/testsLogger';

const log = testsLogger.extend('bookMutations');

describe('BookChangeAuthorMutation', () => {

    let authorId: string;

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, createBook, createCategory, addCategoryToBook, changeBookName, changeAuthorBook } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    beforeEach(async () => {

        authorId = `${(await createAuthor('New Author To Book')).body.data.AuthorCreate.author.id}`;
        log('authorId: ', authorId);
    })

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('Should change author from a book', async () => {

        log('authorid: ', authorId);
        const objToCreateBook = {name: 'New Book', author: authorId, categories: []};
        log('objToCreateBook: ', objToCreateBook);
        const bookResponse = await createBook({name: 'New Book', author: authorId, categories: []});

        log('bookResponse body: ', bookResponse.body);
        expect(bookResponse.status).toBe(200);
        expect(bookResponse.body.data.BookCreate).toBeTruthy();

        const newAuthorResponse = await createAuthor('New Author Name');
        expect(newAuthorResponse.status).toBe(200);
        expect(newAuthorResponse.body.data.AuthorCreate).toBeTruthy();

        const {id: newAuthorId} = newAuthorResponse.body.data.AuthorCreate.author;
        const {cursor: bookId} = bookResponse.body.data.BookCreate.book;

        const changeAuthorBookResponse = await changeAuthorBook({book: bookId, author: newAuthorId});
        log('changeAuthorBookResponse.body: ', changeAuthorBookResponse.body);
        expect(changeAuthorBookResponse.status).toBe(200);
        expect(changeAuthorBookResponse.body.data.BookChangeAuthor).toBeTruthy();
        expect(changeAuthorBookResponse.body.data.BookChangeAuthor.book.author.id).toBe(newAuthorId);
        expect(changeAuthorBookResponse.body.data.BookChangeAuthor.lastAuthor.id).toBe(authorId);
        expect(changeAuthorBookResponse.body.data.BookChangeAuthor.author.books.edges[0].node.id).toBe(bookId);
    });
});
