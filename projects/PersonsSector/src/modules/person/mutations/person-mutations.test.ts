import { databaseTestModule } from "../../../tests/database";
import { personMutationsRequestModule } from "../../../tests/mutations/person";
import { testsLogger } from "../../../tests/testsLogger";

const log = testsLogger.extend('personMutations');

describe('Person Mutations', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const {
        createPerson
    } = personMutationsRequestModule();

    beforeAll(() => connect());
    beforeEach(() => {});
    afterEach(() => clearDatabase());
    afterAll(() => closeDatabase());

    it('should create a new person', async () => {

        const createPersonResponse = await createPerson({name: 'Joe', lastname: 'Dohan'});

        log('createPersonResponse.body: ', createPersonResponse.body);

        expect(createPersonResponse.status).toBe(200);
        expect(createPersonResponse.body.data.CreatePerson).toBeTruthy();
        expect(createPersonResponse.body.data.CreatePerson.person.name).toBe('Joe');
        expect(createPersonResponse.body.data.CreatePerson.person.lastname).toBe('Dohan');
    });
});