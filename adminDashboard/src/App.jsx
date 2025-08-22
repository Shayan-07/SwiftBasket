import { createContext, useEffect, useMemo, useState } from "react"
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router-dom"
import { renderToString } from "react-dom/server"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

import GetData from "./helpers/getData"

import Header from "./components/header"
import SideBar from "./components/sidebar"
import Footer from "./components/footer"
import PrivateRoute from "./components/privateRoute"
import GuestRoute from "./components/guestRoute"

import Dashboard from "./pages/dashboard"
import Page404 from "./pages/page404"
import UserProfile from "./pages/userProfile"
import Homeslides from "./pages/homeslides"
import AddHomeSlides from "./pages/homeslides/addHomeSlides"
import Categories from "./pages/categories"
import AddCategories from "./pages/categories/addCategories"
import SubCategories from "./pages/subCategories"
import AddSubCategories from "./pages/subCategories/addSubCategories"
import Products from "./pages/products"
import AddProducts from "./pages/products/addProducts"
import UsersTable from "./pages/users"
import Orders from "./pages/orders"
import AdsBanner from "./pages/adsBanner"
import AddAdsBanner from "./pages/adsBanner/addAdsBanner"
import Blogs from "./pages/blogs"
import AddBlog from "./pages/blogs/addBlog"
import Register from "./pages/register"
import VerifyEmail from "./pages/verifyEmail"
import Login from "./pages/login"
import ForgotPassword from "./pages/forgotPassword"
import VerifyPass from "./pages/verifyPass"
import ResetPassword from "./pages/resetPassword"

import { RiErrorWarningLine } from "react-icons/ri"
import { FaBold, FaRegCircleCheck } from "react-icons/fa6"
import { LuCodeXml, LuItalic, LuLink, LuRedo, LuRemoveFormatting, LuStrikethrough, LuUnderline, LuUndo } from "react-icons/lu"

const context = createContext()

