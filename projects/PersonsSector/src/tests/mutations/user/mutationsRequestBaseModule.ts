import request from 'supertest';

import app from '../../../app';
import { testsLogger } from "../../testsLogger";
import { registerInput, registerMutationQuery } from './mutationsBase';


export const userMutationsRequestModule = () => {

    const log = testsLogger.extend('mutationsRequests');

    const graphqlRequestFn = (query, variables) => {

        log('graphqlRequestFn called');
        return request(app.callback()).post('/graphql').set({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }).send(JSON.stringify({query, variables}));
    };

    const register = (registerMutationInputObj: registerInput) => {

        return graphqlRequestFn(registerMutationQuery(registerMutationInputObj), {});
    }
    return {
        register
    };
};