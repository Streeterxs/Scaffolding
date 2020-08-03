import { databaseTestModule } from '../../../tests/database';

import { mutationsRequestBaseModule } from '../../../tests/mutations';
import { testsLogger } from '../../../tests/testsLogger';

const log = testsLogger.extend('authorMutations');

describe('edition mutations', () => {

    let bookId: string;

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, createBook, createEdition } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    beforeEach(async () => {

        const authorGraphqlReturn = await (await createAuthor('New Author')).body;

        const bookGraphqlReturn = await createBook(authorGraphqlReturn.data.AuthorCreation.author.id);

        bookId = bookGraphqlReturn.body.data.BookCreation.book.cursor;
    });

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new edition', async () => {

        const editionResponse = await createEdition({
            edition: 1,
            book: bookId,
            publishing: 'New Publishing',
            year: 1952,
            pages: 1000,
            language: 'English'
        });

        expect(editionResponse.status).toBe(200);
        expect(editionResponse.body.data.EditionCreation).toBeTruthy();
    });
});
