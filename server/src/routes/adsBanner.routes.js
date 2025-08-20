import { Router } from 'express'

//Controllers
import {
    getAdsBannersController,
    addAndUpdateAdsBannersController,
    deleteAdsBannersController,
    deleteMultipleAdsBannersController
} from '../controllers/adsBanner.controller.js'

//Utility
import { uploadImgsUtility } from '../utils/uploadImgs.utility.js'
import { destroyImgUtility } from '../utils/destroyImgs.utility.js'

//Middleware
import loginAuthentication from '../middlewares/login.authentication.js'
import upload from '../middlewares/multer.storage.js'

//Router
const adsBannerRouter = Router()

//Routes & Requests

//GET
adsBannerRouter.get('/', loginAuthentication, getAdsBannersController)

//POST
adsBannerRouter.post('/upload/img', loginAuthentication, upload.array('img', 1), (req, res) => uploadImgsUtility(req, res, 'Ads Banner', 'adsBanners'))
adsBannerRouter.post('/add', loginAuthentication, (req, res) => addAndUpdateAdsBannersController(req, res, false))

//PUT
adsBannerRouter.put('/edit/:adsBannerId', loginAuthentication, (req, res) => addAndUpdateAdsBannersController(req, res, true))

//DELETE
adsBannerRouter.delete('/destroy/img', loginAuthentication, destroyImgUtility)
adsBannerRouter.delete('/delete/:adsBannerId', loginAuthentication, deleteAdsBannersController)
adsBannerRouter.delete('/delete', loginAuthentication, deleteMultipleAdsBannersController)

export default adsBannerRouter