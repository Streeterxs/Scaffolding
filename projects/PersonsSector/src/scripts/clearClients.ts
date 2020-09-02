import { connectToDb } from "../database";
import { appLogger } from "../appLogger";
import { OAuthClient } from "../modules/user/UserModel";

const log = appLogger.extend('scripts:clearUsers');

(async () => {

    await connectToDb();

    await OAuthClient.deleteMany({}, () => {
        log('All users deleted');
    });

    process.exit();
})();
