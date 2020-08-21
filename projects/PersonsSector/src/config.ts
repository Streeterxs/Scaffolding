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

const config = {
    db_url: `${ENV.MONGODB_URL}`,
};

export const clients: {id: string, secret: string}[] = [
    {
        id: `${ENV.STRONGHOLD_CLIENT_ID}`,
        secret: `${ENV.STRONGHOLD_CLIENT_SECRET}`
    },
];

log('config: ', config);
log('clients: ', clients);

export default config;