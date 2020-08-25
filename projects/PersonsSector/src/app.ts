import { createServer } from 'http';
import Router from 'koa-router';
import logger from 'koa-logger';
import cors from 'kcors';
import bodyparser from 'koa-bodyparser';
import { GraphQLError } from 'graphql';
import graphqlHttp from 'koa-graphql';
import {
        AuthorizationCodeModel,
        ClientCredentialsModel,
        RefreshTokenModel,
        PasswordModel,
        ExtensionModel
    } from 'oauth2-server';

import { appLogger } from './appLogger';
import Schema from './schema';
import { User, OAuthTokens, OAuthClient } from './modules/user/UserModel';
import { koaOauhServer } from './koaOauthServer';
import { loadUser } from './modules/user/UserLoader';
import { permissions } from './modules/user/UserPermissions.enum';

const log = appLogger.extend('entry');

const model:
    AuthorizationCodeModel |
    ClientCredentialsModel |
    RefreshTokenModel |
    PasswordModel |
    ExtensionModel = {
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

app.use(logger());
app.use(cors());
app.use(bodyparser());

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

router.all('/graphql', async (context, next) => {

    log('context.headers: ', context.headers);
    // @ts-ignore
    const nextAuth = context.authenticate();
    await nextAuth();

    log('authenticate context.state: ', context.state)
    const {user: userId} = context.state.oauth.token;
    log('userId: ', userId);
    const userFinded = await loadUser(userId);

    const canRequest = userFinded.permission === permissions.admnistrator || userFinded.permission === permissions.manager;

    if (canRequest) {

        await next();
    } else {

        context.status = 403;
    }
}, graphqlServer);

router.post('/token', async (context) => {

    // @ts-ignore
    const nextOauth = context.token();
    await nextOauth();
    log('context.state: ', context.state);
});

app.use(router.routes()).use(router.allowedMethods());

export default app;
