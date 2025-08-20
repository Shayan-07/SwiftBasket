import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js"

const loginAuthentication = async (req, res, next) => {
    try {
        const token = req.cookies.logToken

        let verifyToken
        try {
            verifyToken = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            const isExpired = error.name === "TokenExpiredError"

            if (isExpired) {
                const decoded = jwt.decode(token)
                if (decoded?._id) {
                    const user = await UserModel.findOne({ _id: decoded._id })
                    if (user) {
                        user.tokens = user.tokens.filter(entry => entry.token !== token)
                        await user.save()
                    }
                }

                return res.status(401).json({
                    message: "Session Expired. Kindly login to continue",
                    error: true,
                    success: false,
                })
            }

            return res.status(401).json({
                message: "",
                error: true,
                success: false,
            })
        }

        const user = await UserModel.findOne({ _id: verifyToken._id })
        if (!user) {
            return res.status(404).json({
                message: "User not found!",
                error: true,
                success: false,
            })
        }

        req.userId = user._id
        req.user = user
        req.token = token
        next()
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong!",
            error: true,
            success: false,
        })
    }
}

export default loginAuthentication
