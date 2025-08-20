import { Router } from 'express'

//Controllers
import {
    getHomeSlidesController,
    addAndUpdateHomeSlidesController,
    deleteHomeSlideController,
    deleteMultipleHomeSlidesController
} from '../controllers/homeslide.controller.js'

//Utility
import { uploadImgsUtility } from '../utils/uploadImgs.utility.js'
import { destroyImgUtility } from '../utils/destroyImgs.utility.js'

//Middleware
import loginAuthentication from '../middlewares/login.authentication.js'
import upload from '../middlewares/multer.storage.js'

//Router
const homeSlideRouter = Router()

//Routes & Requests

//GET
homeSlideRouter.get('/', loginAuthentication, getHomeSlidesController)

//POST
homeSlideRouter.post('/upload/img', loginAuthentication, upload.array('img'), (req, res) => uploadImgsUtility(req, res, 'Home Slide', 'homeSlides'))
homeSlideRouter.post('/add', loginAuthentication, (req, res) => addAndUpdateHomeSlidesController(req, res, false))

//PUT
homeSlideRouter.put('/edit/:homeSlideId', loginAuthentication, (req, res) => addAndUpdateHomeSlidesController(req, res, true))

//DELETE
homeSlideRouter.delete('/destroy/img', loginAuthentication, destroyImgUtility)
homeSlideRouter.delete('/delete/:homeSlideId', loginAuthentication, deleteHomeSlideController)
homeSlideRouter.delete('/delete', loginAuthentication, deleteMultipleHomeSlidesController)

export default homeSlideRouter
