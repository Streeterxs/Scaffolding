import mongoose from 'mongoose';

export interface IBook extends mongoose.Document {
    name: string;
    author: string;
    categories: string[];
    editions: string[];
    createdAt: number;
    updatedAt: number;
};

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    categories: {
        type: [String],
        required: false
    },
    editions: {
        type: [String],
        required: true,
        default: []
    }
}, {timestamps: true});

const Book = mongoose.model<IBook>('BookScaffolding_Book', bookSchema);

export default Book;
