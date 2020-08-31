import { ParameterizedContext, DefaultState, DefaultContext, Middleware } from "koa";
import Router from "koa-router";
import {
    AuthorizationCodeModel,
    ClientCredentialsModel,
    RefreshTokenModel,
    PasswordModel,
    ExtensionModel } from "oauth2-server";

import { appLogger } from "./appLogger";
import { loadUser } from "./modules/user/UserLoader";
import { permissions } from "./modules/user/UserPermissions.enum";
import { User, OAuthTokens, OAuthClient } from "./modules/user/UserModel";
import { koaOauthServer } from "./koaOauthServer";

const log = appLogger.extend('router');

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

export const {
    authenticate,
    authorize,
    token
} = koaOauthServer({
    model
});

const router = (graphqlServer?: Middleware<ParameterizedContext<DefaultState, DefaultContext>>) => {

    const kRouter = new Router();

    if (graphqlServer) {

        kRouter.all('/graphql', authenticate(), async (context, next) => {

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
    }

    kRouter.post('/token', token());

    kRouter.post('/register', async (context, next) => {

        const {
            username,
            email,
            password
        } = context.request.body;

        try {

            log('username: ', username);
            log('email: ', email);
            log('password: ', password);

            const newUser = new User({username, email, password, permission: permissions.common});
            await newUser.save();

            await next();
        } catch(err) {

            log('error: ', err);
        }
    });

    return kRouter;
};

export default router;
