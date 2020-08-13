import mongoose, { Schema, model } from "mongoose";

export interface IPerson extends mongoose.Document {
    name: string;
    lastname: string;
    users: string[]
};
const personSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    users: {
        type: [String],
        required: true,
        default: []
    }
});

export const Person = model<IPerson>('PersonsSector_Person', personSchema);
