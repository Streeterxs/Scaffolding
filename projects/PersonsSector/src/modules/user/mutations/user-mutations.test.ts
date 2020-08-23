import { databaseTestModule } from "../../../tests/database";
import { userMutationsRequestModule } from "../../../tests/mutations/user";
import { testsLogger } from "../../../tests/testsLogger";
import { permissions } from "../UserPermissions.enum";

const log = testsLogger.extend('userMutations');

describe('User Mutations', () => {

    const {
        register
    } = userMutationsRequestModule();

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    beforeAll(() => connect());
    afterEach(() => clearDatabase());
    afterAll(() => closeDatabase());

    it('should register a new user', async () => {

        const username = 'joedohan2';
        const email = 'joe_dohan@gmail.com';
        const password = '12345678';
        const permission = permissions.common;

        const registerResponse = await register({username, email, password, permission});

        log('registerResponse.body: ', registerResponse.body);

        expect(registerResponse.status).toBe(200);
        expect(registerResponse.body.data.Register).toBeTruthy();
        expect(registerResponse.body.data.Register.user.node.email).toBe(email);
    });
});