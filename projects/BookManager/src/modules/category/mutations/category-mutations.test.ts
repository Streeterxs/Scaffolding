import request from 'supertest';
import { databaseTestModule } from '../../../tests/database';

import app from '../../../app';

describe('category mutations', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    beforeAll(() => connect());

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new category', async () => {

        const createCategoryMutation = `
            mutation {
                CategoryCreation(input: {name: "New category", clientMutationId: "1"}) {
                    category {
                        cursor
                        node {
                            id
                            name
                            createdAt
                            updatedAt
                        }
                    }
                }
            }
        `;

        const graphqlRequest = {
            query: createCategoryMutation,
            variables: {}
        };

        const response = await request(app.callback()).post('/graphql').set({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }).send(JSON.stringify(graphqlRequest));

        console.log('response body: ', response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.CategoryCreation).toBeTruthy();
    });
});
