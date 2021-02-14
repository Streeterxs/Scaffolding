import { databaseTestModule } from "../../../../tests/database";
import { testsLogger } from "../../../../tests/testsLogger";

import { personMutationsRequestModule } from "../../../../tests/mutations/person";

const log = testsLogger.extend('personMutations');

describe('PersonUpdateMutation', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const {
        createPerson,
        updatePerson,
        personResetUsers,
    } = personMutationsRequestModule();

    beforeAll(() => connect());
    afterEach(async () => {
        personResetUsers();
        await clearDatabase();
    });
    afterAll(() => closeDatabase());

    it('should update a person', async () => {

        const createPersonResponse = await createPerson('admin', {name: 'Joe', lastname: 'Dohan'});
        expect(createPersonResponse.status).toBe(200);
        expect(createPersonResponse.body.data.PersonCreate).toBeTruthy();

        const {id: personId} = createPersonResponse.body.data.PersonCreate.person;
        const newName = 'John';
        const newLastname = 'Duvalle';

        const updatePersonResponse = await updatePerson('admin', {name: newName, lastname: newLastname, person: personId});

        log('updatePersonResponse.body: ', updatePersonResponse.body);
        expect(updatePersonResponse.status).toBe(200);
        expect(updatePersonResponse.body.data.PersonUpdate).toBeTruthy();
        expect(updatePersonResponse.body.data.PersonUpdate.person.name).toBe(newName);
        expect(updatePersonResponse.body.data.PersonUpdate.person.lastname).toBe(newLastname);
        expect(updatePersonResponse.body.data.PersonUpdate.person.id).toBe(personId);
    });
});
