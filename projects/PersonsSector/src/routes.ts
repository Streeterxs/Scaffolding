import { ParameterizedContext, DefaultState, DefaultContext, Middleware } from "koa";
import Router from "koa-router";

import { appLogger } from "./appLogger";
import { loadUser } from "./modules/user/UserLoader";
import { permissions } from "./modules/user/UserPermissions.enum";
import { User } from "./modules/user/UserModel";

const log = appLogger.extend('router');

const router = (graphqlServer?: Middleware<ParameterizedContext<DefaultState, DefaultContext>>) => {

    const kRouter = new Router();

    if (graphqlServer) {

        kRouter.all('/graphql', async (context, next) => {

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
    }

    kRouter.post('/token', async (context) => {

        // @ts-ignore
        const nextOauth = context.token();
        await nextOauth();
        log('context.state: ', context.state);
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

    return kRouter;
};

export default router;
