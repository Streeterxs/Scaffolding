import app from './app';
import http from 'http';

import {appLogger} from './appLogger';
import { connectToDb } from './database';

const log = appLogger.extend('server');
const server = http.createServer(app.callback());

(async () => {

    await connectToDb();

    server.listen('3535', () => {
        log('server is on');
    });
})()

