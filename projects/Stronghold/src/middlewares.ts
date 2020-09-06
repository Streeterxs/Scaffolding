import { ParameterizedContext, Next } from "koa";
import Router from "koa-router";
import fetch from 'node-fetch';

import { permissions } from '@BookScaffolding/personssector';

import { appLogger } from "./appLogger";
import config from "./config";
import { exponencialRateLimit, bucketRateLimit } from "./controllers/rateLimits";

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

export const exponencialRate = () => {

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next): Promise<void> => {

        const {canReset, userId} = context.state.exponencialRate;

        if (canReset) {

            exponencialRateLimit.reset(userId);
            await next();
        } else {

            exponencialRateLimit.consume(userId);
            await next();
        }

    }
};

export const bucketRate = () => {

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next): Promise<void> => {

        const { username } = context.state.authenticatedUser;

        bucketRateLimit.consume(username);
        await next();

    }
};

export const visitor = () => {

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {

        try {

            const headers = {...context.headers};
            delete headers['content-type'];
            log('headers: ', headers);
            const response = await fetch(`${config.services.personssector.baseurl}/${config.services.personssector.routes[2] /* example */}`, {
                headers,
                method: 'GET'
            });

            const visitorReturned = await response.json();

            log('visitorReturned: ', visitorReturned);
            context.state.visitor = {
                username: visitorReturned.username,
                email: visitorReturned.email
            }
            await next();
        } catch (err) {

            log('visitor error: ', err);
            throw new Error('Visitor error');
        }
    }
}

export const authenticate = () => {

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next): Promise<void> => {

        log('config.services.personssector.routes[1]: ', config.services.personssector.routes[1]);

        const response = await fetch(`${config.services.personssector.baseurl}/${config.services.personssector.routes[1] /* example */}`, {
            headers: {...context.headers},
            method: 'POST'
        });

        const responseReturned = await response.json();
        log('responseReturned: ', responseReturned);
        context.state.authenticatedUser = responseReturned;

        await next();
    };
}

export const permissionLimiter = (...args: [permissions, permissions?, permissions?, permissions?]) => {

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {

        log('context.state: ', context.state);
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
