import request from 'supertest';
import app from '../../app';

import {
    createAuthorMutation,
    createBookMutation,
    addCategoryToBookMutation,
    createEditionMutation,
    createCategoryMutation,
    createEditionMutationInput,
    createBookMutationInput,
    addBookToAuthorMutation
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

    const addBookToAuthor = async (authorId: string, bookId: string) => {

        log('add book to author');
        return graphqlRequestFn(addBookToAuthorMutation(authorId, bookId), {});
    }

    const createCategory = async (name: string) => {

        log('create category');
        return await graphqlRequestFn(createCategoryMutation(name), {})
    };

    const createBook = async (bookObj: createBookMutationInput) => {

        log('create book bookObj inputed: ', bookObj);
        return await graphqlRequestFn((() => {log('book query return: ', createBookMutation(bookObj)); return createBookMutation(bookObj)})(), {});
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
        addBookToAuthor,
        createBook,
        addCategoryToBook,
        createEdition,
        createCategory
    };
}
