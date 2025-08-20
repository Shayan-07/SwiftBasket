import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'product',
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
},
    { timestamps: true }
)

const WishlistModel = mongoose.model('wishlist', wishlistSchema)

export default WishlistModel
