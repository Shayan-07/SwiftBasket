import { Router } from 'express'

//Controllers
import { 
    getAddressController,
    addAndUpdateAddressController,
    deleteAddressController
 } from '../controllers/address.controller.js'

//Middleware
import loginAuthentication from '../middlewares/login.authentication.js'

//Router
const addressRouter = Router()

//Routes & Requests

//GET
addressRouter.get('/', loginAuthentication, getAddressController)

//POST
addressRouter.post('/add', loginAuthentication, (req, res) => addAndUpdateAddressController(req, res, false))

//PUT
addressRouter.put('/edit/:addressId', loginAuthentication, (req, res) => addAndUpdateAddressController(req, res, true))

//DELETE
addressRouter.delete('/delete/:addressId', loginAuthentication, deleteAddressController)

export default addressRouter
