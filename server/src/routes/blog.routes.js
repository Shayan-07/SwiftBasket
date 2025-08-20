import { Router } from 'express'

//Controllers
import {
    getBlogController,
    getMultipleBlogsController,
    addAndUpdateBlogsController,
    deleteBlogController,
    deleteMultipleBlogsController
} from '../controllers/blog.controller.js'

//Utility
import { uploadImgsUtility } from '../utils/uploadImgs.utility.js'
import { destroyImgUtility } from '../utils/destroyImgs.utility.js'

//Middleware
import loginAuthentication from '../middlewares/login.authentication.js'
import upload from '../middlewares/multer.storage.js'

//Router
const blogRouter = Router()

//Routes & Requests

//GET
blogRouter.get('/:blogId', loginAuthentication, getBlogController)
blogRouter.get('/', loginAuthentication, getMultipleBlogsController)

//POST
blogRouter.post('/upload/img', loginAuthentication, upload.array('img', 1), (req, res) => uploadImgsUtility(req, res, 'Blog', 'blogs'))
blogRouter.post('/add', loginAuthentication, (req, res) => addAndUpdateBlogsController(req, res, false))

//PUT
blogRouter.put('/edit/:blogId', loginAuthentication, (req, res) => addAndUpdateBlogsController(req, res, true))

//DELETE
blogRouter.delete('/destroy/img', loginAuthentication, destroyImgUtility)
blogRouter.delete('/delete/:blogId', loginAuthentication, deleteBlogController)
blogRouter.delete('/delete', loginAuthentication, deleteMultipleBlogsController)

export default blogRouter