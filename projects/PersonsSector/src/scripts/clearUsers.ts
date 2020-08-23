import { connectToDb } from "../database";
import { User } from '../modules/user/UserModel';
import { appLogger } from "../appLogger";

const log = appLogger.extend('scripts:clearUsers');

(async () => {

    await connectToDb();

    await User.deleteMany({}, () => {
        log('All users deleted');
    });

    process.exit();
})();
