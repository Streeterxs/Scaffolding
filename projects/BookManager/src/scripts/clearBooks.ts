import { connectToDb } from "../database";
import Book from "../modules/book/BookModel";

(async () => {

    await connectToDb();

    await Book.deleteMany({}, () => {
        console.log('All books deleted');
    });

    process.exit();
})();