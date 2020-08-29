import request from 'supertest';

import { testsLogger } from "../../testsLogger";
import { registerInput, registerMutationQuery } from './mutationsBase';
import reqModule from '../../services/requestModule';
import { requestOption } from "../requestOption.type";


export const userMutationsRequestModule = () => {

    const requestModule = reqModule();
    const log = testsLogger.extend('mutationsRequests');

    const graphqlRequestFn = (option: requestOption, query, variables): Promise<request.Response> => {

        log('graphqlRequestFn called');
        return requestModule[`${option}RequestFn`]({query, variables});
    };

    const register = (option: requestOption, registerMutationInputObj: registerInput) => {

        return graphqlRequestFn(option, registerMutationQuery(registerMutationInputObj), {});
    };

    const userResetUsers = () => {

        requestModule.reset();
    };

    return {
        register,
        userResetUsers
    };
};
