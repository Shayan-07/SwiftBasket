import { useEffect, useMemo, useState, useRef, createContext } from "react"
import { useLocation, useNavigate, createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import { Button, Dialog, DialogContent } from '@mui/material'
import { IoClose } from "react-icons/io5"
import { RiErrorWarningLine } from "react-icons/ri"
import { FaRegCircleCheck } from "react-icons/fa6"

import PrivateRoute from "./components/privateRoute"
import GuestRoute from "./components/guestRoute"
import Header from "./components/header"
import Footer from "./components/footer"
import ImgZoom from "./components/imgZoom"
import ProductDetailsContent from "./components/productDetailsContent"

import GetData from "./helpers/getData"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

import Home from "./pages/home"
import Page404 from "./pages/page404"
import ProductsListing from "./pages/productsListing"
import ProductDetails from "./pages/productDetails"
import Blog from "./pages/blog"
import Cart from "./pages/cart"
import Checkout from "./pages/checkout"
import UserProfile from "./pages/userProfile"
import Address from "./pages/address"
import Wishlist from "./pages/wishlist"
import Orders from "./pages/orders"
import Register from "./pages/register"
import VerifyEmail from "./pages/verifyEmail"
import Login from "./pages/login"
import ForgotPassword from "./pages/forgotPassword"
import VerifyPass from "./pages/verifyPass"
import ResetPassword from "./pages/resetPassword"

const context = createContext()

const AppLayout = () => {

  const location = useLocation()
  const showLayout = location.pathname !== "/404"

  const [openProductModal, setOpenProductModal] = useState(false)
  const [isError, setIsError] = useState('')
  const [isSuccess, setIsSuccess] = useState('')

  const [isAuthenticated, setIsAuthenticated] = useState(undefined)
  const [resetFlow, setResetFlow] = useState(false)
  const [userData, setUserData] = useState({})

  const appURI = import.meta.env.VITE_APP_URI

  useEffect(() => {
    fetch(`${appURI}/`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setIsAuthenticated(true)
          setUserData(resData.user)
        } else {
          setIsAuthenticated(false)
          if (resData.message !== '') setIsError(resData.message)
        }
      })
      .catch((err) => {
        setIsError(err.message || 'Something went wrong!')
        setIsAuthenticated(false)
      })
  }, [isAuthenticated])

  const authRoutes = ["/login", "/register", "/verifyemail", "/forgotpassword", "/verifypass", "/resetpassword"]

  const lottieRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authRoutes.includes(location.pathname) && isAuthenticated === false && isSuccess !== 'Logged Out' && isError === '') setIsError('Kindly login to continue')
  }, [isAuthenticated, location.pathname, isError, isSuccess])

  useEffect(() => {
    if (isError !== '') {
      const timer = setTimeout(() => {
        setIsError('')
      }, 7250)

      return () => clearTimeout(timer)
    }
  }, [isError])

  useEffect(() => {
    if (isSuccess !== '') {
      const timer = setTimeout(() => {
        setIsSuccess('')
      }, 7250)

      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  const [modalProduct, setModalProduct] = useState({})
  const [isOrdered, setIsOrdered] = useState(false)

  const [fullWidth, setFullWidth] = useState(true)
  const [maxWidth, setMaxWidth] = useState('xl')

  const [isSlideLoading, setIsSlideLoading] = useState(false)
  const [isCatLoading, setIsCatLoading] = useState(false)
  const [isSubCatLoading, setIsSubCatLoading] = useState(false)
  const [isNestedSubCatLoading, setIsNestedSubCatLoading] = useState(false)
  const [isProductLoading, setIsProductLoading] = useState(false)
  const [isAdsLoading, setIsAdsLoading] = useState(false)
  const [isBlogLoading, setIsBlogLoading] = useState(false)
  const [isAddressLoading, setIsAddressLoading] = useState(false)
  const [isCartLoading, setIsCartLoading] = useState(false)
  const [isListLoading, setIsListLoading] = useState(false)
  const [isOrderLoading, setIsOrderLoading] = useState(false)

  const [homeSlides, setHomeSlides] = useState([])
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [nestedSubCategories, setNestedSubCategories] = useState([])
  const [products, setProducts] = useState([])
  const [adsBanners, setAdsBanners] = useState([])
  const [blogs, setBlogs] = useState([])
  const [addresses, setAddresses] = useState([])
  const [cart, setCart] = useState([])
  const [list, setList] = useState([])
  const [order, setOrder] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const [
        homeSlidesRes,
        categoriesRes,
        subCategoriesRes,
        nestedSubCategoriesRes,
        productsRes,
        adsBannersRes,
        blogsRes,
        addressesRes,
        cartRes,
        listRes,
        orderRes
      ] = await Promise.all([
        GetData(appURI, setIsSlideLoading, 'homeslide'),
        GetData(appURI, setIsCatLoading, 'category'),
        GetData(appURI, setIsSubCatLoading, 'category/sub'),
        GetData(appURI, setIsNestedSubCatLoading, 'category/sub/nested'),
        GetData(appURI, setIsProductLoading, 'product'),
        GetData(appURI, setIsAdsLoading, 'adsbanner'),
        GetData(appURI, setIsBlogLoading, 'blog'),
        GetData(appURI, setIsAddressLoading, 'address'),
        GetData(appURI, setIsCartLoading, 'cart'),
        GetData(appURI, setIsListLoading, 'wishlist'),
        GetData(appURI, setIsOrderLoading, 'order')
      ])

      if (homeSlidesRes.data) setHomeSlides(homeSlidesRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (subCategoriesRes.data) setSubCategories(subCategoriesRes.data)
      if (nestedSubCategoriesRes.data) setNestedSubCategories(nestedSubCategoriesRes.data)
      if (productsRes.data) setProducts(productsRes.data)
      if (adsBannersRes.data) setAdsBanners(adsBannersRes.data)
      if (blogsRes.data) setBlogs(blogsRes.data)
      if (addressesRes.data) setAddresses(addressesRes.data)
      if (cartRes.data) setCart(cartRes.data)
      if (listRes.data) setList(listRes.data)
      if (orderRes.data) setOrder(orderRes.data)

      const errors = [
        homeSlidesRes.error,
        categoriesRes.error,
        subCategoriesRes.error,
        nestedSubCategoriesRes.error,
        productsRes.error,
        adsBannersRes.error,
        blogsRes.error,
        addressesRes.error,
        cartRes.error,
        listRes.error,
        orderRes.error,
      ].filter(Boolean)

      if (errors.length > 0) {
        setIsError(errors[0])
      }
    }


    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const value = useMemo(() => ({
    setOpenProductModal,
    setModalProduct,
    setIsError,
    setIsSuccess,
    isAuthenticated,
    setIsAuthenticated,
    isOrdered,
    setIsOrdered,
    userData,
    setUserData,
    resetFlow,
    setResetFlow,
    appURI,
    isSlideLoading,
    isCatLoading,
    isSubCatLoading,
    isNestedSubCatLoading,
    isProductLoading,
    isAdsLoading,
    isBlogLoading,
    setIsBlogLoading,
    isAddressLoading,
    isCartLoading,
    isListLoading,
    setIsListLoading,
    isOrderLoading,
    homeSlides,
    setHomeSlides,
    categories,
    setCategories,
    subCategories,
    setSubCategories,
    nestedSubCategories,
    setNestedSubCategories,
    products,
    setProducts,
    adsBanners,
    setAdsBanners,
    blogs,
    setBlogs,
    addresses,
    setAddresses,
    cart,
    setCart,
    list,
    setList,
    order,
    setOrder
  }), [
    openProductModal,
    modalProduct,
    isError,
    isSuccess,
    isAuthenticated,
    isOrdered,
    userData,
    resetFlow,
    appURI,
    isSlideLoading,
    isCatLoading,
    isSubCatLoading,
    isNestedSubCatLoading,
    isProductLoading,
    isAdsLoading,
    isBlogLoading,
    isAddressLoading,
    isCartLoading,
    isListLoading,
    isOrderLoading,
    homeSlides,
    categories,
    subCategories,
    nestedSubCategories,
    products,
    adsBanners,
    blogs,
    addresses,
    cart,
    list,
    order
  ])

  const handleCloseProductModal = () => {
    setOpenProductModal(false)
  }

  return (
    <>
      <context.Provider value={value}>

        {isAuthenticated === undefined && showLayout ?
          <DotLottieReact
            src="./lottie/cartLoader.lottie"
            loop
            autoplay
            style={{ width: '80%', margin: 'auto' }}
          />
          :
          isOrdered ?
            <DotLottieReact
              src="./lottie/ordered.lottie"
              loop={false}
              autoplay
              dotLottieRefCallback={(instance) => {
                if (instance) {
                  lottieRef.current = instance
                  instance.addEventListener('complete', () => {
                    navigate("/orders", { replace: true })
                    setIsOrdered(false)
                  })
                }
              }}
              style={{ width: "80%", margin: "auto" }}
            />
            :
            <>
              {showLayout && isAuthenticated && !isOrdered && <Header />}
              <Outlet />
              {showLayout && isAuthenticated && !isOrdered && <Footer />}
            </>
        }

        {isError && (
          <div key={isError} className="errMsg fixed top-[5rem] left-1/2 -translate-x-1/2 flex justify-center items-center overflow-hidden rounded-[5rem]">
            <div className="shadow-md flex items-center gap-2 bg-red-400 p-4 cursor-pointer">
              <RiErrorWarningLine className="text-white text-[2rem]" />
              <span className="msg text-[1.5rem] text-white font-[600] max-w-0 truncate">{isError}</span>
            </div>
          </div>
        )}

        {isSuccess && (
          <div key={isSuccess} className="successMsg fixed top-[10rem] left-1/2 -translate-x-1/2 flex justify-center items-center overflow-hidden rounded-[5rem]">
            <div className="shadow-md flex items-center gap-2 bg-green-400 p-4 cursor-pointer">
              <FaRegCircleCheck className="text-white text-[2rem]" />
              <span className="msg text-[1.5rem] text-white font-[600] max-w-0 truncate">{isSuccess}</span>
            </div>
          </div>
        )}


        <Dialog
          open={openProductModal}
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          onClose={handleCloseProductModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent className="scrollable">
            <Button className="!rounded-full !bg-[#f1f1f1] !text-[#3e3e3e] !p-4 !min-w-auto !absolute right-[24px] top-[20px]" onClick={handleCloseProductModal}>
              <IoClose className="text-[2rem]" />
            </Button>
            <div className="productModal grid grid-cols-[40%_60%]">
              <ImgZoom mediaImgUrls={modalProduct.mediaImgUrls || []} isProductLoading={Object.keys(modalProduct).length === 0} />
              <ProductDetailsContent
                id={modalProduct._id}
                brandName={modalProduct.brandName}
                title={modalProduct.title}
                desc={modalProduct.description}
                rating={modalProduct.totalRating}
                price={modalProduct.price}
                discount={modalProduct.discount}
                discountedPrice={modalProduct.discountedPrice}
                totalReviews={modalProduct.totalReviews}
                stock={modalProduct.stock}
                isProductLoading={Object.keys(modalProduct).length === 0}
              />
            </div>
          </DialogContent>
        </Dialog>
      </context.Provider>
    </>
  )
}

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <Page404 />,
      children: [
        //Auth Routes
        {
          path: "login",
          element: <GuestRoute><Login /></GuestRoute>
        },
        {
          path: "register",
          element: <GuestRoute><Register /></GuestRoute>
        },
        {
          path: "verifyemail",
          element: <GuestRoute><VerifyEmail /></GuestRoute>
        },
        {
          path: "forgotpassword",
          element: <GuestRoute><ForgotPassword /></GuestRoute>
        },
        {
          path: "verifypass",
          element: <GuestRoute><VerifyPass /></GuestRoute>
        },
        {
          path: "resetpassword",
          element: <GuestRoute><ResetPassword /></GuestRoute>
        },

        //Page Routes
        {
          index: true,
          element: <PrivateRoute><Home /></PrivateRoute>
        },
        {
          path: "products",
          element: <PrivateRoute><ProductsListing /></PrivateRoute>
        },
        {
          path: "productdetails/:id",
          element: <PrivateRoute><ProductDetails /></PrivateRoute>
        },
        {
          path: "blog/:id",
          element: <PrivateRoute><Blog /></PrivateRoute>
        },
        {
          path: "cart",
          element: <PrivateRoute><Cart /></PrivateRoute>
        },
        {
          path: "checkout",
          element: <PrivateRoute><Checkout /></PrivateRoute>
        },
        {
          path: "profile",
          element: <PrivateRoute><UserProfile /></PrivateRoute>
        },
        {
          path: "address",
          element: <PrivateRoute><Address /></PrivateRoute>
        },
        {
          path: "wishlist",
          element: <PrivateRoute><Wishlist /></PrivateRoute>
        },
        {
          path: "orders",
          element: <PrivateRoute><Orders /></PrivateRoute>
        },
      ]
    }
  ])

  return <RouterProvider router={router} />
}

export default App
export { context }
