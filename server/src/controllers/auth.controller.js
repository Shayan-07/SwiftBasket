import bcrypt from 'bcrypt'
import UserModel from '../models/user.model.js'
import sendVerificationCode from '../utils/sendVerificationCode.js'
import { emailVerifyOTPHTML } from '../templates/emailHTML.js'
import { passOTPHTML } from "../templates/emailHTML.js"

export const registerController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        const requiredFields = { name, email, password }

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({
                    message: `${key} is Required`,
                    error: true,
                    success: false
                })
            }
        }

        if (name.length > 25) {
            return res.status(400).json({
                message: `User name can't be more than 25 characters`,
                error: true,
                success: false
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters',
                error: true,
                success: false
            })
        }

        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            if (existingUser.isVerified) {
                return res.status(400).json({
                    message: 'User Already Exists',
                    error: true,
                    success: false
                })
            }

            await UserModel.deleteOne({ email: existingUser.email })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            avatar: process.env.DEFAULT_USER_AVATAR,
            role: role || 'user'
        })
        await newUser.save()

        const regToken = await newUser.generateAuthToken()
        res.cookie("regToken", regToken, {
            expires: new Date(Date.now() + 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })

        const mailResponse = await sendVerificationCode('emailVerifyOTP', 'expEmailVerifyOTP', newUser.email, 'Email Verification', emailVerifyOTPHTML)
        if (!mailResponse.success) return res.status(500).json(mailResponse)

        return res.status(201).json({
            message: 'Verification email sent',
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

export const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body

        const checkOTP = await UserModel.findOne({ emailVerifyOTP: otp })

        if (!checkOTP || Date.now() > new Date(checkOTP?.expEmailVerifyOTP)) {
            return res.status(500).json({
                message: 'Invalid or Expired OTP',
                error: true,
                success: false
            })
        }
        if (checkOTP.isGoogleAuth || checkOTP.isVerified) {
            return res.status(500).json({
                message: 'User already verified',
                error: true,
                success: false
            })
        }

        checkOTP.emailVerifyOTP = null
        checkOTP.expEmailVerifyOTP = null
        checkOTP.unverifiedExpireAt = null
        checkOTP.isVerified = true
        await checkOTP.save()
        return res.status(201).json({
            message: 'Email Verified',
            error: false,
            success: true,
            email: checkOTP.email
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong!',
            error: true,
            success: false
        })
    }
}

export const resendVerifyEmail = async (req, res) => {
    try {
        const { email } = req.body

        const mailResponse = await sendVerificationCode('emailVerifyOTP', 'expEmailVerifyOTP', email, 'Resend Email Verification', emailVerifyOTPHTML)
        if (!mailResponse.success) return res.status(500).json(mailResponse)

        return res.status(201).json({
            message: 'Resended OTP',
            error: false,
            success: true,
            coolDown: 60
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong',
            error: true,
            success: false
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (!user || !user.isVerified) {
            return res.status(400).json({
                message: 'Incorrect Email',
                error: true,
                success: false
            })
        }

        if (user.isGoogleAuth) {
            return res.status(400).json({
                message: `Account is Registered with Google`,
                error: true,
                success: false,
            })
        }

        const matchPass = await bcrypt.compare(password, user.password)
        if (!matchPass) {
            return res.status(400).json({
                message: 'Incorrect Password',
                error: true,
                success: false
            })
        }

        const logToken = await user.generateAuthToken('30d')
        res.cookie("logToken", logToken, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })
        user.loginDate = Date.now()
        await user.save()

        return res.status(200).json({
            message: 'Logged In Successfully',
            error: false,
            success: true,
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something Went Wrong!',
            error: true,
            success: false
        })
    }
}

export const goodleAuthController = async (req, res) => {
    try {
        const { name, email, role } = req.body

        const user = await UserModel.findOne({ email })
        if (user) {
            if (!user.isGoogleAuth) {
                return res.status(400).json({
                    message: `Account isn't Registered with Google`,
                    error: true,
                    success: false,
                })
            }

            const logToken = await user.generateAuthToken('30d')
            res.cookie("logToken", logToken, {
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            })

            user.loginDate = Date.now()
            await user.save()

            return res.status(201).json({
                message: 'Logged In',
                error: false,
                success: true
            })
        }

        const newUser = new UserModel({
            name,
            email,
            password: null,
            avatar: process.env.DEFAULT_USER_AVATAR,
            role: role || 'user',
            isGoogleAuth: true,
            isVerified: true,
            loginDate: Date.now()
        })
        await newUser.save()

        const regToken = await newUser.generateAuthToken()
        res.cookie("regToken", regToken, {
            expires: new Date(Date.now() + 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })

        return res.status(201).json({
            message: 'Registration successful',
            error: false,
            success: true,
            auth: true
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong!',
            error: true,
            success: false
        })
    }
}

export const forgotPassController = async (req, res) => {
    try {
        const { email } = req.body
        const user = await UserModel.findOne({ email })
        if (!user || !user.isVerified) {
            return res.status(404).json({
                message: 'User not Found!',
                error: true,
                success: false
            })
        }

        const mailResponse = await sendVerificationCode('passOTP', 'expPassOTP', user.email, 'Password Reset OTP', passOTPHTML)
        if (!mailResponse.success) return res.status(500).json(mailResponse)

        return res.status(201).json({
            message: 'Success',
            error: false,
            success: true,
            email,
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something Went Wrong!',
            error: true,
            success: false
        })
    }
}

export const verifyPass = async (req, res) => {
    try {
        const { otp } = req.body

        const checkOTP = await UserModel.findOne({ passOTP: otp })
        if (!checkOTP || Date.now() > new Date(checkOTP.expPassOTP)) {
            return res.status(500).json({
                message: 'Invalid or Expired OTP',
                error: true,
                success: false
            })
        }

        checkOTP.passOTP = null
        checkOTP.expPassOTP = null

        const logToken = await checkOTP.generateAuthToken('30d')
        res.cookie("logToken", logToken, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })

        await checkOTP.save()
        return res.status(201).json({
            message: 'OTP Verified',
            error: false,
            success: true,
            email: checkOTP.email
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong!',
            error: true,
            success: false
        })
    }
}

export const resendVerifyPass = async (req, res) => {
    try {
        const { email } = req.body

        const mailResponse = await sendVerificationCode('passOTP', 'expPassOTP', email, 'Resend Password Reset OTP', passOTPHTML)
        if (!mailResponse.success) return res.status(500).json(mailResponse)

        return res.status(201).json({
            message: 'Resended OTP',
            error: false,
            success: true,
            coolDown: 60
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong!',
            error: true,
            success: false
        })
    }
}

export const resetPass = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email) {
            return res.status(400).json({
                message: 'Invalid Email or Entry',
                error: true,
                success: false
            })
        }
        if (!password) {
            return res.status(400).json({
                message: 'Password is Required',
                error: true,
                success: false
            })
        }
        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be atleast 8 characters',
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            })
        }

        const newHashedPassword = await bcrypt.hash(password, 10)
        user.password = newHashedPassword
        await user.save()

        return res.status(201).json({
            message: 'Password Reset Successfully',
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
