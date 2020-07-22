import Dataloader from 'dataloader';
import Edition from './EditionModel';

export const editionLoader = new Dataloader((keys: string[]) => Edition.find({_id: {$in: keys}}));

export const loadEdition = async (id: string) => {
    const edition = await editionLoader.load(id);
    return edition;
}
