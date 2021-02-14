import { databaseTestModule } from '../../../../tests/database';

import { mutationsRequestBaseModule } from '../../../../tests/mutations';
import { testsLogger } from '../../../../tests/testsLogger';

const log = testsLogger.extend('bookMutations');

describe('BookCreateMutation', () => {

    let authorId: string;

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, createBook } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    beforeEach(async () => {

        authorId = `${(await createAuthor('New Author To Book')).body.data.AuthorCreate.author.id}`;
        log('authorId: ', authorId);
    })

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new book', async () => {

        log('authorid: ', authorId);
        const objToCreateBook = {name: 'New Book', author: authorId, categories: []};
        log('objToCreateBook: ', objToCreateBook);
        const bookResponse = await createBook({name: 'New Book', author: authorId, categories: []});

        log('bookResponse body: ', bookResponse.body);
        expect(bookResponse.status).toBe(200);
        expect(bookResponse.body.data.BookCreate).toBeTruthy();
    });
});
