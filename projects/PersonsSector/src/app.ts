import { createServer } from 'http';
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
import serverless from 'serverless-http';

import { appLogger } from './appLogger';
import Schema from './schema';
import { User, OAuthTokens, OAuthClient } from './modules/user/UserModel';
import { koaOauhServer } from './koaOauthServer';
import router from './routes';

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

export const appRouter = router(graphqlServer);

app.use(appRouter.routes()).use(appRouter.allowedMethods());

export default app;
