import { RateLimitStore, RateLimitState } from '@authentication/rate-limit';
import { loadRateLimit, removeRateLimit } from './rateLimitLoader';

export class RateStore implements RateLimitStore<string> {

    async save(id: string, state: RateLimitState, oldState: RateLimitState): Promise<void | {}> {

        const currentState = await loadRateLimit(id);

        if (
          currentState?.timestamp !== oldState.timestamp ||
          currentState?.value !== oldState.value
        ) {
          throw new Error('Concurrent saves are not allowed');
        }

        currentState.timestamp = state.timestamp;
        currentState.value = state.value;
        await currentState.save();
    };

    async load(id: string): Promise<null | RateLimitState> {

        const rateLimitFinded = await loadRateLimit(id);
        return rateLimitFinded;
    };

    async remove(id: string): Promise<void | null | {}> {

        await removeRateLimit(id);
    };

}