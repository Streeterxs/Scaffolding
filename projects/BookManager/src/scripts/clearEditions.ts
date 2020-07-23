import { connectToDb } from "../database";
import Edition from "../modules/edition/EditionModel";

(async () => {

    await connectToDb();

    await Edition.deleteMany({}, () => {
        console.log('All editions was deleted');
    });

    process.exit();
})();