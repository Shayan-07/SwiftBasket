import SubCategoryModel from "../models/subCategory.model.js"
import NestedSubCategoryModel from "../models/nestedSubCategory.model.js"
import mongoose from "mongoose"
import AdsBannerModel from "../models/adsBanner.model.js"

export const getNestedSubCategoryController = async (req, res) => {
    try {
        const nestedSubCategories = await NestedSubCategoryModel.find().populate('subCategory')
        return res.status(200).json({
            data: nestedSubCategories,
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

export const addAndUpdateNestedSubCategoryController = async (req, res, isEdit) => {
    try {
        const { nestedSubCategory, subCategoryId } = req.body
        const requiredFields = { 'Nested Sub Category': nestedSubCategory, 'Sub Category': subCategoryId }
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({
                    message: `${key} is Required`,
                    error: true,
                    success: false
                })
            }
        }

        if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
            return res.status(404).json({
                message: 'Sub Category not Found!',
                error: true,
                success: false
            })
        }

        const isSubCategory = await SubCategoryModel.findById(subCategoryId)
        if (!isSubCategory) {
            return res.status(404).json({
                message: 'Sub Category not Found!',
                error: true,
                success: false
            })
        }

        const checkExistQuery = {
            nestedSubCategory,
            subCategory: subCategoryId
        }

        let nestedSubCatId
        if (isEdit) {
            nestedSubCatId = req.params.nestedSubCatId

            if (!mongoose.Types.ObjectId.isValid(nestedSubCatId))
                return res.status(404).json({
                    message: `Nested Sub Category not Found!`,
                    error: true,
                    success: false
                })

            const isSubCategory = SubCategoryModel.findById(nestedSubCatId)
            if (!isSubCategory)
                return res.status(404).json({
                    message: `Nested Sub Category not Found!`,
                    error: true,
                    success: false
                })

            checkExistQuery._id = { $ne: nestedSubCatId }
        }

        const isNestedSubCategory = await NestedSubCategoryModel.findOne(checkExistQuery)
        if (isNestedSubCategory) {
            return res.status(400).json({
                message: 'Nested Sub Category already exists',
                error: true,
                success: false
            })
        }

        if (isEdit) {
            await NestedSubCategoryModel.findByIdAndUpdate(
                nestedSubCatId,
                {
                    $set: {
                        nestedSubCategory,
                        subCategory: subCategoryId
                    }
                },
                { new: true }
            )

            const nestedSubCategories = await NestedSubCategoryModel.find().populate('subCategory')

            return res.status(200).json({
                message: 'Nested Sub Category Updated Successfully',
                data: nestedSubCategories,
                error: false,
                success: true,
            })
        }

        const insertNestedSubCategory = new NestedSubCategoryModel({
            nestedSubCategory,
            subCategory: subCategoryId
        })

        const newNestedSubCategory = await insertNestedSubCategory.save()
        await SubCategoryModel.findByIdAndUpdate(
            subCategoryId,
            { $push: { nestedSubCategory: newNestedSubCategory._id } }
        )

        const nestedSubCategories = await NestedSubCategoryModel.find().populate('subCategory')

        return res.status(201).json({
            message: 'Nested Sub Category Uploaded Successfully',
            data: nestedSubCategories,
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

export const deleteNestedSubCategoryController = async (req, res) => {
    try {
        const nestedSubCatId = req.params.nestedSubCatId
        if (!nestedSubCatId) {
            return res.status(400).json({
                message: 'Kindly select a Nested Sub Category',
                error: true,
                success: false
            })
        }

        if (!mongoose.Types.ObjectId.isValid(nestedSubCatId)) {
            return res.status(404).json({
                message: 'Nested Sub Category not Found!',
                error: true,
                success: false
            })
        }

        const isNestedSubCategory = await NestedSubCategoryModel.findById(nestedSubCatId)
        if (!isNestedSubCategory) {
            return res.status(404).json({
                message: 'Nested Sub Category not Found!',
                error: true,
                success: false
            })
        }

        await NestedSubCategoryModel.deleteOne({ _id: nestedSubCatId })
        await AdsBannerModel.updateMany(
            { nestedSubCategory: nestedSubCatId },
            {
                $set: { nestedSubCategory: null }
            }
        )
        await SubCategoryModel.findByIdAndUpdate(
            isNestedSubCategory.subCategory,
            { $pull: { nestedSubCategory: nestedSubCatId } }
        )

        const nestedSubCategories = await NestedSubCategoryModel.find().populate('subCategory')

        return res.status(200).json({
            message: 'Nested Sub Category Deleted Successfully',
            data: nestedSubCategories,
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
