import { databaseTestModule } from "../../../tests/database";
import { testsLogger } from "../../../tests/testsLogger";

import { personMutationsRequestModule } from "../../../tests/mutations/person";
import { userMutationsRequestModule } from "../../../tests/mutations/user";

const log = testsLogger.extend('personMutations');

describe('Person Mutations', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const {
        createPerson,
        updatePerson,
        addUser
    } = personMutationsRequestModule();

    const {
        register
    } = userMutationsRequestModule();

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

    it('should add a user to a person', async () => {

        const createPersonResponse = await createPerson({name: 'Joe', lastname: 'Dohan'});
        expect(createPersonResponse.status).toBe(200);
        expect(createPersonResponse.body.data.CreatePerson).toBeTruthy();

        const email = 'joe_dohan@gmail.com';
        const password = '12345678';

        const registerResponse = await register({email, password});
        expect(registerResponse.status).toBe(200);
        expect(registerResponse.body.data.Register).toBeTruthy();

        const {id: personId} = createPersonResponse.body.data.CreatePerson.person;
        const {id: userId} = registerResponse.body.data.Register.user.node;

        const addUserResponse = await addUser({person: personId, user: userId});

        log('addUserResponse.body: ', addUserResponse.body);
        log('addUserResponse.body.data.AddUser.person: ', addUserResponse.body.data.AddUser.person);
        expect(addUserResponse.status).toBe(200);
        expect(addUserResponse.body.data.AddUser).toBeTruthy();
        expect(addUserResponse.body.data.AddUser.person.id).toBe(personId);
        expect(addUserResponse.body.data.AddUser.user.id).toBe(userId);

        log('addUserResponse.body.data.AddUser.person.users: ', addUserResponse.body.data.AddUser.person.users);
        expect(addUserResponse.body.data.AddUser.person.users.edges[0].node.id).toBe(userId);
        expect(addUserResponse.body.data.AddUser.user.person.id).toBe(personId);
    });
});