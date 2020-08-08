import koa, { Context } from 'koa';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import cors from 'kcors';

import {appLogger} from './appLogger';
import router from './routes';

const log = appLogger.extend('entry');
const app = new koa();
app.use(helmet());
app.use(logger());
app.use(cors());

app.use(router.routes());
export default app;
