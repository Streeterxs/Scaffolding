import { databaseTestModule } from '../../../tests/database';

import { mutationsRequestBaseModule } from '../../../tests/mutations';

describe('category mutations', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createCategory } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new category', async () => {

        const response = await createCategory();

        console.log('response body: ', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.CategoryCreation).toBeTruthy();
    });
});
