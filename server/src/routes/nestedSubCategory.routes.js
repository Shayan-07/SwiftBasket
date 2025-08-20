import { Router } from 'express'

//Controllers
import {
    getNestedSubCategoryController,
    addAndUpdateNestedSubCategoryController,
    deleteNestedSubCategoryController
} from '../controllers/nestedSubCategory.controller.js'

//Middleware
import loginAuthentication from '../middlewares/login.authentication.js'

//Router
const nestedSubCategoryRouter = Router()

//Routes & Requests

//GET
nestedSubCategoryRouter.get('/', loginAuthentication, getNestedSubCategoryController)

//POST
nestedSubCategoryRouter.post('/add', loginAuthentication, (req, res) => addAndUpdateNestedSubCategoryController(req, res, false))

//PUT
nestedSubCategoryRouter.put('/edit/:nestedSubCatId', loginAuthentication, (req, res) => addAndUpdateNestedSubCategoryController(req, res, true))

//DELETE
nestedSubCategoryRouter.delete('/delete/:nestedSubCatId', loginAuthentication, deleteNestedSubCategoryController)

export default nestedSubCategoryRouter