const AppLayout = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isItemSelected, setIsItemSelected] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
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
          if (resData.message !== '')setIsError(resData.message)
        }
      })
      .catch(() => {
        setIsAuthenticated(false)
        setIsError('Something went wrong!')
      })
  }, [isAuthenticated])

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

  const location = useLocation()
  const hideLayoutRoutes = ["/register", "/verifyemail", "/login", "/forgotpassword", "/verifypass", "/resetpassword"]
  const showLayout = !hideLayoutRoutes.includes(location.pathname)

  useEffect(() => {
    if (showLayout && isAuthenticated === false && isSuccess !== 'Logged Out' && isError === '') setIsError('Kindly login to continue')
  }, [isAuthenticated, location.pathname, isError, isSuccess])

  useEffect(() => {
    if (showLayout) {
      document.body.style.background = '#f1f1f1'
    } else {
      document.body.style.background = '#f1f1f1'
    }
  }, [showLayout])

  const [isHeaderHeight, setisHeaderHeight] = useState(null)

  useEffect(() => {
    if (showLayout && isAuthenticated) {
      const header = document.querySelector(".header")
      if (header) {
        const height = header?.scrollHeight
        if (height) {
          setisHeaderHeight(height)
        }
      }
    }
  }, [showLayout, isAuthenticated])

  const [isLoading, setIsLoading] = useState(false)

  const [user, setUser] = useState([])
  const [homeSlides, setHomeSlides] = useState([])
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [nestedSubCategories, setNestedSubCategories] = useState([])
  const [products, setProducts] = useState([])
  const [adsBanners, setAdsBanners] = useState([])
  const [blogs, setBlogs] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      const [
        userRes,
        homeSlidesRes,
        categoriesRes,
        subCategoriesRes,
        nestedSubCategoriesRes,
        productsRes,
        adsBannersRes,
        blogsRes,
        ordersRes,
      ] = await Promise.all([
        GetData(appURI, 'user'),
        GetData(appURI, 'homeslide'),
        GetData(appURI, 'category'),
        GetData(appURI, 'category/sub'),
        GetData(appURI, 'category/sub/nested'),
        GetData(appURI, 'product'),
        GetData(appURI, 'adsbanner'),
        GetData(appURI, 'blog'),
        GetData(appURI, 'order'),
      ])

      if (userRes.data) setUser(userRes.data)
      if (homeSlidesRes.data) setHomeSlides(homeSlidesRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (subCategoriesRes.data) setSubCategories(subCategoriesRes.data)
      if (nestedSubCategoriesRes.data) setNestedSubCategories(nestedSubCategoriesRes.data)
      if (productsRes.data) setProducts(productsRes.data)
      if (adsBannersRes.data) setAdsBanners(adsBannersRes.data)
      if (blogsRes.data) setBlogs(blogsRes.data)
      if (ordersRes.data) setOrders(ordersRes.data)

      const errors = [
        userRes.error,
        homeSlidesRes.error,
        categoriesRes.error,
        subCategoriesRes.error,
        nestedSubCategoriesRes.error,
        productsRes.error,
        adsBannersRes.error,
        blogsRes.error,
        ordersRes.error,
      ].filter(Boolean)

      if (errors.length > 0) {
        setIsError(errors[0])
      }

      setIsLoading(false)
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const values = useMemo(() => ({
    appURI,
    isSidebarOpen,
    setIsSidebarOpen,
    isItemSelected,
    setIsItemSelected,
    selectedItems,
    setSelectedItems,
    setIsError,
    setIsSuccess,
    isAuthenticated,
    setIsAuthenticated,
    resetFlow,
    setResetFlow,
    isLoading,
    userData,
    setUserData,
    user,
    setUser,
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
    orders,
    setOrders
  }), [
    isSidebarOpen,
    isItemSelected,
    selectedItems,
    isError,
    isSuccess,
    isAuthenticated,
    resetFlow,
    isLoading,
    userData,
    user,
    homeSlides,
    categories,
    subCategories,
    nestedSubCategories,
    products,
    adsBanners,
    blogs,
    orders
  ])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const rswBtns = document.querySelectorAll('.rsw-btn')

      if (rswBtns.length === 0) return

      rswBtns.forEach(btn => {
        if (btn.getAttribute('data-icon-set') === 'true') return

        const title = btn.getAttribute('title')
        let iconHTML = ''

        if (title === 'Undo') iconHTML = renderToString(<LuUndo />)
        else if (title === 'Redo') iconHTML = renderToString(<LuRedo />)
        else if (title === 'Bold') iconHTML = renderToString(<FaBold />)
        else if (title === 'Italic') iconHTML = renderToString(<LuItalic />)
        else if (title === 'Underline') iconHTML = renderToString(<LuUnderline />)
        else if (title === 'Strike through') iconHTML = renderToString(<LuStrikethrough />)
        else if (title === 'Link') iconHTML = renderToString(<LuLink />)
        else if (title === 'Clear formatting') iconHTML = renderToString(<LuRemoveFormatting />)
        else if (title === 'HTML mode') iconHTML = renderToString(<LuCodeXml className="text-[1.7rem]" />)

        if (iconHTML) {
          btn.innerHTML = iconHTML
          btn.setAttribute('data-icon-set', 'true')
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [location.pathname])

  return (
    <>
      <context.Provider value={values}>
        {isAuthenticated === undefined && showLayout ?
          <DotLottieReact
            src="./lottie/cartLoader.lottie"
            loop
            autoplay
            style={{ width: '80%', margin: 'auto' }}
          />
          :
          <main className={`flex flex-wrap content-between relative ${showLayout ? 'justify-end' : 'justify-center'}`}
            style={{
              marginTop: isAuthenticated && showLayout && isHeaderHeight ? `${isHeaderHeight + 20}px` : 0,
              minHeight: isAuthenticated && showLayout && isHeaderHeight ? `calc(100vh - ${isHeaderHeight + 20}px)` : '100vh'
            }}
          >
            {isAuthenticated && showLayout && <Header />}
            {isAuthenticated && showLayout && <SideBar />}
            <div className={`
            layoutContent transition-all duration-300 
            ${showLayout ? 'min-h-auto content-between' : 'min-h-screen content-center'}
            ${isSidebarOpen ? 'w-[80vw]' : 'w-full'}
            `}
              style={{ justifySelf: `${isSidebarOpen ? 'end' : 'start'}` }}
            >
              <Outlet />
            </div>
            {isAuthenticated && showLayout && <Footer />}
          </main>
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
          element: <PrivateRoute><Dashboard /></PrivateRoute>
        },
        {
          path: "profile",
          element: <PrivateRoute><UserProfile /></PrivateRoute>
        },
        {
          path: "homeslides",
          element: <PrivateRoute><Homeslides /></PrivateRoute>
        },
        {
          path: "homeslides/add",
          element: <PrivateRoute><AddHomeSlides /></PrivateRoute>
        },
        {
          path: "categories",
          element: <PrivateRoute><Categories /></PrivateRoute>
        },
        {
          path: "categories/add",
          element: <PrivateRoute><AddCategories /></PrivateRoute>
        },
        {
          path: "subcategories",
          element: <PrivateRoute><SubCategories /></PrivateRoute>
        },
        {
          path: "subcategories/add",
          element: <PrivateRoute><AddSubCategories /></PrivateRoute>
        },
        {
          path: "products",
          element: <PrivateRoute><Products /></PrivateRoute>
        },
        {
          path: "products/add",
          element: <PrivateRoute><AddProducts /></PrivateRoute>
        },
        {
          path: "users",
          element: <PrivateRoute><UsersTable /></PrivateRoute>
        },
        {
          path: "orders",
          element: <PrivateRoute><Orders /></PrivateRoute>
        },
        {
          path: "adsbanner",
          element: <PrivateRoute><AdsBanner /></PrivateRoute>
        },
        {
          path: "adsbanner/add",
          element: <PrivateRoute><AddAdsBanner /></PrivateRoute>
        },
        {
          path: "blogs",
          element: <PrivateRoute><Blogs /></PrivateRoute>
        },
        {
          path: "blogs/add",
          element: <PrivateRoute><AddBlog /></PrivateRoute>
        }
      ]
    }
  ])

  return <RouterProvider router={router} />
}

export default App
export { context }
