import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import AdsBannerModel from '../models/adsBanner.model.js'
import CategoryModel from '../models/category.model.js'
import SubCategoryModel from '../models/subCategory.model.js'
import NestedSubCategoryModel from '../models/nestedSubCategory.model.js'

export const getAdsBannersController = async (req, res) => {
    try {
        const adsBanners = await AdsBannerModel.find().populate('category').populate('subCategory').populate('nestedSubCategory')
        return res.status(200).json({
            data: adsBanners,
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

export const addAndUpdateAdsBannersController = async (req, res, isEdit) => {
    try {
        let adsBannerId
        if (isEdit) adsBannerId = req.params.adsBannerId
        const { category, subCategory, nestedSubCategory, imgArr } = req.body

        const validSubCategory = subCategory && subCategory !== '' ? subCategory : null
        const validNestedSubCategory = nestedSubCategory && nestedSubCategory !== '' ? nestedSubCategory : null

        if (!category) {
            return res.status(400).json({
                message: 'Category is Required',
                error: true,
                success: false
            })
        }

        const idsToValidate = {
            ...(isEdit && { 'Banner': adsBannerId }),
            'Category': category,
            ...(validSubCategory && { 'Sub Category': validSubCategory }),
            ...(validNestedSubCategory && { 'Nested Sub Category': validNestedSubCategory })
        }

        for (const [key, value] of Object.entries(idsToValidate)) {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return res.status(404).json({
                    message: `${key} not Found!`,
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

        const [checkBanner, checkCat, checkSubCat, checkNestedSubCat] = await Promise.all([
            isEdit ? AdsBannerModel.findById(adsBannerId) : null,
            CategoryModel.findById(category),
            validSubCategory ? SubCategoryModel.findOne({ _id: validSubCategory, category }) : null,
            validNestedSubCategory ? NestedSubCategoryModel.findOne({ _id: validNestedSubCategory, subCategory: validSubCategory }) : null
        ])

        const dbRefs = {
            ...(isEdit && { 'Banner': checkBanner }),
            'Category': checkCat,
            ...(validSubCategory && { 'Sub Category': checkSubCat }),
            ...(validNestedSubCategory && { 'Nested Sub Category': checkNestedSubCat })
        }
        for (const [key, value] of Object.entries(dbRefs)) {
            if (!value) {
                return res.status(404).json({
                    message: `${key} not Found!`,
                    error: true,
                    success: false
                })
            }
        }

        if (isEdit) {
            const updateFields = {
                category,
                imgUrl: imgArr[0].imgUrl,
                publicId: imgArr[0].publicId,
                subCategory: validSubCategory,
                nestedSubCategory: validNestedSubCategory
            }

            await AdsBannerModel.findByIdAndUpdate(adsBannerId, { $set: updateFields }, { new: true })
            const adsBanners = await AdsBannerModel.find().populate('category').populate('subCategory').populate('nestedSubCategory')

            return res.status(200).json({
                data: adsBanners,
                message: 'Banner Updated Successfully',
                error: false,
                success: true
            })
        }

        const newAdsBanner = new AdsBannerModel({
            category,
            subCategory: validSubCategory,
            nestedSubCategory: validNestedSubCategory,
            imgUrl: imgArr[0].imgUrl,
            publicId: imgArr[0].publicId
        })

        await newAdsBanner.save()
        const adsBanners = await AdsBannerModel.find().populate('category').populate('subCategory').populate('nestedSubCategory')

        return res.status(201).json({
            message: 'Banner Uploaded Successfully',
            data: adsBanners,
            error: false,
            success: true,
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong!',
            error: true,
            success: false
        })
    }
}

export const deleteAdsBannersController = async (req, res) => {
    try {
        const { adsBannerId } = req.params
        if (!adsBannerId) {
            return res.status(400).json({
                message: `Kindly select a Banner`,
                error: true,
                success: false
            })
        }

        if (!mongoose.Types.ObjectId.isValid(adsBannerId)) {
            return res.status(404).json({
                message: `Banner not Found!`,
                error: true,
                success: false
            })
        }

        const isAdsBanner = await AdsBannerModel.findById(adsBannerId)
        if (!isAdsBanner) {
            return res.status(404).json({
                message: `Banner not Found!`,
                error: true,
                success: false
            })
        }

        await cloudinary.uploader.destroy(isAdsBanner.publicId)
        await AdsBannerModel.deleteOne({ _id: adsBannerId })
        const adsBanners = await AdsBannerModel.find().populate('category').populate('subCategory').populate('nestedSubCategory')

        return res.status(200).json({
            message: 'Banner Removed Successfully',
            data: adsBanners,
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

export const deleteMultipleAdsBannersController = async (req, res) => {
    try {
        const { adsBannerIds } = req.body
        if (!Array.isArray(adsBannerIds) || adsBannerIds.length === 0) {
            return res.status(400).json({
                message: `Kindly select a Banner`,
                error: true,
                success: false
            })
        }

        for (const id of adsBannerIds) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({
                    message: `Banner not Found!`,
                    error: true,
                    success: false
                })
            }
        }

        const isAdsBanner = await AdsBannerModel.find({ _id: { $in: adsBannerIds } })
        if (isAdsBanner.length !== adsBannerIds.length) {
            return res.status(400).json({
                message: `There was an Invalid or Deleted Banner`,
                error: true,
                success: false
            })
        }

        const adsBannerImgs = isAdsBanner.map(banner => banner.publicId)
        await Promise.allSettled(
            adsBannerImgs.map(bannnerPublicId => cloudinary.uploader.destroy(bannnerPublicId))
        )

        await AdsBannerModel.deleteMany({ _id: { $in: adsBannerIds } })
        const adsBanners = await AdsBannerModel.find().populate('category').populate('subCategory').populate('nestedSubCategory')

        return res.status(200).json({
            message: `${adsBannerIds.length} Ad Banner${adsBannerIds.length > 1 ? 's' : ''} Removed Successfully`,
            data: adsBanners,
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