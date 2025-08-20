import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs/promises'
import UserModel from '../models/user.model.js'
import Fuse from 'fuse.js'
import bcrypt from 'bcrypt'

export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find()
        return res.status(200).json({
            data: users,
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

export const searchedUsers = async (req, res) => {
    try {
        const { searchedKeyword } = req.body
        let users = await UserModel.find()
        const options = {
            keys: ['name', 'email'],
            threshold: 0.6,
        }
        const keyword = searchedKeyword?.trim().toLowerCase()

        const fuse = new Fuse(users, options)
        const result = fuse.search(keyword)

        users = result.map(item => item.item)
        return res.status(200).json({
            data: users,
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

export const updateUserAvatar = async (req, res) => {
    try {
        const avatarImg = req.file
        if (!avatarImg) {
            return res.status(400).json({
                message: 'Kindly upload an Image',
                error: true,
                success: false
            })
        }

        const result = await cloudinary.uploader.upload(
            avatarImg.path,
            {
                folder: 'swiftbasket/user_avatars',
                use_filename: true,
                unique_filename: false,
                overwrite: false,
                quality: 'auto',
                fetch_format: 'auto'
            }
        )

        if (!result?.secure_url) {
            console.log('Error while uploading Avatar')
            throw new Error('Error while uploading Avatar')
        }
        await fs.unlink(avatarImg.path)

        const user = req.user
        if (user.avatar !== process.env.DAFAULT_USER_AVATAR && user.publicId) await cloudinary.uploader.destroy(user.publicId)

        const updatedUser = await UserModel.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    avatar: result.secure_url,
                    publicId: result.public_id
                }
            },
            { new: true }
        )

        return res.status(201).json({
            message: 'Avatar Updated Successfully',
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                isGoogleAuth: updatedUser.isGoogleAuth
            },
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

export const updateUserName = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(400).json({
                message: 'User name is Required',
                error: true,
                success: false
            })
        }

        if (name.length > 25) {
            return res.status(400).json({
                message: `User name can't be more than 25 characters`,
                error: true,
                success: false
            })
        }

        const user = await UserModel.findByIdAndUpdate(
            req.userId,
            {
                $set: { name }
            },
            { new: true }
        )

        return res.status(201).json({
            message: 'Username Updated Successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isGoogleAuth: user.isGoogleAuth
            },
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

export const updateUserPass = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (req.user.isGoogleAuth) {
            return res.status(400).json({
                message: 'User is Authenticated with Google',
                error: true,
                success: false
            })
        }
        if (!currentPassword) {
            return res.status(400).json({
                message: 'Kindly fill the Current Password field',
                error: true,
                success: false
            })
        }
        if (!newPassword) {
            return res.status(400).json({
                message: 'Kindly add a New Password',
                error: true,
                success: false
            })
        }
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: 'Password must be atleast 8 characters',
                error: true,
                success: false
            })
        }

        const checkPass = await bcrypt.compare(currentPassword, req.user.password)
        if (!checkPass) {
            return res.status(400).json({
                message: 'Incorrect Password',
                error: true,
                success: false
            })
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10)
        await UserModel.findByIdAndUpdate(
            req.userId,
            {
                $set: { password: newHashedPassword }
            },
            { new: true }
        )

        return res.status(201).json({
            message: 'Password Updated Successfully',
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
