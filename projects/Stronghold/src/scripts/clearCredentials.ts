import { connectToDb } from "../database";

import { appLogger } from "../appLogger";
import { Credentials } from "../modules/credentials/credentialsModel";

const log = appLogger.extend('scripts:clearCredentials');

(async () => {

    await connectToDb();

    await Credentials.deleteMany({}, () => {
        log('All credentials deleted');
    });

    process.exit();
})();
