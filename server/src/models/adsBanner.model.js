import mongoose from "mongoose"

const adsBannerSchema = mongoose.Schema({
    category:{
        type: mongoose.Schema.ObjectId,
        required: true,
        index: true,
        ref: 'category'
    },
    subCategory:{
        type: mongoose.Schema.ObjectId,
        index: true,
        ref: 'subCategory'
    },
    nestedSubCategory:{
        type: mongoose.Schema.ObjectId,
        index: true,
        ref: 'nestedSubCategory'
    },
    imgUrl:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    publicId:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
},
    { timestamps: true }
)

const AdsBannerModel = mongoose.model('adsBanner', adsBannerSchema)
export default AdsBannerModel
