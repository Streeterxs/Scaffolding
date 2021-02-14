import { databaseTestModule } from "../../../../tests/database";
import { testsLogger } from "../../../../tests/testsLogger";

import { personMutationsRequestModule } from "../../../../tests/mutations/person";

const log = testsLogger.extend('personMutations');

describe('PersonCreateMutation', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const {
        createPerson,
        personResetUsers,
    } = personMutationsRequestModule();

    beforeAll(() => connect());
    afterEach(async () => {
        personResetUsers();
        await clearDatabase();
    });
    afterAll(() => closeDatabase());

    it('should create a new person', async () => {

        const createPersonResponse = await createPerson('admin', {name: 'Joe', lastname: 'Dohan'});

        log('createPersonResponse.body: ', createPersonResponse.body);

        expect(createPersonResponse.status).toBe(200);
        expect(createPersonResponse.body.data.PersonCreate).toBeTruthy();
        expect(createPersonResponse.body.data.PersonCreate.person.name).toBe('Joe');
        expect(createPersonResponse.body.data.PersonCreate.person.lastname).toBe('Dohan');
    });
});
