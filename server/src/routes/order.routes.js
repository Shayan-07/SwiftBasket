import { Router } from 'express'

//Controllers
import {
    getAllOrdersController,
    getUserOrdersController,
    placeOrderController,
    searchedOrdersController,
    orderUpdatesController,
    cancelOrderController
} from '../controllers/order.controller.js'

//Middleware
import loginAuthentication from '../middlewares/login.authentication.js'

//Router
const orderRouter = Router()

//Routes & Requests

//GET
orderRouter.get('/', loginAuthentication, getAllOrdersController)
orderRouter.get('/user', loginAuthentication, getUserOrdersController)

//POST
orderRouter.post('/place', loginAuthentication, placeOrderController)
orderRouter.post('/search', loginAuthentication, searchedOrdersController)

//PUT
orderRouter.put('/status/:orderId', loginAuthentication, orderUpdatesController)

//DELETE
orderRouter.delete('/cancel', loginAuthentication, cancelOrderController)

export default orderRouter
