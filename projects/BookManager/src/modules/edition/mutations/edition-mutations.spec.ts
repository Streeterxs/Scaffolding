import { databaseTestModule } from '../../../tests/database';

import { mutationsRequestBaseModule } from '../../../tests/mutations';
import { testsLogger } from '../../../tests/testsLogger';

const log = testsLogger.extend('editionMutations');

describe('edition mutations', () => {

    let bookId: string;
    let authorId: string;

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, createBook, createEdition, editEdition, changeBookEdition } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    beforeEach(async () => {

        const authorGraphqlReturn = await (await createAuthor('New Author')).body;
        log(authorGraphqlReturn);

        const bookGraphqlReturn = await createBook({name:'New Book', author: `${authorGraphqlReturn.data.AuthorCreation.author.id}`, categories: []});

        log(bookGraphqlReturn.body);
        bookId = bookGraphqlReturn.body.data.BookCreation.book.cursor;
        authorId = `${authorGraphqlReturn.data.AuthorCreation.author.id}`;
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

    it('should change a edition properties', async () => {

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

        const {id: editionId} = editionResponse.body.data.EditionCreation.edition.node;

        const editEditionObj = {
            edition: 2,
            publishing: 'Edited Publishing',
            year: 1995,
            language: 'Portuguese'
        };

        const editEditionResponse = await editEdition({
            editionIdentifier: editionId,
            ...editEditionObj
        });

        log('editEditionResponse.body: ', editEditionResponse.body);
        expect(editEditionResponse.status).toBe(200);
        expect(editEditionResponse.body.data.EditEdition).toBeTruthy();
        log('editEditionResponse.body: ', editEditionResponse.body.data.EditEdition.edition.edition);
        expect(editEditionResponse.body.data.EditEdition.edition.edition).toBe(editEditionObj.edition);
        expect(editEditionResponse.body.data.EditEdition.edition.publishing).toBe(editEditionObj.publishing);
        expect(editEditionResponse.body.data.EditEdition.edition.year).toBe(editEditionObj.year);
        expect(editEditionResponse.body.data.EditEdition.edition.language).toBe(editEditionObj.language);
        expect(editEditionResponse.body.data.EditEdition.edition.pages).toBe(1000);
    });

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
        expect(editionResponse.body.data.EditionCreation).toBeTruthy();

        const bookResponse = await createBook({name: 'New New Book', author: authorId, categories: []});

        expect(bookResponse.status).toBe(200);
        expect(bookResponse.body.data.BookCreation).toBeTruthy();

        const newBookId = bookResponse.body.data.BookCreation.book.cursor;
        const editionId = editionResponse.body.data.EditionCreation.edition.cursor;

        const changeBookEditionResponse = await changeBookEdition({edition: editionId, book: newBookId});

        log('changeBookEditionResponse.body: ', changeBookEditionResponse.body);

        expect(changeBookEditionResponse.status).toBe(200);
        expect(changeBookEditionResponse.body.data.ChangeBookEdition).toBeTruthy();
        expect(changeBookEditionResponse.body.data.ChangeBookEdition.edition.book.id).toBe(newBookId);
        expect(changeBookEditionResponse.body.data.ChangeBookEdition.lastBook.id).toBe(bookId);

    });
});
