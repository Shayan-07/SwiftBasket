import UserModel from "../models/user.model.js"
import sendMail from "./mailSender.js"

const sendVerificationCode = async (otpField, expField, userEmail, subject, html) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000)
        const expTime = new Date(Date.now() + 15 * 60 * 1000)

        const userVerify = await UserModel.findOne({ email: userEmail })
        if (!userVerify) {
            return {
                message: "Session Expired",
                error: true,
                success: false,
                navigateBack: true
            }
        }

        userVerify[otpField] = otp
        userVerify[expField] = expTime
        if (!userVerify.isVerified) {
            userVerify.unverifiedExpireAt = expTime
        }

        if (userVerify.isGoogleAuth) {
            return res.status(400).json({
                message: `Can't send OTP. The account is registered with Google.`,
                error: true,
                success: false
            })
        }

        await userVerify.save()

        const mailSent = await sendMail({
            to: userVerify.email,
            subject,
            html: html(otp)
        })

        if (!mailSent) {
            return {
                message: "Error while sending Mail...",
                error: true,
                success: false,
            }
        }

        return {
            message: "Success",
            error: false,
            success: true,
        }

    } catch (error) {
        return {
            message: "Something went wrong",
            error: true,
            success: false,
        }
    }
}

export default sendVerificationCode