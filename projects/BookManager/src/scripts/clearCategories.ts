import { connectToDb } from "../database";
import Category from "../modules/category/CategoryModel";
import debug from 'debug';

const log = debug('projects:bookmanager:scripts:clearCategories');

(async () => {

    await connectToDb();

    await Category.deleteMany({}, () => {
        log('All categories deleted');
    });

    process.exit();
})();