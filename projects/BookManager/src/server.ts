
import { createServer } from 'http';

import app from './app';
import { connectToDb } from './database';
import { appLogger } from './appLogger';

const log = appLogger.extend('server');

(async () => {
  const connection = await connectToDb();

  log('db connect ready states: ', connection.readyState);

  // log('db connect return: ', connection);

  const server = createServer(app.callback());

  server.listen('3333', () => {
      log('Server is on port 3333');
  });
})();
