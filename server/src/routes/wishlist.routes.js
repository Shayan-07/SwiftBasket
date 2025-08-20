import { Router } from 'express'

//Controllers
import {
    getListItemsController,
    addToWishlistController,
    removeFromListController
} from '../controllers/wishlist.controller.js'

//Middleware
import loginAuthentication from '../middlewares/login.authentication.js'

//Router
const wishlistRouter = Router()

//Routes & Requests

//GET
wishlistRouter.get('/', loginAuthentication, getListItemsController)

//POST
wishlistRouter.post('/add', loginAuthentication, addToWishlistController)

//DELETE
wishlistRouter.delete('/delete/:listProductId', loginAuthentication, removeFromListController)

export default wishlistRouter