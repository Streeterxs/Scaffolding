import Router from 'koa-router';

import bookManager, {graphqlHttpServer} from '@BookScaffolding/bookmanager';
import { appRouter as PersonSector, authenticate, authorize, token } from '@BookScaffolding/personssector';

import { appLogger } from './appLogger';

const router = new Router();
const log = appLogger.extend('routes');

log('bookManager: ', bookManager);

router.get('/', authenticate(), (context, next) => {
    context.body = 'helloooo!';
});

router.all('/bookmanager', graphqlHttpServer);

export default router;
