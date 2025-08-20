import { Router } from 'express'

//Controllers
import {
    getSubCategoryController,
    addAndUpdateSubCategoryController,
    deleteSubCategoryController
} from '../controllers/subCategory.controller.js'

//Middleware
import loginAuthentication from '../middlewares/login.authentication.js'

//Router
const subCategoryRouter = Router()

//Routes & Requests

//GET
subCategoryRouter.get('/', loginAuthentication, getSubCategoryController)

//POST
subCategoryRouter.post('/add', loginAuthentication, (req, res) => addAndUpdateSubCategoryController(req, res, false))

//PUT
subCategoryRouter.put('/edit/:subCatId', loginAuthentication, (req, res) => addAndUpdateSubCategoryController(req, res, true))

//DELETE
subCategoryRouter.delete('/delete/:subCatId', loginAuthentication, deleteSubCategoryController)

export default subCategoryRouter
