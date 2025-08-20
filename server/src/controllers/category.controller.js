import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import CategoryModel from '../models/category.model.js'
import SubCategoryModel from '../models/subCategory.model.js'
import NestedSubCategoryModel from '../models/nestedSubCategory.model.js'
import AdsBannerModel from '../models/adsBanner.model.js'
import ProductModel from '../models/product.model.js'

export const getCategoryController = async (req, res) => {
    try {
        const categories = await CategoryModel.find().populate({
            path: 'subCategory',
            populate: {
                path: 'nestedSubCategory'
            }
        })
        return res.status(200).json({
            data: categories,
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

export const addAndUpdateCategoryController = async (req, res, isEdit) => {
    try {
        const { category, imgArr } = req.body
        if (!category) {
            return res.status(400).json({
                message: `Category is Required`,
                error: true,
                success: false,
            })
        }

        if (!Array.isArray(imgArr) || imgArr.length === 0) {
            return res.status(400).json({
                message: `Kindly upload an image`,
                error: true,
                success: false,
            })
        }

        if (imgArr.length !== 1) {
            return res.status(400).json({
                message: `Can't upload more than one image`,
                error: true,
                success: false,
            })
        }

        if (!isEdit) {
            const isExist = await CategoryModel.findOne({ category })
            if (isExist) {
                return res.status(400).json({
                    message: 'Category already exist',
                    error: true,
                    success: false
                })
            }
        }

        if (isEdit) {
            const { catId } = req.params

            const isCategory = await CategoryModel.findById(catId)
            if (!isCategory) {
                return res.status(404).json({
                    message: 'Category not Found!',
                    error: true,
                    success: false
                })
            }

            const isExist = await CategoryModel.findOne({
                category,
                _id: { $ne: catId }
            })
            if (isExist) {
                return res.status(400).json({
                    message: 'Category already exist',
                    error: true,
                    success: false
                })
            }

            await CategoryModel.findByIdAndUpdate(
                catId,
                {
                    $set: {
                        category,
                        imgUrl: imgArr[0].imgUrl,
                        publicId: imgArr[0].publicId
                    }
                },
                { new: true }
            )

            const categories = await CategoryModel.find().populate({
                path: 'subCategory',
                populate: {
                    path: 'nestedSubCategory'
                }
            })

            return res.status(200).json({
                message: 'Category Updated successfully',
                data: categories,
                error: false,
                success: true
            })
        }

        const newCategory = new CategoryModel({
            category,
            imgUrl: imgArr[0].imgUrl,
            publicId: imgArr[0].publicId
        })

        await newCategory.save()

        const categories = await CategoryModel.find().populate({
            path: 'subCategory',
            populate: {
                path: 'nestedSubCategory'
            }
        })

        return res.status(201).json({
            message: 'Category Uploaded Successfully',
            data: categories,
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

export const deleteCategoryController = async (req, res) => {
    try {
        const catId = req.params.catId
        if (!catId) {
            return res.status(400).json({
                message: 'Kindly select a Category',
                error: true,
                success: false
            })
        }

        if (!mongoose.Types.ObjectId.isValid(catId)) {
            return res.status(404).json({
                message: 'Category not Found!',
                error: true,
                success: false
            })
        }

        const isCategory = await CategoryModel.findById(catId)
        if (!isCategory) {
            return res.status(404).json({
                message: 'Category not Found!',
                error: true,
                success: false
            })
        }

        const subCatIds = isCategory.subCategory
        const dltImgName = isCategory.publicId
        const catAdsBanner = await AdsBannerModel.find({ category: catId })
        const adsBannerImgs = catAdsBanner.map(banner => banner.publicId)

        await CategoryModel.deleteOne({ _id: catId })
        await SubCategoryModel.deleteMany({ _id: { $in: subCatIds } })
        await NestedSubCategoryModel.deleteMany({ subCategory: { $in: subCatIds } })
        await AdsBannerModel.deleteMany({ category: catId })
        await ProductModel.updateMany(
            { category: catId },
            {
                $set: {
                    category: null,
                    subCategory: null,
                    nestedSubCategory: null,
                    isOrphan: true
                }
            },
            { new: true }
        )
        await cloudinary.uploader.destroy(dltImgName)
        await Promise.all(
            adsBannerImgs.map(async adImgName => await cloudinary.uploader.destroy(adImgName))
        )

        const categories = await CategoryModel.find().populate({
            path: 'subCategory',
            populate: {
                path: 'nestedSubCategory'
            }
        })

        return res.status(200).json({
            message: 'Category Removed Successfully',
            data: categories,
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

export const deleteMultipleCategoriesController = async (req, res) => {
    try {
        const { catIds } = req.body
        if (!Array.isArray(catIds) || catIds.length === 0) {
            return res.status(400).json({
                message: 'Kindly select a Category',
                error: true,
                success: false
            })
        }

        const invalidId = catIds.find(id => !mongoose.Types.ObjectId.isValid(id))
        if (invalidId) {
            return res.status(404).json({
                message: 'Category not Found!',
                error: true,
                success: false
            })
        }

        const isCategories = await CategoryModel.find({ _id: { $in: catIds } })
        if (catIds.length !== isCategories.length) {
            return res.status(404).json({
                message: 'There was an Invalid or Deleted Category',
                error: true,
                success: false
            })
        }

        const dltCatImgs = isCategories.map(cat => cat.publicId)
        const orphanSubCatIds = isCategories.flatMap(cat => cat.subCategory)
        const catAdsBanner = await AdsBannerModel.find({ category: { $in: catIds } })
        const adsBannerImgs = catAdsBanner.map(banner => banner.publicId)

        await CategoryModel.deleteMany({ _id: { $in: catIds } })
        if (orphanSubCatIds.length > 0) {
            await SubCategoryModel.deleteMany({ _id: { $in: orphanSubCatIds } })
            await NestedSubCategoryModel.deleteMany({ subCategory: { $in: orphanSubCatIds } })
        }
        await AdsBannerModel.deleteMany({ category: { $in: catIds } })
        await ProductModel.updateMany(
            { category: { $in: catIds } },
            {
                $set: {
                    category: null,
                    subCategory: null,
                    nestedSubCategory: null,
                    isOrphan: true
                }
            },
            { new: true }
        )
        await Promise.allSettled([
            ...dltCatImgs.map(catImgName => cloudinary.uploader.destroy(catImgName)),
            ...adsBannerImgs.map(adImgName => cloudinary.uploader.destroy(adImgName))
        ])

        const categories = await CategoryModel.find().populate({
            path: 'subCategory',
            populate: {
                path: 'nestedSubCategory'
            }
        })

        return res.status(200).json({
            message: `${catIds.length} Categor${catIds.length > 1 ? 'ies' : 'y'} Removed Successfully`,
            data: categories,
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
