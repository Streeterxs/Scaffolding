import { databaseTestModule } from "../../../../tests/database";
import { testsLogger } from "../../../../tests/testsLogger";

import { personMutationsRequestModule } from "../../../../tests/mutations/person";
import { userMutationsRequestModule } from "../../../../tests/mutations/user";
import { permissions } from "../../../user/UserPermissions.enum";

const log = testsLogger.extend('personMutations');

describe('PersonRemoveUserMutation', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const {
        createPerson,
        addUser,
        removeUser,
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

    it('should remove a user from a person', async () => {

        const createPersonResponse = await createPerson('admin', {name: 'Joe', lastname: 'Dohan'});
        expect(createPersonResponse.status).toBe(200);
        expect(createPersonResponse.body.data.PersonCreate).toBeTruthy();

        const username = 'joedohan2';
        const email = 'joe_dohan@gmail.com';
        const password = '12345678';
        const permission = permissions.common;

        const registerResponse = await register('admin', {username, email, password, permission});
        expect(registerResponse.status).toBe(200);
        expect(registerResponse.body.data.UserRegister).toBeTruthy();

        const {id: personId} = createPersonResponse.body.data.PersonCreate.person;
        const {id: userId} = registerResponse.body.data.UserRegister.user.node;

        const addUserResponse = await addUser('admin', {person: personId, user: userId});
        expect(addUserResponse.status).toBe(200);
        expect(addUserResponse.body.data.PersonAddUser).toBeTruthy();

        const removeUserResponse = await removeUser('admin', {person: personId, user: userId});
        log('removeUserResponse.body: ', removeUserResponse.body);
        expect(removeUserResponse.status).toBe(200);
        expect(removeUserResponse.body.data.PersonRemoveUser).toBeTruthy();
        log('removeUserResponse.body.data.PersonRemoveUser.user: ', removeUserResponse.body.data.PersonRemoveUser.user);
        log('removeUserResponse.body.data.PersonRemoveUser.user.person: ', removeUserResponse.body.data.PersonRemoveUser.user.person);
        expect(removeUserResponse.body.data.PersonRemoveUser.user.person).toBeNull();
        expect((removeUserResponse.body.data.PersonRemoveUser.person.users.edges as string[]).length).toBe(0);
    });
});
