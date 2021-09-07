import request from 'supertest';
import fetchMock from 'jest-fetch-mock';

import { databaseTestModule } from "../../tests/database";
import { testsLogger } from "../../tests/testsLogger";
import app from "../../app";
import { Credentials } from '../../modules/credentials/credentialsModel';
import { permissions } from '@Scaffolding/personssector/build';

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

    const accessTokenExpirationDate = new Date();
    beforeEach(() => {

        fetchMock.mockOnce(JSON.stringify({teste: 'teste'}));
        fetchMock.mockOnce(JSON.stringify({
            access_token: 'aabcdef',
            accessTokenExpiresAt: accessTokenExpirationDate,
            expires_in: '123123'
        }));
    });
    beforeAll(() => connect());
    afterEach(async () => {
        fetchMock.resetMocks();
        await clearDatabase()
    });
    afterAll(() => closeDatabase());

    it('should return a access token', async () => {

        const response = await requestFn({identifier: '12345678'});

        const credentialsFinded = await Credentials.findOne({identifier: '12345678'});
        log('credentials Finded: ', credentialsFinded);
        log('visitor response.status: ', response.status);
        log('visitor response.body: ', response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('accessTokenExpiresAt');
        expect(response.body).toHaveProperty('expiresIn');
        expect(response.body.accessToken).toBe('aabcdef');
        expect(response.body.accessTokenExpiresAt).toBe(accessTokenExpirationDate.toJSON());
        expect(response.body.expiresIn).toBe('123123');
        expect(credentialsFinded.identifier).toBe('12345678');
        expect(credentialsFinded.permission).toBe(permissions.visitor);
    });

    it('should return a error', async () => {

        const response = await requestFn({});

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error_message');
        expect(response.body.error_message).toBe('No identifier in the body');
    });
});
