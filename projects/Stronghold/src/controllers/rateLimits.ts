import {BucketRateLimit, ExponentialRateLimit} from '@authentication/rate-limit';

import { RateStore } from '../modules/rateLimit/rateLimitStore';

export const exponencialRateLimit = new ExponentialRateLimit(new RateStore(), {
    baseDelay: '1 second',
    factor: 2,
    freeAttempts: 1,
});

export const bucketRateLimit = new BucketRateLimit(new RateStore(), {
    interval: '1 second',
    maxSize: 10,
});
