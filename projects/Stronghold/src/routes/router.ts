import Router from 'koa-router';

import bookManager from '@BookScaffolding/bookmanager';

import { appLogger } from '../appLogger';
import { tokenRouteMount } from './token';
import { visitorRouteMount } from './visitor';
import { bookManagerRouteMount } from './bookmanager';
import config from '../config';

export const router = new Router();
export const routerLog = appLogger.extend('routes');

routerLog('tokeeeeen!');
routerLog('bookManager: ', bookManager);
routerLog('token clientid: ', config.credentials.clientId);
routerLog('token clientSecret: ', config.credentials.clientSecret);

router.get('/', (context, next) => {
    context.body = 'helloooo!';
});

tokenRouteMount('/token', router);

visitorRouteMount('/visitor', router);

bookManagerRouteMount('/bookmanager', router);

