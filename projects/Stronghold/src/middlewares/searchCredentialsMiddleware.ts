import { ParameterizedContext, Next } from "koa";
import Router from "koa-router";

import { Credentials } from "../modules/credentials/credentialsModel";
import { log as middlewareLog } from "./middlewares";

const log = middlewareLog.extend('searchCredentials');

export const searchCredentialsByIdentifier = () => {

    const search = async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>) => {

        try {

            const identifier = context.state.identifier;
            const credentialsFinded = await Credentials.findOne({identifier});

            context.state.credentials = {
                identifier: credentialsFinded.identifier,
                accessToken: credentialsFinded.accessToken,
                refreshToken: credentialsFinded.refreshToken,
                accessTokenExpiresAt: credentialsFinded.accessTokenExpiresAt,
                refreshTokenExpiresAt: credentialsFinded.refreshTokenExpiresAt,
                permission: credentialsFinded.permission,
            };
        } catch (err) {

            log('error: ', err);
            context.state.credentials = null;
        }
    };

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {

        await search(context);
        await next();
    }
};

export const searchCredentialsByAccessToken = () => {

    const search = async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>) => {

        try {

            log('context.headers.authorization: ', context.headers.authorization);

            const accessToken = (context.headers.authorization as string).split(' ')[1];

            const credentialsFinded = await Credentials.findOne({accessToken});

            context.state.credentials = {
                identifier: credentialsFinded.identifier,
                accessToken: credentialsFinded.accessToken,
                refreshToken: credentialsFinded.refreshToken,
                accessTokenExpiresAt: credentialsFinded.accessTokenExpiresAt,
                refreshTokenExpiresAt: credentialsFinded.refreshTokenExpiresAt,
                permission: credentialsFinded.permission,
            };
            context.state.identifier = credentialsFinded.identifier;
        } catch (err) {

            log('error: ', err);
            context.state.credentials = null
        }
    };

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {

        await search(context);
        await next();
    }
};

export const searchCredentialsByRefreshToken = () => {

    const search = async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>) => {

        try {

            log('context.headers.authorization: ', context.headers.authorization);

            const refreshToken = context.request.body.refresh_token;

            const credentialsFinded = await Credentials.findOne({refreshToken});

            context.state.credentials = {
                identifier: credentialsFinded.identifier,
                accessToken: credentialsFinded.accessToken,
                refreshToken: credentialsFinded.refreshToken,
                accessTokenExpiresAt: credentialsFinded.accessTokenExpiresAt,
                refreshTokenExpiresAt: credentialsFinded.refreshTokenExpiresAt,
                permission: credentialsFinded.permission,
            };
            context.state.identifier = credentialsFinded.identifier;
        } catch (err) {

            log('error: ', err);
            context.state.credentials = null
        }
    };

    return async (context: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>, next: Next) => {

        await search(context);
        await next();
    }
};