import dataloader from 'dataloader';

import { RateLimitStateModel } from './rateLimitStateModel';

const rateLimitLoader = new dataloader((keys: string[]) => RateLimitStateModel.find({userID: {$in: keys}}));

export const loadRateLimit = async (userId: string) => {

    const rateLimitFinded = await rateLimitLoader.load(userId);
    return rateLimitFinded;
};

export const loadManyRateLimit = async (usersId: string[]) => {

    const rateLimitFinded = await rateLimitLoader.loadMany(usersId);
    return rateLimitFinded;
};
