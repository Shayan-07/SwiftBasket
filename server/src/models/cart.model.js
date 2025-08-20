import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'product',
        required: true,
        index: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
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

const CartModel = mongoose.model('cart', cartSchema)

export default CartModel
