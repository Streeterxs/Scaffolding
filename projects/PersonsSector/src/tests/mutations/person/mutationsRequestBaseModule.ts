import request from 'supertest';

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
import { requestOption } from '../requestOption.type';
import reqModule from '../../services/requestModule';


export const personMutationsRequestModule = () => {

    const requestModule = reqModule();
    const log = testsLogger.extend('mutationsRequests');

    const graphqlRequestFn = (option: requestOption, query, variables): Promise<request.Response> => {

        log('graphqlRequestFn called');
        return requestModule[`${option}RequestFn`]({query, variables});
    };

    const createPerson = (option: requestOption, createPersonInputObj: createPersonInput) => {

        return graphqlRequestFn(option, createPersonQuery(createPersonInputObj), {});
    };

    const updatePerson = (option: requestOption, updatePersonInputObj: updatePersonInput) => {

        return graphqlRequestFn(option, updatePersonQuery(updatePersonInputObj), {});
    };

    const addUser = (option: requestOption, addUserInputObj: addUserInput) => {

        return graphqlRequestFn(option, addUserQuery(addUserInputObj), {});
    };

    const removeUser = (option: requestOption, removeUserInputObj: removeUserInput) => {

        return graphqlRequestFn(option, removeUserQuery(removeUserInputObj), {});
    };

    const personResetUsers = () => {

        requestModule.reset();
    };

    return {
        createPerson,
        updatePerson,
        addUser,
        removeUser,
        personResetUsers
    };
};
