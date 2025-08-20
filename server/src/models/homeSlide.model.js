import mongoose from "mongoose";

const homeSlideSchema = mongoose.Schema({
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
    }
},
    { timestamps: true }
)

const HomeSlideModel = mongoose.model('homeSlide', homeSlideSchema)

export default HomeSlideModel