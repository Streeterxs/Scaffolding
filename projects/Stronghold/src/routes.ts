import Router from 'koa-router';
import fetch from 'node-fetch';

import bookManager, {graphqlHttpServer} from '@BookScaffolding/bookmanager';
import { permissions } from '@BookScaffolding/personssector';

import config from './config';
import {
    basicAuth,
    permissionLimiter,
    authenticate,
    bucketRate,
    exponencialRate,
    visitor,
    searchCredentialsByIdentifier,
    searchCredentialsByAccessToken,
    accessTokenChecker} from './middlewares';
import { Credentials } from './modules/credentials/credentialsModel';
import { appLogger } from './appLogger';

const router = new Router();
const log = appLogger.extend('routes');

log('bookManager: ', bookManager);

router.get('/', (context, next) => {
    context.body = 'helloooo!';
});

router.post(
        '/token',
        accessTokenChecker(),
        searchCredentialsByAccessToken(),
        bucketRate(),
        basicAuth(),
        async (context, next) => {

            const {grant_type, username, password} = context.request.body;
            const response = await fetch(`${config.services.personssector.baseurl}/${config.services.personssector.routes[0] /* example */}`, {
                headers: {...context.headers},
                body: `grant_type=${grant_type}&username=${username}&password=${password}`,
                method: 'POST'
            });

            context.body = await response.json();
            await next();
        },
        async (context, next) => {

            context.state.exponencialRate = {
                userId: context.state.identifier,
                canReset: true
            };

            log('context.response.body: ', context.response.body);
            const cantReset = context.response.body.error_description ?
                context.response.body.error_description === 'Invalid password' || context.response.body.error_description === 'Invalid login credentials' :
                false

            if (cantReset) {

                context.state.exponencialRate.canReset = false;
            }

            await next();
        },
        exponencialRate()
    );

router.all('/visitor',
    async (context, next) => {

        try {

            log('context.request.body: ', context.request.body);
            if (!context.request.body.identifier) {

                throw new Error("Empty body visitor");
            }

            context.state.identifier = context.request.body.identifier;

            await next();
        } catch (err) {

            log('error: ', err);
            context.body = {
                error_message: 'No identifier in the body'
            }
        }
    },
    searchCredentialsByIdentifier(),
    bucketRate(),
    visitor(),
    async (context, next) => {

        const {email: username} = context.state.visitor;

        const headers = {...context.headers};
        delete headers['content-type'];

        const response = await fetch(`${config.services.personssector.baseurl}/${config.services.personssector.routes[0] /* example */}`, {
            headers: {
                ...headers,
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: `Basic ${Buffer.from(`${config.credentials.clientId}:${config.credentials.clientSecret}`).toString('base64')}`},
            body: `grant_type=password&username=${username}&password=${config.visitorsPassword}`,
            method: 'POST'
        });

        const token = await response.json();
        context.state.token = token;
        context.body = {
            accessToken: token.access_token,
            accessTokenExpiresAt: token.accessTokenExpiresAt,
            expiresIn: token.expires_in
        };
        await next();
    },
    async (context, next) => {

        const identifier = context.state.identifier;
        const { access_token, refresh_token, refreshTokenExpiresAt, accessTokenExpiresAt } = context.state.token;

        if (!context.state.credentials) {

            const newVisitor = new Credentials({
                identifier,
                accessToken: access_token,
                refreshToken: refresh_token,
                accessTokenExpiresAt,
                refreshTokenExpiresAt
            });

            await newVisitor.save();
            await next();
        } else {

            const findedVisitorCredentials = await Credentials.findOne({identifier});
            findedVisitorCredentials.accessToken = access_token;
            findedVisitorCredentials.refreshToken = refresh_token;
            findedVisitorCredentials.accessTokenExpiresAt = accessTokenExpiresAt;
            findedVisitorCredentials.refreshTokenExpiresAt = refreshTokenExpiresAt;

            await findedVisitorCredentials.save();
            await next();
        }

    }
);

router.all('/bookmanager',
    accessTokenChecker(),
    searchCredentialsByAccessToken(),
    authenticate(),
    bucketRate(),
    permissionLimiter(permissions.admnistrator, permissions.manager),
    graphqlHttpServer);

export default router;
