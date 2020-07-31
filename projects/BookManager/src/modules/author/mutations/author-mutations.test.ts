import { databaseTestModule } from '../../../tests/database';

import { mutationsRequestBaseModule } from '../../../tests/mutations';

describe('author mutations', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const { createAuthor } = mutationsRequestBaseModule();

    beforeAll(() => connect());

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new author', async () => {

        const response = await createAuthor();

        console.log('response body: ', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.AuthorCreation).toBeTruthy();
    });
});
