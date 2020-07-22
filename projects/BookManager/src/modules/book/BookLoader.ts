import Dataloader from 'dataloader';
import Book from './BookModel';

export const bookLoader = new Dataloader((keys: string[]) => Book.find({_id: {$in: keys}}));

export const loadBook = async (id: string) => {
    const book = await bookLoader.load(id);
    return book;
}
