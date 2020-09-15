import request from 'supertest';
import fetchMock from 'jest-fetch-mock';

import { databaseTestModule } from "../tests/database";
import { testsLogger } from "../tests/testsLogger";
import app from "../app";

const log = testsLogger.extend('routes:token');

fetchMock.enableMocks();
describe('Person Mutations', () => {

    fetchMock.doMock();
    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const requestFn = (body, headers) => {

        log('requestFn called');
        return request(app.callback()).get('/token').set({
            ...headers
        }).send(body);
    };

    beforeEach(() => {
        // if you have an existing `beforeEach` just add the following lines to it
        fetchMock.mockIf(/^https?:\/\/localhost:3233.*$/, async req => {

            log('entered fetchMock mockIf fn');
            if (req.url.endsWith('/token')) {
                log('request to personssector');
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
        await clearDatabase();
    });
    afterAll(() => closeDatabase());

    it('should return token object password grant', async () => {

        log('token.spec');

        const response = await requestFn(
            {grant_type: 'password', username: 'test', password: '123'},
            {
                authorization: 'Bearer 11111'
            }
        );

        log('response.body: ', response.body);
        log('response.status: ', response.status);
        log('response.header: ', response.header);
        expect(response.body.test).toBe('body');
        expect(response.status).toBe(200);
    });
});
