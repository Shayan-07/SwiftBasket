import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            },
            discount: {
                type: Number,
                required: true,
                default: 0
            },
            subTotal: {
                type: Number,
                required: true,
                default: 0
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    address: {
        type: mongoose.Schema.ObjectId,
        ref: 'address',
        required: true,
        index: true
    },
    paymentId: {
        type: String,
        default: ''
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'razor-pay', 'paypal'],
        default: ""
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date,
        default: null
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date,
        default: null
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        lowercase: true,
        trim: true
    },
    total: {
        type: Number,
        required: true,
        default: 0
    }
},
    { timestamps: true }
)

const OrderModel = mongoose.model('order', orderSchema)

export default OrderModel