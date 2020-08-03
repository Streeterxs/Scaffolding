import { databaseTestModule } from '../../../tests/database';

import { mutationsRequestBaseModule } from '../../../tests/mutations';
import { testsLogger } from '../../../tests/testsLogger';

const log = testsLogger.extend('authorMutations');

describe('book mutations', () => {

    let authorId: string;

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, createBook, createCategory, addCategoryToBook } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    beforeEach(async () => {

        authorId = (await createAuthor('New Author To Book')).body.data.AuthorCreation.author.id;
        log('authorId: ', authorId);
    })

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new book', async () => {

        const bookResponse = await createBook(authorId);

        expect(bookResponse.status).toBe(200);
        expect(bookResponse.body.data.BookCreation).toBeTruthy();
    });

    it('should add category to a book', async () => {

        const categoryResponse = await createCategory('New Category');
        expect(categoryResponse.body.data.CategoryCreation).toBeTruthy();


        const bookResponse = await createBook(authorId);
        expect(bookResponse.body.data.BookCreation).toBeTruthy();

        const {cursor: bookId} = bookResponse.body.data.BookCreation.book;
        const {cursor: categoryId} = categoryResponse.body.data.CategoryCreation.category;

        const addCategoryResponse = await addCategoryToBook(bookId, categoryId);

        expect(addCategoryResponse.status).toBe(200);
        expect(addCategoryResponse.body.data.AddCategory).toBeTruthy();
        expect(addCategoryResponse.body.data.AddCategory.book.categories.edges[0].node.id).toBe(categoryId);

    });
});
