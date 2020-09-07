import Mongoose, { Schema, model,  } from "mongoose";
import { RateLimitState, RateLimitStore } from '@authentication/rate-limit';

export interface IRateLimitState extends Mongoose.Document, RateLimitState{
    userID: string;
};
const rateLimitStateSchema = new Schema<IRateLimitState>({
    userID: {type: String, required: true, unique: true},
    value: {type: Number, required: true},
    timestamp: {type: Number, required: true}
});

export const RateLimitStateModel = model<IRateLimitState, Mongoose.Model<IRateLimitState>>('Stronghold_ExpRateLimit', rateLimitStateSchema);
