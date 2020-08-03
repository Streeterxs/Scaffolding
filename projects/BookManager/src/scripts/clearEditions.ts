import debug from "debug";

import { connectToDb } from "../database";
import Edition from "../modules/edition/EditionModel";

const log = debug('projects:bookmanager:scripts:clearEditions');

(async () => {

    await connectToDb();

    await Edition.deleteMany({}, () => {
        log('All editions was deleted');
    });

    process.exit();
})();