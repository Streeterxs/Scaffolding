import koa from 'koa';
import OAuth2, { Request, Response, UnauthorizedRequestError, AuthorizeOptions } from 'oauth2-server';

import { appLogger } from './appLogger';
import { loadUser } from './modules/user/UserLoader';
import { User } from './modules/user/UserModel';

const log = appLogger.extend('koaOauthServer');

export interface IKoaOauth2Context extends koa.DefaultContext {
    authenticate: () => {};
    authorize: () => {};
    token: () => (next: any) => Promise<any>;
};
export const koaOauthServer = (options: OAuth2.ServerOptions) => {

    const oauth = new OAuth2(options);

    const authenticate = () => {

        return async (context: koa.DefaultContext, next: koa.Next) => {

            log('context: ', context);
            log('context.request: ', context.request);
            const request = new Request(context.request);
            const response = new Response(context.response);

            try {
                context.state.oauth = {
                    token: await oauth.authenticate(request, response)
                };
            } catch (e) {

                log('error: ', e);
                if (e instanceof UnauthorizedRequestError) {
                    context.status = e.code;
                } else {
                    context.body = { error: e.name, error_description: e.message };
                    context.status = e.code;
                }

                return context.app.emit('error', e, context);
            }

            await next();
        };
    };

    const authorize = (authenticateHandler?) => {

        return async (context: koa.DefaultContext, next: koa.Next) => {

            const request = new Request(context.request);
            const response = new Response(context.response);

            const authorizeParams = (): [Request, Response, AuthorizeOptions?] => {

                const params: [Request, Response, AuthorizeOptions?] = [request, response];

                if (authenticateHandler) {
                    params.push(authenticateHandler);
                }

                return params;
            }
            try {
                context.state.oauth = {
                    code: await oauth.authorize(...authorizeParams())
                };

                context.body = response.body;
                context.status = response.status;

                context.set(response.headers);
            } catch (e) {
                if (response) {
                    context.set(response.headers);
                }

                if (e instanceof UnauthorizedRequestError) {
                    context.status = e.code;
                } else {
                    context.body = { error: e.name, error_description: e.message };
                    context.status = e.code;
                }

                return context.app.emit('error', e, context);
            }

            await next();
        };
    };

    const token = () => {

        log('token middleware');

        return async (context: koa.DefaultContext, next: koa.Next) => {

            const request = new Request(context.request);
            const response = new Response(context.response);

            try {

                context.state.oauth = {
                    token: await oauth.token(request, response)
                };

                const {userReturned, accessTokenExpiresAt, refreshTokenExpiresAt} = context.state.oauth.token;

                context.body = {...response.body, username: userReturned.username, email: userReturned.email, accessTokenExpiresAt, refreshTokenExpiresAt};
                context.status = response.status;

                context.set(response.headers);
            } catch (e) {

                if (response) {
                    context.set(response.headers);
                }

                if (e instanceof UnauthorizedRequestError) {
                    context.status = e.code;
                } else {
                    context.body = { error: e.name, error_description: e.message };
                    context.status = e.code;
                }

                return context.app.emit('error', e, context);
            }

            await next();
        };
    };

    return {
        authenticate,
        authorize,
        token
    };
};
