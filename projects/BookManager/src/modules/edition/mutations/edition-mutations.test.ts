import request from 'supertest';
import { databaseTestModule } from '../../../tests/database';

import app from '../../../app';

describe('edition mutations', () => {

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    beforeAll(async () => await connect());

    afterEach(async () => await clearDatabase());

    afterAll(async () => await closeDatabase());

    it('should create new edition', async () => {

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
        expect(bookResponse.status).toBe(200);

        const createEditionMutation = `
            mutation {
                EditionCreation(input: {
                    edition: 1,
                    publishing: "New Publisher",
                    year: 1952,
                    pages: 1000,
                    language: "English",
                    book: "${bookResponse.body.data.BookCreation.book.cursor}",
                    clientMutationId: "1"}) {
                    edition {
                        cursor
                        node {
                            id
                            edition
                            publishing
                            year
                            pages
                            language
                            createdAt
                            updatedAt
                        }
                    }
                }
            }
        `;

        const categoryResponse = await graphqlRequestFn(createEditionMutation, {});
        expect(categoryResponse.status).toBe(200);
        expect(categoryResponse.body.data.EditionCreation).toBeTruthy();
    });
});

const graphqlRequestFn = (query, variables) => {
    return request(app.callback()).post('/graphql').set({
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }).send(JSON.stringify({query, variables}));
};
