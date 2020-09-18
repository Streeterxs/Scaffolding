import { accessTokenChecker, searchCredentialsByAccessToken, bucketRate, permissionLimiter, authenticate } from "../../middlewares";
import config from "../../config";

import { graphqlHttpServer } from "@BookScaffolding/bookmanager";
import { permissions } from '@BookScaffolding/personssector';
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
    graphqlHttpServer
]
