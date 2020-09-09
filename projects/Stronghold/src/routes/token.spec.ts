import request from 'supertest';
import fetchMock from 'jest-fetch-mock';

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

    const requestFn = (body, headers) => {

        log('graphqlRequestFn called');
        return request(app.callback()).get('/token').set({
            ...headers
        }).send(body);
    };

    beforeAll(() => connect());
    afterEach(() => clearDatabase());
    afterAll(() => closeDatabase());

    it('should return token object password grant', async () => {

        // if you have an existing `beforeEach` just add the following lines to it
        fetchMock.mockIf(/^https?:\/\/localhost:3233.*$/, async req => {

            if (req.url.endsWith('/token')) {

                return 'some response body'
            } else {

                return {
                    status: 404,
                    body: 'Not Found'
                }
            }
        });

        const response = requestFn(
            {grant_type: 'password', username: 'test', password: '123'},
            {
                authorization: 'bearer 11111'
            }
        );
    });
});
