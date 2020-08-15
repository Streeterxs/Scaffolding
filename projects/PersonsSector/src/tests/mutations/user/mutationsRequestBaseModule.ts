import request from 'supertest';

import app from '../../../app';
import { testsLogger } from "../../testsLogger";


export const personMutationsRequest = () => {

    const log = testsLogger.extend('mutationsRequests');

    const graphqlRequestFn = (query, variables) => {

        log('graphqlRequestFn called');
        return request(app.callback()).post('/graphql').set({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }).send(JSON.stringify({query, variables}));
    };

    return {};
};