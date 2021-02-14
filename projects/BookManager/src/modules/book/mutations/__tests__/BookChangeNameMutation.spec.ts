import { databaseTestModule } from '../../../../tests/database';

import { mutationsRequestBaseModule } from '../../../../tests/mutations';
import { testsLogger } from '../../../../tests/testsLogger';

const log = testsLogger.extend('bookMutations');

describe('BookChangeNameMutation', () => {

    let authorId: string;

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, createBook, changeBookName } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    beforeEach(async () => {

        authorId = `${(await createAuthor('New Author To Book')).body.data.AuthorCreate.author.id}`;
        log('authorId: ', authorId);
    })

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should change a book name', async () => {

        const bookResponse = await createBook({name: 'New Book', author: authorId, categories: []});
        expect(bookResponse.status).toBe(200);
        expect(bookResponse.body.data.BookCreate).toBeTruthy();
        log('bookResponse change book name: ', bookResponse.body.data.BookCreate);

        const newName = 'New Book Name';
        const {id: bookId} = bookResponse.body.data.BookCreate.book.node;

        const changeBookNameResponse = await changeBookName({name: newName, book: bookId});
        log(changeBookNameResponse.body)
        expect(changeBookNameResponse.status).toBe(200);
        expect(changeBookNameResponse.body.data.BookChangeName).toBeTruthy();
        expect(changeBookNameResponse.body.data.BookChangeName.book.name).toBe(newName);
        expect(changeBookNameResponse.body.data.BookChangeName.book.updatedAt).not.toBe(bookResponse.body.data.BookCreate.book.updatedAt);
    });
});
