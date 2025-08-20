import mongoose from "mongoose"
import WishlistModel from "../models/wishlist.model.js"
import UserModel from "../models/user.model.js"
import ProductModel from "../models/product.model.js"
import CartModel from "../models/cart.model.js"

export const getListItemsController = async (req, res) => {
    try {
        const listItems = await WishlistModel.find({ user: req.userId }).populate('product')
        return res.status(200).json({
            data: listItems,
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

export const addToWishlistController = async (req, res) => {
    try {
        const { productId } = req.body
        if (!productId) {
            return res.status(400).json({
                message: `Product is Required`,
                error: true,
                success: false
            })
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(404).json({
                message: `Product not Found!`,
                error: true,
                success: false
            })
        }

        const isProduct = await ProductModel.exists({ _id: productId })
        if (!isProduct) {
            return res.status(404).json({
                message: `Product not Found!`,
                error: true,
                success: false
            })
        }

        const userId = req.userId
        const isExist = await WishlistModel.exists({ user: userId, product: productId })
        if (isExist) {
            return res.status(400).json({
                message: 'Item already in wishlist',
                error: true,
                success: false
            })

        }

        const isExistCart = await CartModel.exists({ user: userId, product: productId })
        if (isExistCart) {
            return res.status(400).json({
                message: 'Item already in cart',
                error: true,
                success: false
            })

        }

        const newListItem = new WishlistModel({
            product: productId,
            user: userId
        })

        const listItem = await newListItem.save()

        await UserModel.findByIdAndUpdate(
            userId,
            { $push: { wishlist: listItem._id } },
            { new: true }
        )

        const listItems = await WishlistModel.find({ user: req.userId }).populate('product')

        return res.status(201).json({
            message: 'Added to Wishlist',
            data: listItems,
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

export const removeFromListController = async (req, res) => {
    try {
        const { listProductId } = req.params
        if (!mongoose.Types.ObjectId.isValid(listProductId)) {
            return res.status(404).json({
                message: 'Item not Found!',
                error: true,
                success: false
            })
        }

        const isListProduct = await WishlistModel.exists({ _id: listProductId })
        if (!isListProduct) {
            return res.status(404).json({
                message: 'Item not Found!',
                error: true,
                success: false
            })
        }

        await WishlistModel.deleteOne({ _id: listProductId })
        await UserModel.findByIdAndUpdate(
            req.userId,
            {
                $pull: { wishlist: listProductId }
            }
        )

        const listItems = await WishlistModel.find({ user: req.userId }).populate('product')

        return res.status(200).json({
            message: 'Item Removed from Wishlist',
            data: listItems,
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
