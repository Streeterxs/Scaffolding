import mongoose from 'mongoose';

export interface ICategory extends mongoose.Document {
    name: string;
    books: string[];
    createdAt: number;
    updatedAt: number;
};

const categorySchema = new mongoose.Schema({
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

const Category = mongoose.model<ICategory>('BookScaffolding_Category', categorySchema);

export default Category;
