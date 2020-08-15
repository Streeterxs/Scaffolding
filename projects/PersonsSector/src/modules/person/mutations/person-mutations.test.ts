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
        createPerson,
        updatePerson
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

    it('should update a person', async () => {

        const createPersonResponse = await createPerson({name: 'Joe', lastname: 'Dohan'});
        expect(createPersonResponse.status).toBe(200);
        expect(createPersonResponse.body.data.CreatePerson).toBeTruthy();

        const {id: personId} = createPersonResponse.body.data.CreatePerson.person;
        const newName = 'John';
        const newLastname = 'Duvalle';

        const updatePersonResponse = await updatePerson({name: newName, lastname: newLastname, person: personId});

        log('updatePersonResponse.body: ', updatePersonResponse.body);
        expect(updatePersonResponse.status).toBe(200);
        expect(updatePersonResponse.body.data.UpdatePerson).toBeTruthy();
        expect(updatePersonResponse.body.data.UpdatePerson.person.name).toBe(newName);
        expect(updatePersonResponse.body.data.UpdatePerson.person.lastname).toBe(newLastname);
        expect(updatePersonResponse.body.data.UpdatePerson.person.id).toBe(personId);
    });
});