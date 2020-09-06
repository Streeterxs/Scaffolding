import Router from 'koa-router';
import fetch from 'node-fetch';

import bookManager, {graphqlHttpServer} from '@BookScaffolding/bookmanager';
import { permissions } from '@BookScaffolding/personssector';

import { appLogger } from './appLogger';
import config from './config';
import { basicAuth, permissionLimiter, authenticate, bucketRate, exponencialRate, visitor } from './middlewares';
import { Visitor } from './modules/visitors/visitorModel';

const router = new Router();
const log = appLogger.extend('routes');

log('bookManager: ', bookManager);

router.get('/', (context, next) => {
    context.body = 'helloooo!';
});

router.post('/token', basicAuth(), async (context, next) => {

        const {grant_type, username, password} = context.request.body;
        const response = await fetch(`${config.services.personssector.baseurl}/${config.services.personssector.routes[0] /* example */}`, {
            headers: {...context.headers},
            body: `grant_type=${grant_type}&username=${username}&password=${password}`,
            method: 'POST'
        });

        context.body = await response.json();
        await next();
    });

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
        const {username, email} = context.state.visitor;
        const { access_token, refresh_token, refreshTokenExpiresAt, accessTokenExpiresAt } = context.state.token;

        const newVisitor = new Visitor({
            identifier,
            username,
            email,
            accessToken: access_token,
            refreshToken: refresh_token,
            accessTokenExpiresAt,
            refreshTokenExpiresAt,
        });

        try {

            await newVisitor.save();
        } catch (err) {

            throw new Error("new visitor.save error");
        }

        await next();
    }
);

router.all('/bookmanager',
    authenticate(),
    bucketRate(),
    permissionLimiter(permissions.admnistrator, permissions.manager),
    graphqlHttpServer);

export default router;
