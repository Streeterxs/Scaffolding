import koa, { Context } from 'koa';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import cors from 'kcors';
import bodyparser from 'koa-bodyparser';
import fetch from 'node-fetch';

import {appLogger} from './appLogger';
import { router } from './routes';

const log = appLogger.extend('entry');
log('new log');
if (!globalThis.fetch) {
    globalThis.fetch = (fetch as any);
}
const app = new koa();
app.use(helmet());
app.use(logger());
app.use(cors());
app.use(bodyparser());

app.use(router.routes());
export default app;
