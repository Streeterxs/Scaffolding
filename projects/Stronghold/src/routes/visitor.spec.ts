import request from 'supertest';
import fetchMock from 'jest-fetch-mock';

import { databaseTestModule } from "../tests/database";
import { testsLogger } from "../tests/testsLogger";
import app from "../app";

const log = testsLogger.extend('routes:visitor');

fetchMock.enableMocks();
describe('Visitor Route', () => {

    fetchMock.doMock();
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

    beforeEach(() => {
        // if you have an existing `beforeEach` just add the following lines to it
        fetchMock.mockIf(/^https?:\/\/localhost:3233.*$/, async req => {

            log('entered fetchMock mockIf fn');
            if (req.url.endsWith('/visitor')) {
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
        await clearDatabase()
    });
    afterAll(() => closeDatabase());

    it('should return a access token', async () => {

        const response = await requestFn({identifier: '12345678'});

        log('visitor response.status: ', response.status);
        log('visitor response.body: ', response.body);
        expect(response.status).toBe(200);
    });
});
