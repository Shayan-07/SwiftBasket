import { Router } from 'express'

//Controllers
import {
    getProductController,
    getAllProductsController,
    productsFiltersController,
    addAndUpdateProductsController,
    addProductReviewController,
    deleteProductController,
    deleteMultipleProductsController
} from '../controllers/product.controller.js'

//Utility
import { uploadImgsUtility } from '../utils/uploadImgs.utility.js'
import { destroyImgUtility } from '../utils/destroyImgs.utility.js'

//Middleware
import loginAuthentication from '../middlewares/login.authentication.js'
import upload from '../middlewares/multer.storage.js'

//Router
const productRouter = Router()

//Routes & Requests

//GET
productRouter.get('/:productId', loginAuthentication, getProductController)
productRouter.get('/', loginAuthentication, getAllProductsController)

//POST
productRouter.post('/filter', loginAuthentication, productsFiltersController)
productRouter.post('/upload/img', loginAuthentication, upload.array('img'), (req, res) => uploadImgsUtility(req, res, 'Product', 'products'))
productRouter.post('/add', loginAuthentication, (req, res) => addAndUpdateProductsController(req, res, false))
productRouter.post('/review/:productId', loginAuthentication, addProductReviewController)

//PUT
productRouter.put('/edit/:productId', loginAuthentication, (req, res) => addAndUpdateProductsController(req, res, true))

//DELETE
productRouter.delete('/destroy/img', loginAuthentication, destroyImgUtility)
productRouter.delete('/delete/:productId', loginAuthentication, deleteProductController)
productRouter.delete('/delete', loginAuthentication, deleteMultipleProductsController)

export default productRouter
