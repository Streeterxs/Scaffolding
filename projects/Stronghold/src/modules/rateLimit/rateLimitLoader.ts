import dataloader from 'dataloader';

import { RateLimitStateModel } from './rateLimitStateModel';
import { appLogger } from '../../appLogger';

const log = appLogger.extend('rateLimitLoader');
const rateLimitLoader = new dataloader((keys: string[]) => RateLimitStateModel.find({userID: {$in: keys}}));

export const loadRateLimit = async (userId: string) => {

    try {

        log('typeof userId: ', typeof userId);
        const rateLimitFinded = await rateLimitLoader.load(userId);
        return rateLimitFinded;
    } catch (err) {

        log('dataloader error: ', err);
        return null;
    }
};

export const loadManyRateLimit = async (usersId: string[]) => {

    try {

        const rateLimitFinded = await rateLimitLoader.loadMany(usersId);
        return rateLimitFinded;
    } catch (err) {

        log('dataloader error: ', err);
        return null;
    }
};
