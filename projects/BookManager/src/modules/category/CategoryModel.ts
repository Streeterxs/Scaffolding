import mongoose from 'mongoose';

export interface ICategory extends mongoose.Document {
    name: string;
    count: number;
    createdAt: number;
    updatedAt: number;
};

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true});

const Category = mongoose.model<ICategory>('BookScaffolding_Category', categorySchema);

export default Category;
