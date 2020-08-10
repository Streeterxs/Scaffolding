import koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import { GraphQLError } from 'graphql';
import graphqlHttp from 'koa-graphql';
import OAuth2 from 'oauth2-server';

import { appLogger } from './appLogger';
import Schema from './schema';
import { User, OAuthTokens, OAuthClient } from './modules/user/UserModel';

const log = appLogger.extend('entry');

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

router.all('/graphql', graphqlServer);

app.use(router.routes()).use(router.allowedMethods());

export default app;
