import Router from "koa-router";

import {
    accessTokenChecker,
    searchCredentialsByAccessToken,
    bucketRate,
    basicAuth,
    exponencialRate } from "../middlewares";
import config from "../config";
import { appLogger } from "../appLogger";

const log = appLogger.extend('routes:token');

export const tokenRouteMount = (path: string, router: Router<any, {}>) => {

    log('tokeeeeen!');
    log('token clientid: ', config.credentials.clientId);
    log('token clientSecret: ', config.credentials.clientSecret);

    router.get(
        path,
        ...tokenRouteMiddlewares()
    );
};

export const tokenRouteMiddlewares = () => [

    accessTokenChecker(),
    searchCredentialsByAccessToken(),
    bucketRate(),
    basicAuth(config.credentials.clientId, config.credentials.clientSecret),

    async (context, next) => {

        const {grant_type, username, password} = context.request.body;
        const response = await fetch(`${config.services.personssector.baseurl}/${config.services.personssector.routes[0] /* example */}`, {
            headers: {...context.headers},
            body: `grant_type=${grant_type}&username=${username}&password=${password}`,
            method: 'POST'
        });

        context.body = await response.json();
        await next();
    },

    async (context, next) => {

        context.state.exponencialRate = {
            userId: context.state.identifier,
            canReset: true
        };

        log('context.response.body: ', context.response.body);
        const cantReset = context.response.body.error_description ?
            context.response.body.error_description === 'Invalid password' || context.response.body.error_description === 'Invalid login credentials' :
            false

        if (cantReset) {

            context.state.exponencialRate.canReset = false;
        }

        await next();
    },
    exponencialRate()
];