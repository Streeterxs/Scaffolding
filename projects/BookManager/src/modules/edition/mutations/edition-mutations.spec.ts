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
        expect(editionResponse.body.data.EditionCreate).toBeTruthy();

        const {id: editionId} = editionResponse.body.data.EditionCreate.edition.node;

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
        expect(editEditionResponse.body.data.EditionEdit).toBeTruthy();
        log('editEditionResponse.body: ', editEditionResponse.body.data.EditionEdit.edition.edition);
        expect(editEditionResponse.body.data.EditionEdit.edition.edition).toBe(editEditionObj.edition);
        expect(editEditionResponse.body.data.EditionEdit.edition.publishing).toBe(editEditionObj.publishing);
        expect(editEditionResponse.body.data.EditionEdit.edition.year).toBe(editEditionObj.year);
        expect(editEditionResponse.body.data.EditionEdit.edition.language).toBe(editEditionObj.language);
        expect(editEditionResponse.body.data.EditionEdit.edition.pages).toBe(1000);
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
