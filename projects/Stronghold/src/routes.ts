import Router from 'koa-router';
import fetch from 'node-fetch';

import bookManager, {graphqlHttpServer} from '@BookScaffolding/bookmanager';
import { permissions, authenticate } from '@BookScaffolding/personssector';

import { appLogger } from './appLogger';
import config from './config';
import { basicAuth, permissionLimiter } from './middlewares';

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

router.all('/bookmanager', authenticate(), permissionLimiter(permissions.admnistrator, permissions.manager) , graphqlHttpServer);

export default router;
