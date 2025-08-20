import mongoose from "mongoose"
import CartModel from "../models/cart.model.js"
import UserModel from "../models/user.model.js"
import ProductModel from "../models/product.model.js"
import WishlistModel from "../models/wishlist.model.js"

export const getCartItemsController = async (req, res) => {
    try {
        const cartItems = await CartModel.find({ user: req.userId }).populate('product')
        return res.status(200).json({
            data: cartItems,
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

export const addToCartController = async (req, res) => {
    try {
        const { productId, quantity } = req.body
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
        const isExist = await CartModel.exists({ user: userId, product: productId })
        if (isExist) {
            return res.status(400).json({
                message: 'Item already in cart',
                error: true,
                success: false
            })

        }

        const isExistList = await WishlistModel.exists({ user: userId, product: productId })
        if (isExistList) await WishlistModel.deleteOne({ user: userId, product: productId })

        const newCartItem = new CartModel({
            product: productId,
            quantity: parseInt(quantity) || 1,
            user: userId
        })

        const cartItem = await newCartItem.save()

        await UserModel.findByIdAndUpdate(
            userId,
            { $push: { cart: cartItem._id } },
            { new: true }
        )

        const cartItems = await CartModel.find({ user: req.userId }).populate('product')

        return res.status(201).json({
            data: cartItems,
            message: 'Added to Cart',
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

export const updateQuantityController = async (req, res) => {
    try {
        const { quantity } = req.body
        const { cartProductId } = req.params
        if (!mongoose.Types.ObjectId.isValid(cartProductId)) {
            return res.status(404).json({
                message: `Item not Found!`,
                error: true,
                success: false
            })
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: 'Quantity must be a positive integer.',
                error: true,
                success: false
            })
        }

        const isCartItem = await CartModel.findOne({ _id: cartProductId, user: req.userId })
        if (!isCartItem) {
            return res.status(404).json({
                message: `Item not Found!`,
                error: true,
                success: false
            })
        }

        isCartItem.quantity = quantity
        await isCartItem.save()

        const cartItems = await CartModel.find({ user: req.userId }).populate('product')

        return res.status(200).json({
            data: cartItems,
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

export const removeFromCartController = async (req, res) => {
    try {
        const { cartProductId } = req.params
        if (!mongoose.Types.ObjectId.isValid(cartProductId)) {
            return res.status(404).json({
                message: 'Item not Found!',
                error: true,
                success: false
            })
        }

        const isCartProduct = await CartModel.exists({ _id: cartProductId })
        if (!isCartProduct) {
            return res.status(404).json({
                message: 'Item not Found!',
                error: true,
                success: false
            })
        }

        await CartModel.deleteOne({ _id: cartProductId })
        await UserModel.findByIdAndUpdate(
            req.userId,
            {
                $pull: { cart: cartProductId }
            }
        )

        const cartItems = await CartModel.find({ user: req.userId }).populate('product')

        return res.status(200).json({
            data: cartItems,
            message: 'Item Removed from Cart',
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

export const removeMultipleItemsFromCartController = async (req, res) => {
    try {
        const { cartProductIds } = req.body
        if (!Array.isArray(cartProductIds) || cartProductIds.length === 0) {
            return res.status(400).json({
                message: 'Kindly select an Item',
                error: true,
                success: false
            })
        }
        for (const id of cartProductIds) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({
                    message: 'Item not Found!',
                    error: true,
                    success: false
                })
            }
        }

        const isCartProduct = await CartModel.find({ _id: { $in: cartProductIds } })
        if (isCartProduct.length !== cartProductIds.length) {
            return res.status(400).json({
                message: 'There was an Invalid or Deleted Item',
                error: true,
                success: false
            })
        }

        await CartModel.deleteMany({ _id: { $in: cartProductIds } })
        await UserModel.findByIdAndUpdate(
            req.userId,
            {
                $pull: { cart: { $in: cartProductIds } }
            }
        )

        const cartItems = await CartModel.find({ user: req.userId }).populate('product')

        return res.status(200).json({
            data: cartItems,
            message: `${cartProductIds.length} Cart item${cartProductIds.length > 1 ? 's' : ''} Removed Successfully`,
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
