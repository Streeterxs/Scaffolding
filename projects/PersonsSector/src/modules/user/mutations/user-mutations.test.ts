import { databaseTestModule } from "../../../tests/database";
import { userMutationsRequestModule } from "../../../tests/mutations/user";
import { testsLogger } from "../../../tests/testsLogger";

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

        const email = 'joe_dohan@gmail.com';
        const password = '12345678';

        const registerResponse = await register({email, password});

        log('registerResponse.body: ', registerResponse.body);

        expect(registerResponse.status).toBe(200);
        expect(registerResponse.body.data.Register).toBeTruthy();
        expect(registerResponse.body.data.Register.user.node.email).toBe(email);
    });
});