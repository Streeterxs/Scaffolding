import request from 'supertest';
import { databaseTestModule } from '../../../tests/database';

import app from '../../../app';

describe('book mutations', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    beforeAll(async () => await connect());

    afterEach(async () => await clearDatabase());

    afterAll(async () => await closeDatabase());

    it('should create new book', async () => {

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

        const authorResponse = await graphqlRequestFn(createAuthorMutation, {});

        expect(authorResponse.status).toBe(200);

        const createBookMutation = `
            mutation {
                BookCreation(input: {name: "New book", author: "${authorResponse.body.data.AuthorCreation.author.id}", categories: [] clientMutationId: "1"}) {
                    book {
                        cursor
                        node {
                            id
                            name
                            author {
                                name
                            }
                            createdAt
                            updatedAt                        
                        }
                    }
                }
            }
        `;

        const bookResponse = await graphqlRequestFn(createBookMutation, {});

        console.log('response body: ', bookResponse.body);
        expect(bookResponse.status).toBe(200);
    });
});

const graphqlRequestFn = (query, variables) => {
    return request(app.callback()).post('/graphql').set({
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }).send(JSON.stringify({query, variables}));
}
