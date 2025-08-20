import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import BlogModel from '../models/blog.model.js'

export const getBlogController = async (req, res) => {
    try {
        const { blogId } = req.params
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(404).json({
                message: 'Blog not Found!',
                error: true,
                success: false
            })
        }

        const isBlog = await BlogModel.findById(blogId)
        if (!isBlog) {
            return res.status(404).json({
                message: 'Blog not Found!',
                error: true,
                success: false
            })
        }

        const blog = await BlogModel.findById(blogId)
        return res.status(200).json({
            data: blog,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong!',
            error: true,
            success: false
        })
    }
}

export const getMultipleBlogsController = async (req, res) => {
    try {
        const blogs = await BlogModel.find()
        return res.status(200).json({
            data: blogs,
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong!',
            error: true,
            success: false
        })
    }
}

export const addAndUpdateBlogsController = async (req, res, isEdit) => {
    try {
        let blogId
        if (isEdit) {
            blogId = req.params.blogId
            if (!mongoose.Types.ObjectId.isValid(blogId)) {
                return res.status(404).json({
                    message: `Blog not Found!`,
                    error: true,
                    success: false
                })
            }
        }

        const { title, description, imgArr } = req.body
        const requiredFields = { title, description }
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({
                    message: `${key} is Required`,
                    error: true,
                    success: false
                })
            }
        }

        if (!Array.isArray(imgArr) || imgArr.length === 0) {
            return res.status(400).json({
                message: 'Kindly upload an Image!',
                error: true,
                success: false
            })
        }

        if (imgArr.length !== 1) {
            return res.status(400).json({
                message: `Can't upload more than one image`,
                error: true,
                success: false
            })
        }

        if (isEdit) {
            const isBlog = await BlogModel.findById(blogId)
            if (!isBlog) {
                return res.status(404).json({
                    message: `Blog not Found!`,
                    error: true,
                    success: false
                })
            }

            console.log(imgArr)

            await BlogModel.findByIdAndUpdate(
                blogId,
                {
                    $set: {
                        title,
                        description,
                        imgUrl: imgArr[0].imgUrl,
                        publicId: imgArr[0].publicId
                    }
                },
                { new: true }
            )

            const blogs = await BlogModel.find()

            return res.status(200).json({
                message: 'Blog Updated Successfully',
                data: blogs,
                error: false,
                success: true
            })
        }

        const newBlog = new BlogModel({
            title,
            description,
            imgUrl: imgArr[0].imgUrl,
            publicId: imgArr[0].publicId
        })

        await newBlog.save()

        const blogs = await BlogModel.find()

        return res.status(201).json({
            message: 'Blog Uploaded Successfully',
            data: blogs,
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong!',
            error: true,
            success: false
        })
    }
}

export const deleteBlogController = async (req, res) => {
    try {
        const { blogId } = req.params
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(404).json({
                message: `Blog not Found!`,
                error: true,
                success: false
            })
        }

        const isBlog = await BlogModel.findById(blogId)
        if (!isBlog) {
            return res.status(404).json({
                message: `Blog not Found!`,
                error: true,
                success: false
            })
        }

        await cloudinary.uploader.destroy(isBlog.publicId)
        await BlogModel.deleteOne({ _id: blogId })
        const blogs = await BlogModel.find()

        return res.status(200).json({
            message: 'Blog Removed Successfully',
            data: blogs,
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong!',
            error: true,
            success: false
        })
    }
}

export const deleteMultipleBlogsController = async (req, res) => {
    try {
        const { blogIds } = req.body
        if (!Array.isArray(blogIds)) {
            return res.status(400).json({
                message: 'Kindly hahaha select a Blog',
                error: true,
                success: false
            })
        }
        if (blogIds.length === 0) {
            return res.status(400).json({
                message: 'Kindly select a Blog',
                error: true,
                success: false
            })
        }

        for (const id of blogIds) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({
                    message: `Blog not Found!`,
                    error: true,
                    success: false
                })
            }
        }

        const isBlogs = await BlogModel.find({ _id: { $in: blogIds } })
        if (isBlogs.length !== blogIds.length) {
            return res.status(400).json({
                message: `There was an Invalid or Deleted Blog`,
                error: true,
                success: false
            })
        }

        await Promise.allSettled(isBlogs.map(blog => cloudinary.uploader.destroy(blog.publicId)))
        await BlogModel.deleteMany({ _id: { $in: blogIds } })
        const blogs = await BlogModel.find()

        return res.status(200).json({
            message: `${blogIds.length} Blog${blogIds.length > 1 ? 's' : ''} Removed Successfully`,
            data: blogs,
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong!',
            error: true,
            success: false
        })
    }
}