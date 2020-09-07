import { connectToDb } from "../database";

import { appLogger } from "../appLogger";
import { RateLimitStateModel } from "../modules/rateLimit/rateLimitStateModel";

const log = appLogger.extend('scripts:clearRateLimit');

(async () => {

    await connectToDb();

    await RateLimitStateModel.deleteMany({}, () => {
        log('All rate limits deleted');
    });

    process.exit();
})();
