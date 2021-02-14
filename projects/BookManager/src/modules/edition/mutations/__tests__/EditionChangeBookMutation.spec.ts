import { databaseTestModule } from '../../../../tests/database';

import { mutationsRequestBaseModule } from '../../../../tests/mutations';
import { testsLogger } from '../../../../tests/testsLogger';

const log = testsLogger.extend('editionMutations');

describe('EditionChangeBookMutation', () => {

    let bookId: string;
    let authorId: string;

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, createBook, createEdition, changeBookEdition } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    beforeEach(async () => {

        const authorGraphqlReturn = await (await createAuthor('New Author')).body;
        log(authorGraphqlReturn);

        const bookGraphqlReturn = await createBook({name:'New Book', author: `${authorGraphqlReturn.data.AuthorCreate.author.id}`, categories: []});

        log(bookGraphqlReturn.body);
        bookId = bookGraphqlReturn.body.data.BookCreate.book.cursor;
        authorId = `${authorGraphqlReturn.data.AuthorCreate.author.id}`;
    });

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should change a edition from a book to another', async () => {

        const editionResponse = await createEdition({
            edition: 1,
            book: bookId,
            publishing: 'New Publishing',
            year: 1952,
            pages: 1000,
            language: 'English'
        });

        expect(editionResponse.status).toBe(200);
        expect(editionResponse.body.data.EditionCreate).toBeTruthy();

        const bookResponse = await createBook({name: 'New New Book', author: authorId, categories: []});

        expect(bookResponse.status).toBe(200);
        expect(bookResponse.body.data.BookCreate).toBeTruthy();

        const newBookId = bookResponse.body.data.BookCreate.book.cursor;
        const editionId = editionResponse.body.data.EditionCreate.edition.cursor;

        const changeBookEditionResponse = await changeBookEdition({edition: editionId, book: newBookId});

        log('changeBookEditionResponse.body: ', changeBookEditionResponse.body);

        expect(changeBookEditionResponse.status).toBe(200);
        expect(changeBookEditionResponse.body.data.EditionChangeBook).toBeTruthy();
        expect(changeBookEditionResponse.body.data.EditionChangeBook.edition.book.id).toBe(newBookId);
        expect(changeBookEditionResponse.body.data.EditionChangeBook.lastBook.id).toBe(bookId);

    });
});
