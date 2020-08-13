import dataloader from 'dataloader';
import { Person } from './PersonModel';

const personLoader = new dataloader((keys: string[]) => Person.find({_id: {$in: keys}}));

export const loadPerson = async (personId: string) => {
    const personFinded = await personLoader.load(personId);
    return personFinded;
};