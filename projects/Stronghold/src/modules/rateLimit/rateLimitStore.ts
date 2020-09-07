import { RateLimitStore, RateLimitState } from '@authentication/rate-limit';

import { loadRateLimit } from './rateLimitLoader';
import { RateLimitStateModel } from './rateLimitStateModel';

export class RateStore implements RateLimitStore<string> {

  async save(id: string, state: RateLimitState, oldState: RateLimitState): Promise<void | {}> {

    const currentState = await loadRateLimit(id);

    if (
      currentState?.timestamp !== oldState.timestamp ||
      currentState?.value !== oldState.value
    ) {
      throw new Error('Concurrent saves are not allowed');
    }

    if (currentState) {

      currentState.timestamp = state.timestamp;
      currentState.value = state.value;
      await currentState.save();

    } else {

      const newRateLimit = new RateLimitStateModel({
        userID: id,
        value: state.timestamp,
        timestamp: state.value
      });

      await newRateLimit.save();
    }
  };

  async load(id: string): Promise<null | RateLimitState> {

    const rateLimitFinded = await loadRateLimit(id);
    return rateLimitFinded;
  };

  async remove(id: string): Promise<void | null | {}> {

    const rateLimitFinded = await loadRateLimit(id);

    if (rateLimitFinded) {

      await rateLimitFinded.remove();
    }
  };

}
