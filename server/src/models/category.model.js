import mongoose from "mongoose"

const categorySchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    imgUrl: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    publicId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    subCategory:[{
        type: mongoose.Schema.ObjectId,
        ref: 'subCategory',
        index: true
    }]
},
    { timestamps: true }
)

const CategoryModel = mongoose.model('category', categorySchema)

export default CategoryModel