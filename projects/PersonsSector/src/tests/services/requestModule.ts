import request from 'supertest';

import { testsLogger } from "../testsLogger";
import { app } from '../..';
import tokenModule from './tokenModule';

const log = testsLogger.extend('requestFns');

type requestModuleReturn = {
    adminRequestFn: (body: any) => Promise<request.Response>,
    managerRequestFn:(body: any) => Promise<request.Response>,
    commonRequestFn: (body: any) => Promise<request.Response>,
    visitorRequestFn: (body: any) => Promise<request.Response>,
    reset: () => void;
}
const requestModule = (): requestModuleReturn => {

    const adminRequestFn = async (body) => {

        const adminToken = await tokenModule.getAdminToken();
        log('adminRequestFn called');
        log('adminToken token: ', adminToken);
        return request(app.callback()).post('/graphql').set({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken.token.access_token}`
        }).send(JSON.stringify(body));
    };

    const managerRequestFn = async (body) => {

        log('managerRequestFn called');
        return request(app.callback()).post('/graphql').set({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(await tokenModule.getManagerToken()).token.access_token}`
        }).send(JSON.stringify(body));
    };

    const commonRequestFn = async (body) => {

        log('commonRequestFn called');
        return request(app.callback()).post('/graphql').set({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(await tokenModule.getCommonToken()).token.access_token}`
        }).send(JSON.stringify(body));
    };

    const visitorRequestFn = async (body) => {

        log('visitorRequestFn called');
        return request(app.callback()).post('/graphql').set({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(await tokenModule.getVisitorToken()).token.access_token}`
        }).send(JSON.stringify(body));
    };

    const reset = () => {

        tokenModule.reset();
    }

    return {
        adminRequestFn,
        managerRequestFn,
        commonRequestFn,
        visitorRequestFn,
        reset
    }
}

export default requestModule;
