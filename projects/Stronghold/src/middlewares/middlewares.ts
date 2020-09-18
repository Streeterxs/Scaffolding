import { ParameterizedContext, Next } from "koa";
import Router from "koa-router";
import fetch from 'node-fetch';

import { permissions } from '@BookScaffolding/personssector';

import { appLogger } from "../appLogger";
import { exponencialRateLimit, bucketRateLimit } from "../services/rateLimits";
import { authenticateRequest, visitorRequest } from "../services/personsSectorFetcher";

export const log = appLogger.extend('middlewares');

export const basicAuth = (clientId: string, clientSecret: string) => {

    log('clientId: ', clientId);
    log('clientSecret: ', clientSecret);
    const credentials = {
        clientId,
        clientSecret
    };
    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {

        const body = context.request.body;
        log('clientId: ', clientId);
        log('clientSecret: ', clientSecret);
        log('credentials: ', credentials);
        log('body: ', body);
        const canProceed = body.grant_type && body.username && body.password;

        if (canProceed) {

            context.req.headers = {...context.req.headers, authorization: `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')}`};
            log('context.headers', context.headers);
            await next();
        } else {

            throw new Error("Couldn't login");
        }
    };
};

export const accessTokenChecker = () => {

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {

        try {

            const authorization = context.headers.authorization as string;

            if (!authorization || !authorization.includes('Bearer')) {

                throw new Error('No token on authorization');
            }

        } catch (err) {

            log('err: ', err);
            return;
        }

        await next();
    }
}

export const exponencialRate = () => {

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next): Promise<void> => {

        const {canReset, userId} = context.state.exponencialRate;
        log('exponencial rate limit userId: ', userId);
        log('exponencial rate limit canReset: ', canReset);
        if (canReset) {

            log('exponencial rate limit reset');
            await exponencialRateLimit.reset(userId + 'expo');
            await next();
        } else {

            log('exponencial rate limit consume');
            await exponencialRateLimit.consume(userId + 'expo');
            await next();
        }

    }
};

export const bucketRate = () => {

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next): Promise<void> => {

        const identifier = context.state.identifier;

        log('bucketRate identifier: ', identifier);
        if(identifier) {

            await bucketRateLimit.consume(identifier + 'bucket');
        }
        await next();

    }
};

export const visitor = (baseurl, route) => {

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {

        try {

            const headers = {...context.headers};
            delete headers['content-type'];
            log('headers: ', headers);
            const response = await visitorRequest({baseurl, route, headers});

            const visitorReturned = await response.json();


            log('[routes] visitor fetch1 return : ', visitorReturned);
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

export const authenticate = (baseurl, route) => {

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next): Promise<void> => {

        const response = await authenticateRequest({baseurl, route, headers: {...context.headers}});

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
