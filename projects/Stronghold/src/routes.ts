import Router from 'koa-router';

import bookManager, {graphqlHttpServer} from '@BookScaffolding/bookmanager';

import { appLogger } from './appLogger';

const router = new Router();
const log = appLogger.extend('routes');

log('bookManager: ', bookManager);

router.get('/', (context, next) => {
    context.body = 'helloooo!';
});

router.all('/bookmanager', graphqlHttpServer);

export default router;
