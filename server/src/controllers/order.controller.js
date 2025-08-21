import mongoose from "mongoose"
import ProductModel from "../models/product.model.js"
import AddressModel from "../models/address.model.js"
import OrderModel from "../models/order.model.js"
import UserModel from "../models/user.model.js"
import CartModel from "../models/cart.model.js"
import Fuse from "fuse.js"

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await OrderModel.find().populate('products.product').populate('user', 'name email').populate('address')
        return res.status(200).json({
            data: orders,
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

export const getUserOrdersController = async (req, res) => {
    try {
        const orders = await OrderModel.find({ user: req.userId }).populate('products.product').populate('user', 'name email').populate('address')
        return res.status(200).json({
            data: orders,
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

export const placeOrderController = async (req, res) => {
    try {
        const { items, address } = req.body
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: `Items are Required`,
                error: true,
                success: false
            })
        }

        for (const item of items) {
            if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
                return res.status(404).json({
                    message: `Invalid or Missing Product ID`,
                    error: true,
                    success: false
                })
            }
            if (typeof item.quantity !== 'number' || item.quantity <= 0) {
                return res.status(400).json({
                    message: 'Invalid Quantity',
                    error: true,
                    success: false
                })
            }
        }

        if (!address) {
            return res.status(400).json({
                message: `Address is Required`,
                error: true,
                success: false
            })
        }

        if (!mongoose.Types.ObjectId.isValid(address)) {
            return res.status(404).json({
                message: `Address not Found!`,
                error: true,
                success: false
            })
        }

        const productIds = items.map(i => i.product)

        const [checkProduct, checkAddress] = await Promise.all([
            ProductModel.find({ _id: { $in: productIds } }),
            AddressModel.findById(address)
        ])

        if (!checkAddress) {
            return res.status(404).json({
                message: `Address not Found!`,
                error: true,
                success: false
            })
        }

        if (checkProduct.length !== productIds.length) {
            return res.status(404).json({
                message: `There was an Invalid or Deleted Product!`,
                error: true,
                success: false
            })
        }

        const productPrices = items.map(item => {
            const productDoc = checkProduct.find(p => p._id.toString() === item.product.toString())
            if (!productDoc) {
                throw new Error(`Product: ${item.product} not Found!`)
            }
            return {
                price: productDoc.price,
                discount: productDoc.discount || 0,
                discountedPrice: productDoc.discountedPrice
            }
        })

        const orderProducts = items.map((item, i) => {
            const { price, discount, discountedPrice } = productPrices[i]
            const subTotal = discountedPrice * item.quantity
            return {
                product: item.product,
                quantity: item.quantity,
                price,
                discount,
                subTotal
            }
        })

        const userId = req.userId
        const total = orderProducts.reduce((sum, p) => sum + p.subTotal, 3)

        await Promise.all(items.map(item =>
            ProductModel.findByIdAndUpdate(item._id, {
                $inc: {
                    soldItemsCount: item.quantity,
                    stocks: -item.quantity
                }
            })
        ))

        const newOrder = new OrderModel({
            products: orderProducts,
            user: userId,
            address,
            paymentMethod: 'cod',
            total: parseFloat(total.toFixed(2))
        })

        const placedOrder = await newOrder.save()

        await UserModel.findByIdAndUpdate(
            userId,
            {
                $push: { order: placedOrder._id },
                $set: { cart: [] }
            },
            { new: true }
        )

        await CartModel.deleteMany({ user: req.userId })
        const orders = await OrderModel.find({ user: req.userId }).populate('products.product').populate('user', 'name email').populate('address')

        return res.status(201).json({
            message: 'Order has been placed!',
            error: false,
            success: true,
            data: orders
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Something went wrong!',
            error: true,
            success: false
        })
    }
}

export const searchedOrdersController = async (req, res) => {
    try {
        const { searchedKeyword } = req.body
        let filteredOrders = await OrderModel.find().populate('products.product').populate('user', 'name email').populate('address')
        if (searchedKeyword) {
            const options = {
                keys: ['user.name', 'user.email', 'address.phone', 'address.postalCode'],
                threshold: 0.4,
            }

            const fuse = new Fuse(filteredOrders, options)
            const result = fuse.search(searchedKeyword)
            filteredOrders = result.map(item => item.item)
        }

        return res.status(200).json({
            data: filteredOrders,
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

export const orderUpdatesController = async (req, res) => {
    try {
        const { orderStatus } = req.body
        const { orderId } = req.params

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(404).json({
                message: 'No Order Found!',
                error: true,
                success: false
            })
        }
        const order = await OrderModel.findOne({ _id: orderId })
        if (!order) {
            return res.status(404).json({
                message: 'No Order Found!',
                error: true,
                success: false
            })
        }

        const validStatus = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

        if (orderStatus && validStatus.includes(orderStatus)) order.orderStatus = orderStatus

        if (order.orderStatus === 'delivered') {
            order.isDelivered = true
            order.isPaid = true
            order.orderStatus = 'delivered'
            order.deliveredAt = Date.now()
            order.paidAt = Date.now()
        }

        await order.save()
        const orders = await OrderModel.find().populate('products.product').populate('user', 'name email').populate('address')

        return res.status(200).json({
            data: orders,
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

export const cancelOrderController = async (req, res) => {
    try {
        const { orderId } = req.params
        if (mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(404).json({
                message: 'No Order Found!',
                error: true,
                success: false
            })
        }

        const isOrdered = await OrderModel.findOne({
            _id: orderId,
            user: req.userId
        })
        if (!isOrdered) {
            return res.status(404).json({
                message: 'No Order Found!',
                error: true,
                success: false
            })
        }

        if (isOrdered.orderStatus === 'delivered') {
            return res.status(400).json({
                message: 'Order has already been Delivered',
                error: true,
                success: false
            })
        }

        isOrdered.orderStatus = 'cancelled'
        isOrdered.save()

        return res.status(200).json({
            message: 'Order canceled',
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
