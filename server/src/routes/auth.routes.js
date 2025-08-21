import { Router } from 'express'

//Controllers
import {
    registerController,
    verifyEmail,
    resendVerifyEmail,
    loginController,
    googleAuthController,
    forgotPassController,
    verifyPass,
    resendVerifyPass,
    resetPass
} from '../controllers/auth.controller.js'

//Router
const authRouter = Router()

//Routes
authRouter.post('/register', registerController)
authRouter.post('/verifyemail', verifyEmail)
authRouter.post('/verifyemail/resendotp', resendVerifyEmail)
authRouter.post('/login', loginController)
authRouter.post('/google', googleAuthController)
authRouter.post('/forgotpassword', forgotPassController)
authRouter.post('/verifypassword', verifyPass)
authRouter.post('/verifypassword/resendotp', resendVerifyPass)
authRouter.put('/resetpassword', resetPass)

export default authRouter