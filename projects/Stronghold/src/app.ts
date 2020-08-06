import koa, { Context } from 'koa';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import httpProxy from 'http-proxy';

import {appLogger} from './appLogger';

const log = appLogger.extend('entry');
const proxy = httpProxy.createProxyServer();
const app = new koa();
app.use(helmet());
app.use(logger());

function webProxy(context: Context, options: httpProxy.ServerOptions) {

    return new Promise((resolve, reject) => {
        context.res.on('finish', resolve);
        proxy.web(context.req, context.res, options, reject);
    });
};

app.use(async (context, next) => {
    try {

        log('context: ', context);
        await webProxy(context, {target: 'http://localhost:3333'});
    } catch (error) {

        log('error: ', error);
    } finally {

        next();
    }
});

export default app;
