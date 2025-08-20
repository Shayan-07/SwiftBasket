import { Router } from 'express'

//Controllers
import {
    getCategoryController,
    addAndUpdateCategoryController,
    deleteCategoryController,
    deleteMultipleCategoriesController
} from '../controllers/category.controller.js'

//Utility
import { uploadImgsUtility } from '../utils/uploadImgs.utility.js'
import { destroyImgUtility } from '../utils/destroyImgs.utility.js'

//Middleware
import loginAuthentication from '../middlewares/login.authentication.js'
import upload from '../middlewares/multer.storage.js'

//Router
const categoryRouter = Router()

//Routes & Requests

//GET
categoryRouter.get('/', loginAuthentication, getCategoryController)

//POST
categoryRouter.post('/upload/img', loginAuthentication, upload.array('img', 1), (req, res) => uploadImgsUtility(req, res, 'Category', 'categories'))
categoryRouter.post('/add', loginAuthentication, (req, res) => addAndUpdateCategoryController(req, res, false))

//PUT
categoryRouter.put('/edit/:catId', loginAuthentication, (req, res) => addAndUpdateCategoryController(req, res, true))

//DELETE
categoryRouter.delete('/destroy/img', loginAuthentication, destroyImgUtility)
categoryRouter.delete('/delete/:catId', loginAuthentication, deleteCategoryController)
categoryRouter.delete('/delete', loginAuthentication, deleteMultipleCategoriesController)

export default categoryRouter
