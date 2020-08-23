import { connectToDb } from "./database";
import { createServer } from "http";

import app from "./app";
import { appLogger } from "./appLogger";

const log = appLogger.extend('server');

(async () => {

    await connectToDb();

    const server = createServer(app.callback());

    server.listen('3233', () => {
        log('server is on');
    });
})();
