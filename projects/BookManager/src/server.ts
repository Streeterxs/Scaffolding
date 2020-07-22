
import { createServer } from 'http';

import app from './app';
import { connectToDb } from './database';

(async () => {
  await connectToDb();

  const server = createServer(app.callback());

  server.listen('3333', () => {
      console.log('Server is on');
  });
})();
