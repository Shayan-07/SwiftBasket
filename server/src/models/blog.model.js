import mongoose from "mongoose"

const blogSchema = mongoose.Schema({
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
    imgUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)

const BlogModel = mongoose.model('blog', blogSchema)
export default BlogModel
