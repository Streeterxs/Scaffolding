import request from 'supertest';

import { databaseTestModule } from "../tests/database";
import { testsLogger } from "../tests/testsLogger";
import app from "../app";


const log = testsLogger.extend('routes:token');

describe('Visitor Route', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const requestFn = (body) => {

        log('graphqlRequestFn called');
        return request(app.callback()).post('/visitor').set({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }).send(JSON.stringify(body));
    };

    beforeAll(() => connect());
    afterEach(() => clearDatabase());
    afterAll(() => closeDatabase());

    it('should return a access token', async () => {

        const response = await requestFn({identifier: '12345678'});

        expect(response.status).toBe(200);
    });
});
