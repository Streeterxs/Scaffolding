
import { createServer } from 'http';

import app from './app';

(async () => {
  const server = createServer(app.callback());

  server.listen('3333', () => {
      console.log('Server is on');
  });
})();