import request from 'supertest';
import fetchMock from 'jest-fetch-mock';

import { databaseTestModule } from "../../tests/database";
import { testsLogger } from "../../tests/testsLogger";
import app from "../../app";

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

        fetchMock.mockOnce(JSON.stringify({teste: 'teste'}));
        fetchMock.mockOnce(JSON.stringify({teste: 'testeeeeeeee'}));
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
