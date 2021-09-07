import request from 'supertest';
import fetchMock from 'jest-fetch-mock';

import { permissions } from '@Scaffolding/personssector';

import { databaseTestModule } from "../../tests/database";
import { testsLogger } from "../../tests/testsLogger";
import { mockedEnvModule } from '../../tests/mocks/envMockModule';

import app from "../../app";

const log = testsLogger.extend('routes:bookmanager');

describe('BookManager', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    const {
        mockEnvs,
        restore
    } = mockedEnvModule();

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
        mockEnvs({
            MONGODB_URL: 'mockedurl',
            CLIENT_ID: 'mockedclientid',
            CLIENT_SECRET: 'mockedclientsecret',
            PERSONSSECTOR_URL: 'mockedpersonssectorurl/mockedpersonssectorurl2',
            PERSONSSECTOR_ROUTES: 'mockedpersonssector_routes',
            VISITORS_PASSWORD: 'mockedvisitors_password',
        });
    });
    beforeAll(() => connect());
    afterEach(async () => {
        restore();
        fetchMock.resetMocks();
        await clearDatabase();
    });
    afterAll(() => closeDatabase());

    // TODO implement serverless fn local placeholder to pass this test
    it('should pass', async () => {

        const query = `
            Query {
                helloWorld
            }
        `;
        const response = await requestFn(
            {query, variables: {}},
            {
                authorization: 'Bearer 11111'
            }
        );

        log('bookmanager response.status: ', response.status);
        log('bookmanager response.body: ', response.body);

        expect(response.status).toBe(400);
    });
});
