import Dataloader from 'dataloader';
import Author from './AuthorModel';

export const authorLoader = new Dataloader((keys: string[]) => Author.find({_id: {$in: keys}}));

export const loadAuthor = async (id: string) => {
    const author = await authorLoader.load(id);
    return author;
}
