import request from 'supertest';

import app from '../../../app';

import { testsLogger } from "../../testsLogger";
import {
    createPersonInput,
    createPersonQuery,
    updatePersonInput,
    updatePersonQuery,
    addUserInput,
    addUserQuery,
    removeUserInput,
    removeUserQuery
} from './mutationsBase';


export const personMutationsRequestModule = () => {

    const log = testsLogger.extend('mutationsRequests');

    const graphqlRequestFn = (query, variables) => {

        log('graphqlRequestFn called');
        return request(app.callback()).post('/graphql').set({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }).send(JSON.stringify({query, variables}));
    };

    const createPerson = (createPersonInputObj: createPersonInput) => {

        return graphqlRequestFn(createPersonQuery(createPersonInputObj), {});
    };

    const updatePerson = (updatePersonInputObj: updatePersonInput) => {

        return graphqlRequestFn(updatePersonQuery(updatePersonInputObj), {});
    };

    const addUser = (addUserInputObj: addUserInput) => {

        return graphqlRequestFn(addUserQuery(addUserInputObj), {});
    };

    const removeUser = (removeUserInputObj: removeUserInput) => {

        return graphqlRequestFn(removeUserQuery(removeUserInputObj), {});
    };

    return {
        createPerson,
        updatePerson,
        addUser,
        removeUser
    };
};
