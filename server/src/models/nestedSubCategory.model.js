import mongoose from "mongoose"

const nestedSubCategorySchema = mongoose.Schema({
    nestedSubCategory: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    subCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'subCategory',
        required: true,
        index: true
    }
},
    { timestamps: true }
)

const NestedSubCategoryModel = mongoose.model('nestedSubCategory', nestedSubCategorySchema)

export default NestedSubCategoryModel