import request from 'supertest';
import fetchMock from 'jest-fetch-mock';

import { databaseTestModule } from "../../tests/database";
import { testsLogger } from "../../tests/testsLogger";
import app from "../../app";
import { permissions } from '@BookScaffolding/personssector/build';

const log = testsLogger.extend('routes:bookmanager');

describe('BookManager', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const requestFn = (body, headers) => {

        log('graphqlRequestFn called');
        return request(app.callback()).post('/bookmanager').set({
            ...headers
        }).send(JSON.stringify(body));
    };

    beforeEach(() => {

        log('before each');
        // if you have an existing `beforeEach` just add the following lines to it
        fetchMock.mockOnce(JSON.stringify({permission: permissions.admnistrator}));
    });
    beforeAll(() => connect());
    afterEach(async () => {
        fetchMock.resetMocks();
        await clearDatabase()
    });
    afterAll(() => closeDatabase());

    // TODO implement serverless fn local placeholder to pass this test
    it('should pass', async () => {

        const response = await requestFn(
            {grant_type: 'password', username: 'test', password: '123'},
            {
                authorization: 'Bearer 11111'
            }
        );

        log('bookmanager response.status: ', response.status);
        log('bookmanager response.body: ', response.body);
        expect(response.status).toBe(200);
    });
});
