import Router from 'koa-router';
import fetch from 'node-fetch';

import bookManager, {graphqlHttpServer} from '@BookScaffolding/bookmanager';
import { permissions } from '@BookScaffolding/personssector';

import { appLogger } from './appLogger';
import config from './config';
import { basicAuth, permissionLimiter, authenticate, bucketRate, exponencialRate } from './middlewares';

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

router.get('/visitor', async (context, next) => {

    const response = await fetch(`${config.services.personssector.baseurl}/${config.services.personssector.routes[2] /* example */}`, {
        headers: {...context.headers},
        method: 'GET'
    });

    const responseJson = await response.json();
    log('response json: ', responseJson);

    context.body = responseJson;
    await next();
})

router.all('/bookmanager',
    authenticate(),
    bucketRate(),
    permissionLimiter(permissions.admnistrator, permissions.manager),
    graphqlHttpServer);

export default router;
