import { databaseTestModule } from '../../../../tests/database';

import { mutationsRequestBaseModule } from '../../../../tests/mutations';
import { testsLogger } from '../../../../tests/testsLogger';

const log = testsLogger.extend('bookMutations');

describe('BookAddCategoryMutation', () => {

    let authorId: string;

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor, createBook, createCategory, addCategoryToBook } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    beforeEach(async () => {

        authorId = `${(await createAuthor('New Author To Book')).body.data.AuthorCreate.author.id}`;
        log('authorId: ', authorId);
    })

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should add category to a book', async () => {

        const categoryResponse = await createCategory('New Category');
        expect(categoryResponse.body.data.CategoryCreate).toBeTruthy();


        const bookResponse = await createBook({name: 'New Book', author: authorId, categories: []});
        expect(bookResponse.body.data.BookCreate).toBeTruthy();

        const {cursor: bookId} = bookResponse.body.data.BookCreate.book;
        const {cursor: categoryId} = categoryResponse.body.data.CategoryCreate.category;

        const addCategoryResponse = await addCategoryToBook(bookId, categoryId);

        expect(addCategoryResponse.status).toBe(200);
        expect(addCategoryResponse.body.data.BookAddCategory).toBeTruthy();
        expect(addCategoryResponse.body.data.BookAddCategory.book.categories.edges[0].node.id).toBe(categoryId);

    });
});
