import { ParameterizedContext, Next } from "koa";
import Router from "koa-router";
import fetch from 'node-fetch';

import { permissions } from '@BookScaffolding/personssector';

import { appLogger } from "./appLogger";
import config from "./config";

const log = appLogger.extend('middlewares');

export const basicAuth = () => {

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {

        const body = context.request.body;
        log('body: ', body);
        const canProceed = body.grant_type && body.username && body.password;

        if (canProceed) {

            context.req.headers = {...context.req.headers, authorization: `Basic ${Buffer.from(`${config.credentials.clientId}:${config.credentials.clientSecret}`).toString('base64')}`};
            log('context.headers', context.headers);
            await next();
        } else {

            throw new Error("Couldn't login");
        }
    };
};

export const permissionLimiter = (...args: [permissions, permissions?, permissions?, permissions?]) => {

    const authenticate = async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>): Promise<void> => {

        log('config.services.personssector.routes[1]: ', config.services.personssector.routes[1]);

        const response = await fetch(`${config.services.personssector.baseurl}/${config.services.personssector.routes[1] /* example */}`, {
            headers: {...context.headers},
            method: 'POST'
        });

        const responseReturned = await response.json();
        log('responseReturned: ', responseReturned);
        context.state.authenticatedUser = responseReturned;
    };

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {

        await authenticate(context);
        const { permission } = context.state.authenticatedUser;

        log('user permission: ', permission);
        const canRequest = args.reduce((acc, actual) => {
            return acc || (actual === permission)
        }, false);

        if (canRequest) {

            await next();
        } else {

            throw new Error('User forbidden');
        }
    };
};
