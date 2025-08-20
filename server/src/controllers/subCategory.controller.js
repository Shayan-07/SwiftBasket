import mongoose from "mongoose"
import CategoryModel from "../models/category.model.js"
import SubCategoryModel from "../models/subCategory.model.js"
import NestedSubCategoryModel from "../models/nestedSubCategory.model.js"
import AdsBannerModel from "../models/adsBanner.model.js"

export const getSubCategoryController = async (req, res) => {
    try {
        const subCategories = await SubCategoryModel.find().populate('category').populate('nestedSubCategory')
        return res.status(200).json({
            data: subCategories,
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

export const addAndUpdateSubCategoryController = async (req, res, isEdit) => {
    try {
        const { subCategory, categoryId } = req.body
        const requiredFields = { 'Sub Category': subCategory, 'Category': categoryId }
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({
                    message: `${key} is Required`,
                    error: true,
                    success: false
                })
            }
        }

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(404).json({
                message: 'Category not Found!',
                error: true,
                success: false
            })
        }

        const isCategory = await CategoryModel.findById(categoryId)
        if (!isCategory) {
            return res.status(404).json({
                message: 'Category not Found!',
                error: true,
                success: false
            })
        }

        const checkExistQuery = {
            subCategory,
            category: categoryId
        }

        let subCatId
        if (isEdit) {
            subCatId = req.params.subCatId

            if (!mongoose.Types.ObjectId.isValid(subCatId))
                return res.status(404).json({
                    message: `Sub Category not Found!`,
                    error: true,
                    success: false
                })

            const isSubCategory = SubCategoryModel.findById(subCatId)
            if (!isSubCategory)
                return res.status(404).json({
                    message: `Sub Category not Found!`,
                    error: true,
                    success: false
                })

            checkExistQuery._id = { $ne: subCatId }
        }

        const isExist = await SubCategoryModel.findOne(checkExistQuery)
        if (isExist) {
            return res.status(400).json({
                message: 'Sub Category already exists',
                error: true,
                success: false
            })
        }

        if (isEdit) {
            await SubCategoryModel.findByIdAndUpdate(
                subCatId,
                {
                    $set: {
                        subCategory,
                        category: categoryId
                    }
                }
            )

            const subCats = await SubCategoryModel.find().populate('category').populate('nestedSubCategory')

            return res.status(200).json({
                message: 'Sub Category Updated Successfully',
                data: subCats,
                error: false,
                success: true,
            })
        }

        const newSubCategory = new SubCategoryModel({
            subCategory,
            category: categoryId
        })

        newSubCategory.save()
        await CategoryModel.findByIdAndUpdate(
            newSubCategory.category,
            { $push: { subCategory: newSubCategory._id } },
            { new: true }
        )

        const subCats = await SubCategoryModel.find().populate('category').populate('category').populate('nestedSubCategory')

        return res.status(201).json({
            message: 'Sub Category Uploaded Successfully',
            data: subCats,
            error: false,
            success: true,
            newSubCategory
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong!',
            error: true,
            success: false
        })
    }
}

export const deleteSubCategoryController = async (req, res) => {
    try {
        const subCatId = req.params.subCatId
        if (!subCatId) {
            return res.status(400).json({
                message: 'Kindly select a Sub Category',
                error: true,
                success: false
            })
        }

        if (!mongoose.Types.ObjectId.isValid(subCatId)) {
            return res.status(404).json({
                message: 'Sub Category not Found!',
                error: true,
                success: false
            })
        }
        const isSubCategory = await SubCategoryModel.findById(subCatId)
        if (!isSubCategory) {
            return res.status(404).json({
                message: 'Sub Category not Found!',
                error: true,
                success: false
            })
        }

        await SubCategoryModel.deleteOne({ _id: subCatId })
        await NestedSubCategoryModel.deleteMany({ subCategory: subCatId })
        await AdsBannerModel.updateMany(
            { subCategory: subCatId },
            {
                $set: {
                    subCategory: null,
                    nestedSubCategory: null
                }
            },
            { new: true }
        )

        await CategoryModel.findByIdAndUpdate(
            isSubCategory.category,
            { $pull: { subCategory: subCatId } }
        )

        const subCats = await SubCategoryModel.find().populate('category').populate('category').populate('nestedSubCategory')

        return res.status(200).json({
            message: 'Sub Category Deleted Successfully',
            data: subCats,
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
