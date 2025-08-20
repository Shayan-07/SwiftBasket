import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid Email!']
    },
    password: {
        type: String,
        required: function() {
            return !this.isGoogleAuth;
        },
    },
    avatar: {
        type: String,
        default: '',
        lowercase: true,
        trim: true
    },
    publicId: {
        type: String,
        default: '',
        lowercase: true,
        trim: true
    },
    loginDate: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        lowercase: true,
        trim: true
    },
    isGoogleAuth: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailVerifyOTP: {
        type: Number,
        default: null
    },
    expEmailVerifyOTP: {
        type: Date,
        default: null
    },
    unverifiedExpireAt: {
        type: Date,
        default: null,
        index: {
            expireAfterSeconds: 0
        }
    },
    passOTP: {
        type: Number,
        default: null
    },
    expPassOTP: {
        type: Date,
        default: null
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    address: [{
        type: mongoose.Schema.ObjectId,
        ref: 'address',
        index: true
    }],
    cart: [{
        type: mongoose.Schema.ObjectId,
        ref: 'cart',
        index: true
    }],
    wishlist: [{
        type: mongoose.Schema.ObjectId,
        ref: 'wishlist',
        index: true
    }],
    order: [{
        type: mongoose.Schema.ObjectId,
        ref: 'order',
        index: true
    }]
}, {
    timestamps: true
})

userSchema.methods.generateAuthToken = async function (expiresIn) {
    const tokenCode = {}
    if (expiresIn) tokenCode.expiresIn = expiresIn

    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY, tokenCode)
    this.tokens.push({ token })
    await this.save()
    return token
}

const UserModel = mongoose.model('user', userSchema)

export default UserModel
