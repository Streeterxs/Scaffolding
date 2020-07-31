import request from 'supertest';
import app from '../../app';

import {
    createAuthorMutation,
    createBookMutation,
    createEditionMutation,
    createCategoryMutation
} from './';

export const mutationsRequestBaseModule = () => {

    const graphqlRequestFn = (query, variables) => {
        return request(app.callback()).post('/graphql').set({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }).send(JSON.stringify({query, variables}));
    };

    const createAuthor = async () => {

        return await graphqlRequestFn(createAuthorMutation(), {});
    };
    
    const createCategory = async () => {

        return await graphqlRequestFn(createCategoryMutation(), {})
    };

    const createBook = async (authorId: string) => {

        return await graphqlRequestFn(createBookMutation(authorId), {});
    };

    const createEdition = async (bookId: string) => {

        return await graphqlRequestFn(createEditionMutation(bookId), {});
    };

    return {
        createAuthor,
        createBook,
        createEdition,
        createCategory
    };
}
