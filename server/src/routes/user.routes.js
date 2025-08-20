import { Router } from 'express'

//Controllers
import {
    getUsers,
    searchedUsers,
    updateUserAvatar,
    updateUserName,
    updateUserPass
} from '../controllers/user.controller.js'

//Middleware
import loginAuthentication from '../middlewares/login.authentication.js'
import upload from '../middlewares/multer.storage.js'

//Router
const userRouter = Router()

//Routes
userRouter.get('/', loginAuthentication, getUsers)
userRouter.post('/search', loginAuthentication, searchedUsers)
userRouter.put('/avatar', loginAuthentication, upload.single('img'), updateUserAvatar)
userRouter.put('/username', loginAuthentication, updateUserName)
userRouter.put('/password', loginAuthentication, updateUserPass)

export default userRouter