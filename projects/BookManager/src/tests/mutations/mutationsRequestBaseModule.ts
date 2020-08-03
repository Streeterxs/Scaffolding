import request from 'supertest';
import app from '../../app';

import {
    createAuthorMutation,
    createBookMutation,
    addCategoryToBookMutation,
    createEditionMutation,
    createCategoryMutation
} from './';
import { testsLogger } from '../testsLogger';

const log = testsLogger.extend('mutationsRequests');

export const mutationsRequestBaseModule = () => {

    const graphqlRequestFn = (query, variables) => {

        log('graphqlRequestFn called');
        return request(app.callback()).post('/graphql').set({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }).send(JSON.stringify({query, variables}));
    };

    const createAuthor = async () => {

        log('create author');
        return await graphqlRequestFn(createAuthorMutation(), {});
    };

    const createCategory = async () => {

        log('create category');
        return await graphqlRequestFn(createCategoryMutation(), {})
    };

    const createBook = async (authorId: string) => {

        log('create book authorId inputed: ', authorId);
        return await graphqlRequestFn(createBookMutation(authorId), {});
    };

    const addCategoryToBook = async (bookId: string, categoryId: string) => {

        log('add category bookId inputed: ', bookId);
        log('add category categoryId inputed: ', categoryId);
        return await graphqlRequestFn(addCategoryToBookMutation(bookId, categoryId), {});
    }

    const createEdition = async (bookId: string) => {

        log('create edition bookId inputed: ', bookId);
        return await graphqlRequestFn(createEditionMutation(bookId), {});
    };

    return {
        createAuthor,
        createBook,
        addCategoryToBook,
        createEdition,
        createCategory
    };
}
