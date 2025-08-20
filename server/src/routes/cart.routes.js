import { Router } from 'express'

//Controllers
import {
    getCartItemsController,
    addToCartController,
    updateQuantityController,
    removeFromCartController,
    removeMultipleItemsFromCartController
} from '../controllers/cart.controller.js'

//Middleware
import loginAuthentication from '../middlewares/login.authentication.js'

//Router
const cartRouter = Router()

//Routes & Requests

//GET
cartRouter.get('/', loginAuthentication, getCartItemsController)

//POST
cartRouter.post('/add', loginAuthentication, addToCartController)

//PUT
cartRouter.put('/quantity/:cartProductId', loginAuthentication, updateQuantityController)

//DELETE
cartRouter.delete('/delete/:cartProductId', loginAuthentication, removeFromCartController)
cartRouter.delete('/delete', loginAuthentication, removeMultipleItemsFromCartController)

export default cartRouter
