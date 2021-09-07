import { accessTokenChecker, searchCredentialsByAccessToken, bucketRate, permissionLimiter, authenticate } from "../../middlewares";
import config from "../../config";

import { graphqlHttpServer } from "@Scaffolding/bookmanager";
import { permissions } from '@Scaffolding/personssector';
import Router from "koa-router";

export const bookManagerRouteMount = (path: string, router: Router<any, {}>) => {

    router.all(
        path,
        ...bookManagerRouteMiddlewares()
    );
}

export const bookManagerRouteMiddlewares = () => [
    accessTokenChecker(),
    searchCredentialsByAccessToken(),
    authenticate(config.services.personssector.baseurl, config.services.personssector.routes[1]),
    bucketRate(),
    permissionLimiter(permissions.admnistrator, permissions.manager),
    // TODO correct this Using serverless function not importing a package
    graphqlHttpServer
]
