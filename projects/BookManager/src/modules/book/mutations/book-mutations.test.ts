import request from 'supertest';
import { databaseTestModule } from '../../../tests/database';

import app from '../../../app';

describe('book mutations', () => {

    let authorId: string;

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    beforeAll(() => connect());

    beforeEach(async () => {

        authorId = (await createAuthor()).AuthorCreation.author.id;
    })

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new book', async () => {

        const createBookMutation = `
            mutation {
                BookCreation(input: {name: "New book", author: "${authorId}", categories: [] clientMutationId: "1"}) {
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
        expect(bookResponse.body.data.BookCreation).toBeTruthy();
    });
});

const graphqlRequestFn = (query, variables) => {
    return request(app.callback()).post('/graphql').set({
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }).send(JSON.stringify({query, variables}));
};

const createAuthor = async () => {

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
    return authorResponse.body.data;
};
