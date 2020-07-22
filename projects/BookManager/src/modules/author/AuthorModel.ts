import mongoose from 'mongoose';

export interface IAuthor extends mongoose.Document {
    name: string;
    books: string[];
    createdAt: number;
    updatedAt: number;
};

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    books: {
        type: [String],
        required: true,
        default: []
    }
}, {timestamps: true});

const Author = mongoose.model<IAuthor>('BookScaffolding_Author', authorSchema);

export default Author;
