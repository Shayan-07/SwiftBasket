import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary'
import Fuse from 'fuse.js'
import ProductModel from "../models/product.model.js"
import CategoryModel from "../models/category.model.js"
import SubCategoryModel from "../models/subCategory.model.js"
import NestedSubCategoryModel from "../models/nestedSubCategory.model.js"

export const getProductController = async (req, res) => {
    try {
        const { productId } = req.params
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(404).json({
                message: 'Product not Found!',
                error: true,
                success: false
            })
        }

        const product = await ProductModel.findById(productId)
            .populate('category')
            .populate('subCategory')
            .populate('nestedSubCategory')
            .populate({
                path: 'review.user',
                select: 'avatar name'
            })
        if (!product) {
            return res.status(404).json({
                message: 'Product not Found!',
                error: true,
                success: false
            })
        }

        return res.status(200).json({
            data: product,
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

export const getAllProductsController = async (req, res) => {
    try {
        const products = await ProductModel.find().populate('category').populate('subCategory').populate('nestedSubCategory')
        return res.status(200).json({
            data: products,
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

export const productsFiltersController = async (req, res) => {
    try {
        const { catType, ids, ratings, minPrice, maxPrice, searchedKeyword } = req.body
        const { lth, htl, az, za } = req.query
        const query = {}
        const validTypes = ['category', 'subCategory', 'nestedSubCategory']

        if (ids && Array.isArray(ids) && ids.length > 0 && validTypes.includes(catType)) {
            const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id))
            if (validIds.length > 0) query[catType] = { $in: validIds }
        }

        if (ratings && Array.isArray(ratings) && ratings.length > 0) {
            for (const num of ratings) {
                if (typeof num !== 'number' || num < 0 || num > 5) {
                    return res.status(400).json({
                        message: 'Invalid Rating!',
                        error: true,
                        success: false
                    })
                }
            }

            const ratingFilters = ratings.map(r => {
                const start = r === 1 ? 0.5 : (r - 0.4)
                const end = r + 0.5
                return {
                    totalRating: { $gte: start, $lte: end }
                }
            })
            query.$or = ratingFilters
        }

        if (typeof minPrice === 'number' && typeof maxPrice === 'number') {
            if (minPrice >= 0 && maxPrice >= 0 && minPrice < maxPrice) query.discountedPrice = { $gte: minPrice, $lte: maxPrice }
        }

        let filteredProducts = await ProductModel.find(query).populate('category').populate('subCategory').populate('nestedSubCategory')

        if (lth === 'true') filteredProducts.sort((a, b) => a.discountedPrice - b.discountedPrice)
        else if (htl === 'true') filteredProducts.sort((a, b) => b.discountedPrice - a.discountedPrice)
        else if (az === 'true') filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
        else if (za === 'true') filteredProducts.sort((a, b) => b.title.localeCompare(a.title))

        if (searchedKeyword) {
            const options = {
                keys: ['title', 'description', 'category.category', 'subCategory.subCategory', 'nestedSubCategory.nestedSubCategory'],
                threshold: 0.5,
            }

            const fuse = new Fuse(filteredProducts, options)
            const result = fuse.search(searchedKeyword)
            filteredProducts = result.map(item => item.item)
        }

        return res.status(200).json({
            data: filteredProducts,
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

export const addAndUpdateProductsController = async (req, res, isEdit) => {
    try {
        const { title, description, category, subCategory, nestedSubCategory, price, discount, brandName, stock, imgArr } = req.body

        let productId
        if (isEdit) productId = req.params.productId

        const validSubCategory = subCategory && subCategory !== '' ? subCategory : null
        const validNestedSubCategory = nestedSubCategory && nestedSubCategory !== '' ? nestedSubCategory : null

        const idsToValidate = {
            ...(isEdit && { 'Product': productId }),
            'Category': category,
            ...(validSubCategory && { 'Sub Category': subCategory }),
            ...(validNestedSubCategory && { 'Nested Sub Category': nestedSubCategory })
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

        if (!subCategory && nestedSubCategory) {
            return res.status(400).json({
                message: `Can't add Nested sub category without Sub category`,
                error: true,
                success: false,
            })
        }

        const requiredFields = { title, description, category, price, discount, brandName, stock }
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
                message: `Kindly upload an image`,
                error: true,
                success: false,
            })
        }

        const [checkProduct, checkCat, checkSubCat, checkNestedSubCat] = await Promise.all([
            isEdit ? ProductModel.findById(productId) : null,
            CategoryModel.findById(category),
            validSubCategory ? SubCategoryModel.findOne({ _id: subCategory, category }) : null,
            validNestedSubCategory ? NestedSubCategoryModel.findOne({ _id: nestedSubCategory, subCategory }) : null
        ])

        if (subCategory && !checkSubCat) {
            return res.status(400).json({
                message: `Sub Category doesn't belong to the selected Category`,
                error: true,
                success: false,
            })
        }

        if (nestedSubCategory && !checkNestedSubCat) {
            return res.status(400).json({
                message: `Nested Sub Category doesn't belong to the selected Sub Category`,
                error: true,
                success: false,
            })
        }

        const dbRefs = {
            ...(isEdit && { 'Product': checkProduct }),
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

        const mediaImgUrls = imgArr.map(img => img.imgUrl)
        const mediaImgPublicIds = imgArr.map(img => img.publicId)

        const discountedPrice = Number((price - (discount * price) / 100).toFixed(2))

        if (isEdit) {
            const updateFields = {
                title,
                description,
                category,
                subCategory: validSubCategory,
                nestedSubCategory: validNestedSubCategory,
                discount: Number(discount),
                price: Number(price),
                discountedPrice,
                brandName,
                stock: Number(stock),
                mediaImgUrls,
                mediaImgPublicIds
            }

            await ProductModel.findByIdAndUpdate(productId, { $set: updateFields }, { new: true })
            const products = await ProductModel.find()
                .populate('category')
                .populate('subCategory')
                .populate('nestedSubCategory')

            return res.status(200).json({
                message: 'Product Updated Successfully',
                data: products,
                error: false,
                success: true
            })
        }

        const newProduct = new ProductModel({
            title,
            description,
            category,
            subCategory: validSubCategory,
            nestedSubCategory: validNestedSubCategory,
            discount: Number(discount),
            price: Number(price),
            discountedPrice,
            brandName,
            stock: Number(stock),
            mediaImgUrls,
            mediaImgPublicIds
        })

        await newProduct.save()
        const products = await ProductModel.find().populate('category').populate('subCategory').populate('nestedSubCategory')

        return res.status(201).json({
            message: 'Product Uploaded Successfully',
            data: products,
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

export const addProductReviewController = async (req, res) => {
    try {
        const { comment, rating } = req.body
        if (!comment) {
            return res.status(400).json({
                message: 'Kindly write a Review',
                error: true,
                success: false
            })
        }
        if (typeof rating !== 'number' || rating < 0.5 || rating > 5) {
            return res.status(400).json({
                message: 'Invalid Rating',
                error: true,
                success: false
            })
        }

        const { productId } = req.params
        const product = await ProductModel.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: 'Product not Found!',
                error: true,
                success: false
            })
        }

        const isReviewed = product.review.some(r => r.user.toString() === req.userId)
        if (isReviewed) {
            return res.status(400).json({
                message: `Can't review a product more than once`,
                error: true,
                success: false
            })
        }

        const newReview = {
            comment,
            rating,
            user: req.userId,
            reviewDate: Date.now()
        }
        product.review.push(newReview)

        const totalRating = product.review.reduce((sum, r) => sum + r.rating, 0)
        const average = totalRating / product.review.length
        product.totalRating = Math.round(average * 2) / 2
        product.totalReviews = product.review.length
        await product.save()

        const updatedProduct = await ProductModel.findById(productId)
            .populate('review.user', 'name avatar')

        return res.status(200).json({
            message: 'Thanks for your Feedback',
            data: updatedProduct.review,
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

export const deleteProductController = async (req, res) => {
    try {
        const { productId } = req.params
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(404).json({
                message: 'Product not Found!',
                error: true,
                success: false
            })
        }

        const isProduct = await ProductModel.findById(productId)
        if (!isProduct) {
            return res.status(404).json({
                message: 'Product not Found!',
                error: true,
                success: false
            })
        }

        await Promise.allSettled([
            cloudinary.uploader.destroy(isProduct.frontImgPublicId),
            ...isProduct.mediaImgPublicIds.map(imgPublicId => cloudinary.uploader.destroy(imgPublicId))
        ])

        await ProductModel.findByIdAndDelete(productId)
        const products = await ProductModel.find().populate('category').populate('subCategory').populate('nestedSubCategory')

        return res.status(200).json({
            message: 'Product Removed Successfully',
            data: products,
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

export const deleteMultipleProductsController = async (req, res) => {
    try {
        const { productIds } = req.body
        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                message: 'Kindly select a Product',
                error: true,
                success: false
            })
        }
        for (const id of productIds) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({
                    message: 'Product not Found!',
                    error: true,
                    success: false
                })
            }
        }

        const isProducts = await ProductModel.find({ _id: { $in: productIds } })
        if (isProducts.length !== productIds.length) {
            return res.status(400).json({
                message: 'There was an Invalid or Deleted Product',
                error: true,
                success: false
            })
        }

        const frontImgPublicId = isProducts.map(product => product.frontImgPublicId)
        const mediaImgPublicIdsArr = isProducts.map(product => product.mediaImgPublicIds).flat()
        await Promise.allSettled([
            ...frontImgPublicId.map(imgPublicId => cloudinary.uploader.destroy(imgPublicId)),
            ...mediaImgPublicIdsArr.map(imgPublicId => cloudinary.uploader.destroy(imgPublicId))
        ])

        await ProductModel.deleteMany({ _id: { $in: productIds } })
        const products = await ProductModel.find().populate('category').populate('subCategory').populate('nestedSubCategory')

        return res.status(200).json({
            message: `${productIds.length} Product${productIds.length > 1 ? 's' : ''} Removed Successfully`,
            data: products,
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
