import { ParameterizedContext, Next } from "koa";
import Router from "koa-router";

import { appLogger } from "./appLogger";
import config from "./config";

const log = appLogger.extend('middlewares');

export const basicAuth = () => {

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {

        const body = context.request.body;
        log('body: ', body);
        const canProceed = body.grant_type && body.username && body.password;

        if (canProceed) {

            context.req.headers = {...context.req.headers, Authorization: `Basic ${Buffer.from(`${config.credentials.clientId}:${config.credentials.clientSecret}`).toString('base64')}`};
            log('context.headers', context.headers);
            await next();
        } else {

            throw new Error("Couldn't login");
        }
    };
};
