import Author from "../modules/author/AuthorModel";
import { connectToDb } from "../database";
import debug from 'debug';

const log = debug('projects:bookmanager:scripts:clearAuthor');

(async () => {

    await connectToDb();

    await Author.deleteMany({}, () => {
        log('All authors deleted');
    });

    process.exit();
})();