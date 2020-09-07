import Mongoose, { Schema, model,  } from "mongoose";
import { permissions } from '@BookScaffolding/personssector';

export interface ICredentials extends Mongoose.Document{
    identifier: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
    permission: permissions;
};
const credentialsSchema = new Schema<ICredentials>({
    identifier: {type: String, required: true, unique: true},
    accessToken: {type: String, required: false},
    refreshToken: {type: String, required: false},
    accessTokenExpiresAt: {type: Date, required: false},
    refreshTokenExpiresAt: {type: Date, required: false},
    permission: {type: Number, required: true, default: permissions.visitor}
});

export const Credentials = model<ICredentials, Mongoose.Model<ICredentials>>('Stronghold_credentials', credentialsSchema);
