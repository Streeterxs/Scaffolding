import mongoose from 'mongoose';

export interface IEdition extends mongoose.Document {
    edition: number;
    publishing: string;
    year: number;
    pages: number;
    language: string;
    book: string;
    createdAt: number;
    updatedAt: number;
};

const editionSchema = new mongoose.Schema({
    edition: {
        type: Number,
        required: true
    },
    publishing: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    book: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Edition = mongoose.model<IEdition>('BookManager_Edition', editionSchema);

export default Edition;
