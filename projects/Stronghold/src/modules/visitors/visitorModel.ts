import Mongoose, { Schema, model,  } from "mongoose";

export interface IVisitor extends Mongoose.Document{
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
};
const visitorSchema = new Schema<IVisitor>({
    username: {type: String, required: true},
    email: {type: String, required: true},
    accessToken: {type: String, required: true},
    refreshToken: {type: String, required: true},
    accessTokenExpiresAt: {type: Date, required: true},
    refreshTokenExpiresAt: {type: Date, required: true}
});

export const Visitor = model<IVisitor, Mongoose.Model<IVisitor>>('Stronghold_Visitor', visitorSchema);
