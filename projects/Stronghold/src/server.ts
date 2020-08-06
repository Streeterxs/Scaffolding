import app from './app';
import http from 'http';

import {appLogger} from './appLogger';

const log = appLogger.extend('server');
const server = http.createServer(app.callback());

server.listen('8080', () => {
    log('server is on');
});
