import { databaseTestModule } from '../../../tests/database';

describe('author mutations', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    beforeAll(() => connect());

    afterAll(() => closeDatabase());

    // it('should create new author', () => {});
});