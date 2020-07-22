import Dataloader from 'dataloader';
import Category from './CategoryModel';

export const categoryLoader = new Dataloader((keys: string[]) => Category.find({_id: {$in: keys}}));

export const loadCategory = async (id: string) => {
    const category = await categoryLoader.load(id);
    return category;
}
