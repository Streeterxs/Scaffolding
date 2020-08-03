import request from 'supertest';
import app from '../../app';

import {
    createAuthorMutation,
    createBookMutation,
    addCategoryToBookMutation,
    createEditionMutation,
    createCategoryMutation,
    createEditionMutationInput
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

    const createAuthor = async (name: string) => {

        log('create author');
        return await graphqlRequestFn(createAuthorMutation(name), {});
    };

    const createCategory = async (name: string) => {

        log('create category');
        return await graphqlRequestFn(createCategoryMutation(name), {})
    };

    const createBook = async (bookObj: any) => {

        log('create book bookObj inputed: ', bookObj);
        return await graphqlRequestFn(createBookMutation(bookObj), {});
    };

    const addCategoryToBook = async (bookId: string, categoryId: string) => {

        log('add category bookId inputed: ', bookId);
        log('add category categoryId inputed: ', categoryId);
        return await graphqlRequestFn(addCategoryToBookMutation(bookId, categoryId), {});
    }

    const createEdition = async (editionObj: createEditionMutationInput) => {

        log('create edition editionObj inputed: ', editionObj);
        return await graphqlRequestFn(createEditionMutation(editionObj), {});
    };

    return {
        createAuthor,
        createBook,
        addCategoryToBook,
        createEdition,
        createCategory
    };
}
