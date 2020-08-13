import { createServer } from 'http';
import Router from 'koa-router';
import logger from 'koa-logger';
import { GraphQLError } from 'graphql';
import graphqlHttp from 'koa-graphql';
import OAuth2 from 'oauth2-server';

import { appLogger } from './appLogger';
import Schema from './schema';
import { User, OAuthTokens, OAuthClient } from './modules/user/UserModel';
import { koaOauhServer } from './koaOauhServer';

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

const router = new Router();
const app = koaOauhServer({
    model
});

app.use(async (context, next) => {
    const teste = await context.authenticate();
    log('context.state: ', context.state.oauth);
    log('context.headers: ', context.headers);
    // await teste(next);
    // await next();
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
