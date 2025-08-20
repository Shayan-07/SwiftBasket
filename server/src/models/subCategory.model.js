import mongoose from "mongoose"

const subCategorySchema = mongoose.Schema({
    subCategory: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'category',
        required: true,
        index: true
    },
    nestedSubCategory: [{
        type: mongoose.Schema.ObjectId,
        ref: 'nestedSubCategory',
        index: true
    }]
},
    { timestamps: true }
)

const SubCategoryModel = mongoose.model('subCategory', subCategorySchema)

export default SubCategoryModel