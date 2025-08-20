import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
    addressLine: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    postalCode: {
        type: Number,
        required: true
    },
    landmark: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    addressOf: {
        type: String,
        enum: ['home', 'office', 'other'],
        default: 'home',
        lowercase: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        index: true
    },
},
    { timestamps: true }
)

const AddressModel = mongoose.model('address', addressSchema)

export default AddressModel