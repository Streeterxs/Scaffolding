import { databaseTestModule } from "../../../../tests/database";
import { testsLogger } from "../../../../tests/testsLogger";

import { personMutationsRequestModule } from "../../../../tests/mutations/person";
import { userMutationsRequestModule } from "../../../../tests/mutations/user";
import { permissions } from "../../../user/UserPermissions.enum";

const log = testsLogger.extend('personMutations');

describe('PersonAddUserMutation', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const {
        createPerson,
        addUser,
        personResetUsers,
    } = personMutationsRequestModule();

    const {
        register,
    } = userMutationsRequestModule();

    beforeAll(() => connect());
    afterEach(async () => {
        personResetUsers();
        await clearDatabase();
    });
    afterAll(() => closeDatabase());

    it('should add a user to a person', async () => {

        const createPersonResponse = await createPerson('admin', {name: 'Joe', lastname: 'Dohan'});
        log('createPersonResponse.error: ', createPersonResponse.error);
        expect(createPersonResponse.status).toBe(200);
        expect(createPersonResponse.body.data.PersonCreate).toBeTruthy();

        const username = 'joedohan2';
        const email = 'joe_dohan@gmail.com';
        const password = '12345678';
        const permission = permissions.common;

        const registerResponse = await register('admin', {username, email, password, permission});
        log('registerResponse.error: ', registerResponse.error);
        expect(registerResponse.status).toBe(200);
        expect(registerResponse.body.data.UserRegister).toBeTruthy();

        const {id: personId} = createPersonResponse.body.data.PersonCreate.person;
        const {id: userId} = registerResponse.body.data.UserRegister.user.node;

        const addUserResponse = await addUser('admin', {person: personId, user: userId});

        log('addUserResponse.error: ', addUserResponse.error);
        log('addUserResponse.body: ', addUserResponse.body);
        log('addUserResponse.body.data.PersonAddUser.person: ', addUserResponse.body.data.PersonAddUser.person);
        expect(addUserResponse.status).toBe(200);
        expect(addUserResponse.body.data.PersonAddUser).toBeTruthy();
        expect(addUserResponse.body.data.PersonAddUser.person.id).toBe(personId);
        expect(addUserResponse.body.data.PersonAddUser.user.id).toBe(userId);

        log('addUserResponse.body.data.PersonAddUser.person.users: ', addUserResponse.body.data.PersonAddUser.person.users);
        expect(addUserResponse.body.data.PersonAddUser.person.users.edges[0].node.id).toBe(userId);
        expect(addUserResponse.body.data.PersonAddUser.user.person.id).toBe(personId);
    });
});
