import Mongoose, { Schema, model,  } from "mongoose";

export interface IVisitor extends Mongoose.Document{
    identifier: string;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
};
const visitorSchema = new Schema<IVisitor>({
    identifier: {type: String, required: true, unique: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    accessToken: {type: String, required: false},
    refreshToken: {type: String, required: false},
    accessTokenExpiresAt: {type: Date, required: false},
    refreshTokenExpiresAt: {type: Date, required: false}
});

export const Visitor = model<IVisitor, Mongoose.Model<IVisitor>>('Stronghold_Visitor', visitorSchema);
