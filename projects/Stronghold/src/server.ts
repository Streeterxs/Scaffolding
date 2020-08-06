import app from './app';
import http from 'http';

import {appLogger} from './appLogger';

const log = appLogger.extend('server');
const server = http.createServer(app.callback());

server.listen('3535', () => {
    log('server is on');
});


http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers));
    res.end();
  }).listen(9003);