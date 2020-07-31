import request from 'supertest';
import { databaseTestModule } from '../../../tests/database';

import app from '../../../app';

describe('author mutations', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    beforeAll(() => connect());

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new author', async () => {

        const createAuthorMutation = `
            mutation {
                AuthorCreation(input: {name: "New Author", clientMutationId: "1"}) {
                    author {
                        id
                        name
                        createdAt
                        updatedAt
                    }
                }
            }
        `;

        const graphqlRequest = {
            query: createAuthorMutation,
            variables: {}
        };

        const response = await request(app.callback()).post('/graphql').set({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }).send(JSON.stringify(graphqlRequest));

        console.log('response body: ', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.AuthorCreation).toBeTruthy();
    });
});
