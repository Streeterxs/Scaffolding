import { databaseTestModule } from '../../../tests/database';

import { mutationsRequestBaseModule } from '../../../tests/mutations';
import { testsLogger } from '../../../tests/testsLogger';

const log = testsLogger.extend('categoryMutations');

describe('category mutations', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createCategory, changeCategoryName } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new category', async () => {

        const response = await createCategory('New Category');

        log('response body: ', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.CategoryCreate).toBeTruthy();
    });

    it('should change a category name', async () => {

        const categoryResponse = await createCategory('New Category');
        expect(categoryResponse.status).toBe(200);
        expect(categoryResponse.body.data.CategoryCreate).toBeTruthy();

        const newName = 'New Category Name';
        const {cursor: categoryId} = categoryResponse.body.data.CategoryCreate.category;

        const newCategoryNameResponse = await changeCategoryName({name: newName, category: categoryId});
        expect(newCategoryNameResponse.status).toBe(200);
        expect(newCategoryNameResponse.body.data.CategoryChangeName).toBeTruthy();
        expect(newCategoryNameResponse.body.data.CategoryChangeName.category.name).toBe(newName);
        expect(newCategoryNameResponse.body.data.CategoryChangeName.category.updatedAt).not.toBe(newName);
    });
});
