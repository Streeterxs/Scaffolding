import request from 'supertest';
import fetchMock from 'jest-fetch-mock';

import { databaseTestModule } from "../tests/database";
import { testsLogger } from "../tests/testsLogger";
import app from "../app";

const log = testsLogger.extend('routes:bookmanager');

fetchMock.enableMocks();
describe('Person Mutations', () => {

    fetchMock.doMock();
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
        fetchMock.mockIf(/^https?:\/\/localhost:3233.*$/, async req => {

            log('entered fetchMock mockIf fn');
            if (req.url.endsWith('/authenticate')) {
                log('request to personssector/authenticate');
                return JSON.stringify({test: 'body'})
            } else {

                return {
                    status: 404,
                    body: JSON.stringify({error: 'Not Found'})
                }
            }
        });
    });
    beforeAll(() => connect());
    afterEach(async () => {
        fetchMock.resetMocks();
        await clearDatabase()
    });
    afterAll(() => closeDatabase());

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
