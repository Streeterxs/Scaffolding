import path from 'path';
import dotenvsafe from 'dotenv-safe';

import { appLogger } from './appLogger';

const log = appLogger.extend('config');

const cwd = process.cwd();
log('cwd: ', cwd);
const root = path.join.bind(cwd);

dotenvsafe.config({
    path: root('.env'),
    sample: root('.env.example')
});

const ENV = process.env;
log('ENV: ', ENV);
log('ENV.NODE_ENV: ', ENV.NODE_ENV);
const config = {
    db_url: `${ENV.MONGODB_URL}`,
    services: {
        personssector: {
            baseurl: `${ENV.PERSONSSECTOR_URL}`,
            // Use array order to point your routes, example at routes.ts
            routes:`${ENV.PERSONSSECTOR_ROUTES}`.split('/')
        }
    },
    credentials: {
        clientId: `${ENV.CLIENT_ID}`,
        clientSecret: `${ENV.CLIENT_SECRET}`
    },
    visitorsPassword: `${ENV.VISITORS_PASSWORD}`
};

log('config: ', config);

export default config;