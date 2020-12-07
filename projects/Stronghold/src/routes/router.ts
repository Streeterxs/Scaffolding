import Router from 'koa-router';

import bookManager from '@BookScaffolding/bookmanager';

import { appLogger } from '../appLogger';
import { tokenRouteMount } from './token';
import { visitorRouteMount } from './visitor';
import { bookManagerRouteMount } from './bookmanager';

export const router = new Router();
export const routerLog = appLogger.extend('routes');

routerLog('tokeeeeen!');
routerLog('bookManager: ', bookManager);

router.get('/', (context, next) => {
    context.body = 'helloooo!';
});

tokenRouteMount('/token', router);

visitorRouteMount('/visitor', router);

bookManagerRouteMount('/bookmanager', router);

