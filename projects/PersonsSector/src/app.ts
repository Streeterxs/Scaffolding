import koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import { GraphQLError } from 'graphql';
import graphqlHttp from 'koa-graphql';
import OAuth2, {Request, Response, UnauthorizedRequestError} from 'oauth2-server';

import { appLogger } from './appLogger';
import Schema from './schema';
import { User, OAuthTokens, OAuthClient } from './modules/user/UserModel';
import { createServer } from 'http';

const log = appLogger.extend('entry');

log('this: ', this);
log('global this: ', globalThis);

const model:
    OAuth2.AuthorizationCodeModel |
    OAuth2.ClientCredentialsModel |
    OAuth2.RefreshTokenModel |
    OAuth2.PasswordModel |
    OAuth2.ExtensionModel = {
        getAccessToken: OAuthTokens.getAccessToken,
        saveToken: OAuthTokens.saveToken,
        verifyScope: OAuthTokens.verifyScope,
        getRefreshToken: OAuthTokens.getRefreshToken,
        getClient: OAuthClient.getClient,
        getUser: User.getUser
    };
const oauth = new OAuth2({
    model
});
const router = new Router();
const app = new koa();
// https://stackoverflow.com/questions/45782303/best-way-to-add-helper-methods-to-context-object-in-koa2
app.context.oauth = oauth;
app.context.authenticate = function() {

    return (next) => {

        log('this: ', this);
        log('this.request: ', this.request);
        const request = new Request(this.request);
        const response = new Response(this.response);

    try {
        this.state.oauth = {
            token: this.oauth.authenticate(request, response)
        };
    } catch (e) {

        log('error: ', e);
        if (e instanceof UnauthorizedRequestError) {
            this.status = e.code;
        } else {
            this.body = { error: e.name, error_description: e.message };
            this.status = e.code;
        }

        return this.app.emit('error', e, this);
    }

      return next;
    };
};
app.context.authorize = function() {

    return async (next) => {
        const request = new Request(this.request);
        const response = new Response(this.response);

        try {
            this.state.oauth = {
                code: await this.oauth.authorize(request, response)
            };

            this.body = response.body;
            this.status = response.status;

            this.set(response.headers);
        } catch (e) {
            if (response) {
                this.set(response.headers);
            }

            if (e instanceof UnauthorizedRequestError) {
                this.status = e.code;
            } else {
                this.body = { error: e.name, error_description: e.message };
                this.status = e.code;
            }

            return this.app.emit('error', e, this);
        }

        return next;
    };
};
app.context.token = function() {

    return async (next) => {
        const request = new Request(this.request);
        const response = new Response(this.response);

        try {
            this.state.oauth = {
                token: await this.oauth.token(request, response)
            };

            this.body = response.body;
            this.status = response.status;

            this.set(response.headers);
        } catch (e) {
            if (response) {
                this.set(response.headers);
            }

            if (e instanceof UnauthorizedRequestError) {
                this.status = e.code;
            } else {
                this.body = { error: e.name, error_description: e.message };
                this.status = e.code;
            }

            return this.app.emit('error', e, this);
        }

        return next;
    };
};

app.use(async (context, next) => {
    const teste = await context.authenticate();
    log('context.state: ', context.state.oauth);
    log('context.headers: ', context.headers);
    await teste(next);
    log('teste!!!!!!!!!!!');
    await next();
});

app.use(logger());
const user = new User();

export const graphqlSettings = async (req: any) => {

    return {
        graphql: true,
        schema: Schema,
        formatError: (error: GraphQLError) => {
            return {
                message: error.message,
                locations: error.locations,
                stack: error.stack
            }
        }
    }
};

export const graphqlServer = graphqlHttp(graphqlSettings);

const appServerCreator = createServer(app.callback());

/* router.all('/graphql', graphqlServer);

app.use(router.routes()).use(router.allowedMethods()); */

export default app;
