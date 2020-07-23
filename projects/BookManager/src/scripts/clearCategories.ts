import { connectToDb } from "../database";
import Category from "../modules/category/CategoryModel";

(async () => {

    await connectToDb();

    await Category.deleteMany({}, () => {
        console.log('All categories deleted');
    });

    process.exit();
})();