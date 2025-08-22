// dotenv setup
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

//Packages
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// Config
import connectDB from './config/connectDB.js'
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

//Model
import UserModel from './models/user.model.js'

//Router Imports
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import addressRouter from './routes/address.routes.js'
import homeSlideRouter from './routes/homeSlide.routes.js'
import categoryRouter from './routes/category.routes.js'
import subCategoryRouter from './routes/subCategory.routes.js'
import nestedSubCategoryRouter from './routes/nestedSubCategory.routes.js'
import productRouter from './routes/product.routes.js'
import orderRouter from './routes/order.routes.js'
import cartRouter from './routes/cart.routes.js'
import wishlistRouter from './routes/wishlist.routes.js'
import adsBannerRouter from './routes/adsBanner.routes.js'
import blogRouter from './routes/blog.routes.js'

// Middleware
import loginAuthentication from './middlewares/login.authentication.js'
const app = express()

app
    .use(helmet({ crossOriginResourcePolicy: false }))
    .use(morgan('dev'))
    .use(cors({ origin: ["https://swiftbasket-j9yq.onrender.com", "localhost:5173", "localhost:5174"], credentials: true }))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())

//Routers
app
    .use('/auth', authRouter) // Auth Router
    .use('/user', userRouter) // Auth Router
    .use('/address', addressRouter) // Address Router
    .use('/homeslide', homeSlideRouter) // HomeSlide Router
    .use('/category', categoryRouter) // Category Router
    .use('/category/sub', subCategoryRouter) // SubCategory Router
    .use('/category/sub/nested', nestedSubCategoryRouter) // Nested SubCategory Router
    .use('/product', productRouter) // Product Router
    .use('/order', orderRouter) // Order Router
    .use('/cart', cartRouter) // Cart Router
    .use('/wishlist', wishlistRouter) // Wishlist Router
    .use('/adsbanner', adsBannerRouter) // Ads Banner Router
    .use('/blog', blogRouter) // Blog Router

//Auth_Check
app.get('/', loginAuthentication, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                auth: false,
                success: false,
                error: true
            })
        }

        return res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                isGoogleAuth: user.isGoogleAuth
            },
            success: true,
            error: false
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message || 'Something went wrong!',
            success: false,
            error: true
        })
    }
})

//Logout
app.get('/logout', loginAuthentication, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(currentToken => req.token !== currentToken.token)
        res.clearCookie('logToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none'
        })
        await req.user.save()

        return res.status(201).json({
            message: 'Logged Out',
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(400).json({
            message: `Couldn't log out. Please try again later`,
            error: true,
            success: false
        })
    }
})

//Port
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is Running at Port ${process.env.PORT}`)
    })
}).catch(error => {
    throw new Error('Somthing went wrong!')
})
