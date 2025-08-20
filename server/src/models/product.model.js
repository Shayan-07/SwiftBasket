import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'category',
        required: true,
        index: true
    },
    subCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'subCategory',
        index: true
    },
    nestedSubCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'nestedSubCategory',
        index: true
    },
    isOrphan: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountedPrice: {
        type: Number,
        required: true,
        min: 0
    },
    brandName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    soldItemsCount: {
        type: Number,
        default: 0
    },
    review: [{
        comment: {
            type: String,
            lowercase: true,
            trim: true
        },
        rating: {
            type: Number,
            default: 0.5,
            min: 0.5,
            max: 5
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            index: true
        },
        reviewDate: {
            type: Date,
            default: Date.now()
        }
    }],
    totalRating: {
        type: Number,
        default: 0.5,
        min: 0.5,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0,
        min: 0
    },
    mediaImgUrls: {
        type: [String],
        default: []
    },
    mediaImgPublicIds: {
        type: [String],
        default: []
    }
},
    { timestamps: true }
)

const ProductModel = mongoose.model('product', productSchema)

export default ProductModel