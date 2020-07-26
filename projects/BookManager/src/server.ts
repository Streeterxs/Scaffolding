
import { createServer } from 'http';

import app from './app';
import { connectToDb } from './database';

(async () => {
  const connection = await connectToDb();

  console.log('db connect ready states: ', connection.readyState);

  // console.log('db connect return: ', connection);

  const server = createServer(app.callback());

  server.listen('3333', () => {
      console.log('Server is on');
  });
})();
