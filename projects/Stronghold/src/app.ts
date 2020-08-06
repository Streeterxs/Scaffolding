import koa from 'koa';
import helmet from 'koa-helmet';
import logger from 'koa-logger';

import {appLogger} from './appLogger';

const app = new koa();
app.use(helmet());
app.use(logger());

export default app;