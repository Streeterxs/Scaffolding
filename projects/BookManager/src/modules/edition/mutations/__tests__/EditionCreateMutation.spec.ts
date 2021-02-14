import { databaseTestModule } from '../../../../tests/database';

import { mutationsRequestBaseModule } from '../../../../tests/mutations';
import { testsLogger } from '../../../../tests/testsLogger';

const log = testsLogger.extend('editionMutations');

describe('EditionCreateMutation', () => {

    let bookId: string;
    let authorId: string;

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, createBook, createEdition } = mutationsRequestBaseModule();

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
        expect(editionResponse.body.data.EditionCreate).toBeTruthy();
    });
});
