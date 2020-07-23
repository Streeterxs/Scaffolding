import Author from "../modules/author/AuthorModel";
import { connectToDb } from "../database";

(async () => {

    await connectToDb();

    await Author.deleteMany({}, () => {
        console.log('All authors deleted');
    });

    process.exit();
})();