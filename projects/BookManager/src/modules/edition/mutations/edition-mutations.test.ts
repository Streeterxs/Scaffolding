import request from 'supertest';
import { databaseTestModule } from '../../../tests/database';

import app from '../../../app';

describe('edition mutations', () => {

    let bookId: string;

    const {
        connect,
        closeDatabase,
        clearDatabase
    } = databaseTestModule();

    beforeAll(() => connect());

    beforeEach(async () => {

        const authorGraphqlReturn = await createAuthor();

        const bookGraphqlReturn = await createBook(authorGraphqlReturn.AuthorCreation.author.id);

        bookId = bookGraphqlReturn.BookCreation.book.cursor;
    });

    afterEach(() => clearDatabase());

    afterAll(() => closeDatabase());

    it('should create new edition', async () => {

        const editionResponse = await createEdition(bookId);

        expect(editionResponse.status).toBe(200);
        expect(editionResponse.body.data.EditionCreation).toBeTruthy();
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

const createBook = async (authorId: string) => {

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
    return bookResponse.body.data;
};

const createEdition = async (bookId: string) => {

    const createEditionMutation = `
        mutation {
            EditionCreation(input: {
                edition: 1,
                publishing: "New Publisher",
                year: 1952,
                pages: 1000,
                language: "English",
                book: "${bookId}",
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

    return await graphqlRequestFn(createEditionMutation, {});
};
