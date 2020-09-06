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
import { User, OAuthTokens, OAuthClient, OAuthAuthorizationCode } from "./modules/user/UserModel";
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
    getUser: User.getUser,
    saveAuthorizationCode: OAuthAuthorizationCode.saveAuthorizationCode
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

        kRouter.all('/psgraphql', authenticate(), async (context, next) => {

            log('authenticate context.state: ', context.state)
            const {user: userId} = context.state.oauth.token;

            const user = await loadUser(userId);
            log('user: ', user);
            const canRequest = user.permission === permissions.admnistrator || user.permission === permissions.manager;

            if (canRequest) {

                await next();
            } else {

                context.status = 403;
            }
        }, graphqlServer);
    }

    kRouter.post('/token', async (context, next) => {

        log('context.headers: ', context.headers);
        log('context.request.body: ', context.request.body);
        await next();
    }, token(), async (context, next) => {

        log('context.state.oauth.token: ', context.state.oauth.token);
        await next();
    });

    kRouter.post('/authenticate', async (context, next) => {

        log('authenticate request arrived');
        log('context.req.headers: ', context.req.headers);

        await next();
    },
    authenticate(), async (context, next) => {

        const {user: userId} = context.state.oauth.token;

        const user = await loadUser(userId);

        log('context.state.oauth.token.user.username: ', context.state.oauth.token.user.username);
        log('/authenticate user: ', user);
        log('/authenticate user.username: ', user?.username);
        log('/authenticate user.email: ', user?.email);
        log('/authenticate user.permission: ', user?.permission);

        context.body = {
            username: user.username,
            email: user.email,
            permission: user.permission
        };
        log('context.body: ', context.body);
        await next();
    });

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

    kRouter.get('/visitor', async (context, next) => {

        try {

            const freeVisitor = await User.getFreeVisitor();
            log('free Visitor: ', freeVisitor);

            context.body = freeVisitor[0];
            await next();
        } catch (err) {

            log('/visitor error: ', err);
        }
    })

    return kRouter;
};

export default router;
