import debug from 'debug';
import { connectToDb } from "../database";
import Book from "../modules/book/BookModel";

const log = debug('projects:bookmanager:scripts:clearBooks');

(async () => {

    await connectToDb();

    await Book.deleteMany({}, () => {
        log('All books deleted');
    });

    process.exit();
})();