import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import HomeSlideModel from '../models/homeSlide.model.js'

export const getHomeSlidesController = async (req, res) => {
    try {
        const homeSlides = await HomeSlideModel.find()
        return res.status(200).json({
            data: homeSlides,
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

export const addAndUpdateHomeSlidesController = async (req, res, isEdit) => {
    try {
        let homeSlideId
        if (isEdit) homeSlideId = req.params.homeSlideId

        const { imgArr } = req.body

        if (!Array.isArray(imgArr) || imgArr.length === 0) {
            return res.status(400).json({
                message: `Kindly upload an image`,
                error: true,
                success: false,
            })
        }

        if (isEdit) {
            if (imgArr.length !== 1) {
                return res.status(200).json({
                    message: `Can't upload more than 1 Image to update`,
                    error: true,
                    success: false
                })
            }

            if (!mongoose.Types.ObjectId.isValid(homeSlideId)) {
                return res.status(404).json({
                    message: "Home Slide not Found!",
                    error: true,
                    success: false
                })
            }

            const isHomeSlide = await HomeSlideModel.findById(homeSlideId)
            if (!isHomeSlide) {
                return res.status(404).json({
                    message: "Home Slide not Found!",
                    error: true,
                    success: false
                })
            }

            const { imgUrl, publicId } = imgArr[0]

            await HomeSlideModel.findByIdAndUpdate(
                homeSlideId,
                { $set: { imgUrl, publicId } },
                { new: true }
            )

            const homeSlides = await HomeSlideModel.find()
            return res.status(200).json({
                message: "Home Slide Updated Successfully",
                data: homeSlides,
                error: false,
                success: true
            })
        }

        await Promise.all(
            imgArr.map(img => {
                const { imgUrl, publicId } = img
                const newHomeSlide = new HomeSlideModel({ imgUrl, publicId })
                return newHomeSlide.save()
            })
        )

        const homeSlides = await HomeSlideModel.find()

        return res.status(201).json({
            message: 'Home Slides Uploaded Successfully',
            data: homeSlides,
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

export const deleteHomeSlideController = async (req, res) => {
    try {
        const { homeSlideId } = req.params
        if (!homeSlideId) {
            return res.status(400).json({
                message: "Kindly select a Slide image",
                error: true,
                success: false
            })
        }

        if (!mongoose.Types.ObjectId.isValid(homeSlideId)) {
            return res.status(404).json({
                message: "Home Slide not Found!",
                error: true,
                success: false
            })
        }

        const isHomeSlide = await HomeSlideModel.findById(homeSlideId)
        if (!isHomeSlide) {
            return res.status(404).json({
                message: "Home Slide not Found!",
                error: true,
                success: false
            })
        }

        await cloudinary.uploader.destroy(isHomeSlide.publicId)

        await HomeSlideModel.deleteOne({ _id: homeSlideId })
        const homeSlides = await HomeSlideModel.find()

        return res.status(200).json({
            message: "Home Slide Removed Successfully",
            data: homeSlides,
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

export const deleteMultipleHomeSlidesController = async (req, res) => {
    try {
        const { homeSlideIds } = req.body
        if (!Array.isArray(homeSlideIds) || homeSlideIds.length === 0) {
            return res.status(400).json({
                message: "Kindly select a Slide image",
                error: true,
                success: false
            })
        }

        for (const id of homeSlideIds) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({
                    message: "Home Slides not Found!",
                    error: true,
                    success: false
                })
            }
        }

        const isHomeSlides = await HomeSlideModel.find({ _id: { $in: homeSlideIds } })
        if (isHomeSlides.length !== homeSlideIds.length) {
            return res.status(404).json({
                message: "There was an Invalid or Deleted Home Slide!",
                error: true,
                success: false
            })
        }

        const prevSlidePublicIds = isHomeSlides.map(slide => slide.publicId)
        await Promise.allSettled(
            prevSlidePublicIds.map(publicId => cloudinary.uploader.destroy(publicId))
        )

        await HomeSlideModel.deleteMany({ _id: { $in: homeSlideIds } })
        const homeSlides = await HomeSlideModel.find()

        return res.status(200).json({
            message: `${homeSlideIds.length} Home Slide${homeSlideIds.length > 1 ? 's' : ''} Removed Successfully`,
            data: homeSlides,
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