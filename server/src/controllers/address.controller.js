import mongoose from "mongoose"
import AddressModel from "../models/address.model.js"
import UserModel from "../models/user.model.js"

export const getAddressController = async (req, res) => {
    try {
        const addresses = await AddressModel.find({ user: req.userId }).populate('user', 'name')
        return res.status(200).json({
            data: addresses,
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

export const addAndUpdateAddressController = async (req, res, isEdit) => {
    try {
        let addressId
        if (isEdit) {
            addressId = req.params.addressId
            if (!mongoose.Types.ObjectId.isValid(addressId)) {
                return res.status(404).json({
                    message: 'Address not Found!',
                    error: true,
                    success: false,
                })
            }
        }

        const { addressLine, city, state, postalCode, landmark, phone, addressOf } = req.body
        const requiredFields = { addressLine, city, state, postalCode, landmark, phone, addressOf }
        console.log(addressOf)
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({
                    message: `${key} is required`,
                    error: true,
                    success: false,
                })
            }
        }

        if (addressOf !== 'home' && addressOf !== 'office' && addressOf !== 'other') {
            return res.status(400).json({
                message: 'Invalid address place',
                error: true,
                success: false
            })
        }

        if (!/^\d{10}$/.test(phone.toString().trim())) {
            return res.status(400).json({
                message: 'Invalid Phone Number',
                error: true,
                success: false
            })
        }

        if (isEdit) {
            await AddressModel.findByIdAndUpdate(
                addressId,
                {
                    $set: {
                        addressLine,
                        city,
                        state,
                        postalCode,
                        landmark,
                        phone: phone.toString().trim(),
                        addressOf
                    }
                }
            )

            const addresses = await AddressModel.find({ user: req.userId }).populate('user', 'name')

            return res.status(200).json({
                message: 'Address Updated Successfully',
                data: addresses,
                error: false,
                success: true
            })
        }

        const user = req.userId
        const newAddress = new AddressModel({
            addressLine,
            city,
            state,
            postalCode,
            landmark,
            phone: phone.toString().trim(),
            addressOf,
            user
        })

        const savedAddress = await newAddress.save()
        await UserModel.findByIdAndUpdate(
            user._id,
            { $push: { address: savedAddress._id } },
            { new: true }
        )
        
        const addresses = await AddressModel.find({ user: req.user._id }).populate('user', 'name')

        return res.status(201).json({
            message: 'Address Added Successfully',
            data: addresses,
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

export const deleteAddressController = async (req, res) => {
    try {
        const { addressId } = req.params
        if (!addressId) {
            return res.status(400).json({
                message: 'Kindly select an Address',
                error: true,
                success: false,
            })
        }
        if (!mongoose.Types.ObjectId.isValid(addressId)) {
            return res.status(404).json({
                message: 'Address not Found!',
                error: true,
                success: false,
            })
        }

        const isAddress = await AddressModel.exists({ _id: addressId })
        if (!isAddress) {
            return res.status(404).json({
                message: 'Address not Found!',
                error: true,
                success: false,
            })
        }

        await AddressModel.deleteOne({ _id: addressId })
        await UserModel.findByIdAndUpdate(
            req.userId,
            {
                $pull: {
                    address: addressId
                }
            },
            { new: true }
        )

        const addresses = await AddressModel.find({ user: req.userId }).populate('user', 'name')

        return res.status(200).json({
            message: 'Address Removed Successfully',
            data: addresses,
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