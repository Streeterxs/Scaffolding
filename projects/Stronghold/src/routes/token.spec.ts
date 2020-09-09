import request from 'supertest';

import { databaseTestModule } from "../tests/database";
import { testsLogger } from "../tests/testsLogger";
import app from "../app";


const log = testsLogger.extend('routes:token');

describe('Person Mutations', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const graphqlRequestFn = (body, headers) => {

        log('graphqlRequestFn called');
        return request(app.callback()).post('/token').set({
            ...headers
        }).send(JSON.stringify(body));
    };

    beforeAll(() => connect());
    afterEach(() => clearDatabase());
    afterAll(() => closeDatabase());

});
