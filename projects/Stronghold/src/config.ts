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
    db_url: `${ENV.MONGODB_URL}`
};

log('config: ', config);

export default config;