import { useState, useContext, useEffect } from 'react'
import SearchBar from './searchbar'
import { Link, useNavigate } from 'react-router-dom'
import Navigation from './navigation'
import Badge from '@mui/material/Badge'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import CartPanelItem from '../cartPanelItem'
import { Button, Drawer, Tooltip } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { MdLogout, MdMyLocation, MdOutlineHelpOutline } from "react-icons/md"
import { LiaShippingFastSolid } from "react-icons/lia"
import { IoMdHeartEmpty } from "react-icons/io"
import { HiOutlineShoppingCart } from "react-icons/hi2"
import { IoClose } from "react-icons/io5"
import { IoBagCheckOutline } from "react-icons/io5"
import { FaRegAddressCard, FaRegHeart } from 'react-icons/fa6'
import { FiShoppingBag } from 'react-icons/fi'
import { context } from '../../App'
import LogoutFunc from '../../helpers/logoutFunc'

const Header = () => {

    const { cart, setCart, isCartLoading, list, isAuthenticated, userData, appURI, setIsAuthenticated, setIsError, setIsSuccess } = useContext(context)

    const StyledBadge = styled(Badge)(() => ({
        '& .MuiBadge-badge': {
            right: -3,
            top: 13,
            background: `#ff5252`,
            padding: '0 4px',
            fontSize: "1rem"
        },
    }))

    const [open, setOpen] = useState(false)

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen)
    }

    const [anchorEl, setAnchorEl] = useState(null)
    const openMenu = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const navigate = useNavigate()

    const goTo = (url) => {
        navigate(`/${url}`)
    }

    const [subtotal, setSubtotal] = useState(0)

    useEffect(() => {
        setSubtotal(cart.reduce((sum, item) => {
            const price = item.product.discountedPrice ?? item.product.price
            return sum + price * item.quantity
        }, 0).toFixed(2))
    }, [cart])

    const shippingCost = subtotal === 0 ? 0 : 3.00
    const total = (parseFloat(subtotal) + shippingCost).toFixed(2)

    const logout = async () => {
        LogoutFunc(appURI, setIsAuthenticated, setIsError, setIsSuccess, navigate)
    }

    return (
        <header>
            <div className="top-strip bg-white">
                <div className="wrapper">
                    <div className="flex justify-between items-center text-[#666] text-[1.3rem] font-medium py-6">
                        <p>Get up to 50% off new season styles, limited time only</p>
                        <ul className='flex gap-8'>
                            <li>
                                <a href="#footer" className='flex gap-1 items-center primary-hov'>
                                    <MdOutlineHelpOutline className="text-[1.4rem]" />
                                    <p>Help Center</p>
                                </a>
                            </li>
                            <li>
                                <Link to="/orders" className='flex gap-1 items-center primary-hov'>
                                    <LiaShippingFastSolid className="text-[1.4rem]" />
                                    <p>Order Tracking</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="header border-b border-t border-gray-200 border-solid py-6 bg-white">
                <div className="wrapper">
                    <div className="header-con grid justify-between">
                        <div className="logo">
                            <Link to={"/"} className='w-max block'>
                                <img src="/img/logo.png" alt="" className='w-96' />
                            </Link>
                        </div>
                        <SearchBar />
                        <div className="menu-opt flex justify-end items-center gap-16 text-[#3e3e3e] font-medium transition ">
                            {
                                isAuthenticated ?
                                    <div className="acountMenu">
                                        <Button
                                            id="basic-button"
                                            aria-controls={openMenu ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={openMenu ? 'true' : undefined}
                                            onClick={handleClick}
                                            className='!text-[#3e3e3e] !leading-none'>
                                            <div className="flex items-center gap-3">
                                                <span className='rounded-full w-[3.4rem] h-[3.4rem]'>
                                                    <img src={userData.avatar} alt="" className='w-full h-full' />
                                                </span>
                                                <div className="userInfo flex flex-col items-start justify-center gap-1.5">
                                                    <h3 className='text-[1.3rem] font-[600] capitalize'>{userData.name}</h3>
                                                    <p className='text-[1.2rem] font-medium !lowercase'>{userData.email}</p>
                                                </div>
                                            </div>
                                        </Button>

                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={openMenu}
                                            onClose={handleClose}
                                        >
                                            <MenuItem
                                                onClick={() => {
                                                    handleClose()
                                                    goTo('profile')
                                                }}
                                                className='!py-3 !pr-32 !gap-3.5 !text-[1.5rem]'>
                                                <FaRegAddressCard className='text-[2.2rem]' />
                                                <span>Profile</span>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    handleClose()
                                                    goTo('address')
                                                }}
                                                className='!py-3 !pr-32 !gap-3.5 !text-[1.5rem]'>
                                                <MdMyLocation className='text-[2.2rem]' />
                                                <span>Address</span>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    handleClose()
                                                    goTo('wishlist')
                                                }}
                                                className='!py-3 !pr-32 !gap-3.5 !text-[1.5rem]'>
                                                <FaRegHeart className='text-[2.2rem]' />
                                                <span>Wishlist</span>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    handleClose()
                                                    goTo('orders')
                                                }}
                                                className='!py-3 !pr-32 !gap-3.5 !text-[1.5rem]'>
                                                <FiShoppingBag className='text-[2.2rem]' />
                                                <span>Orders</span>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    handleClose()
                                                    logout()
                                                }}
                                                className='!py-3 !pr-32 !gap-3.5 !text-[1.5rem]'>
                                                <MdLogout className='text-[2.2rem]' />
                                                <span>Logout</span>
                                            </MenuItem>

                                        </Menu>
                                    </div>
                                    :
                                    <ul className='flex items-center gap-4 text-[1.5rem]'>
                                        <li>
                                            <Link to={"/login"} className='primary-hov'>Login</Link>
                                        </li>
                                        <span className='font-normal'>|</span>
                                        <li>
                                            <Link to={"/register"} className='primary-hov'>Register</Link>
                                        </li>
                                    </ul>
                            }
                            <ul className='flex items-center gap-6'>
                                <li>
                                    <Link to={"/wishlist"}>
                                        <Tooltip title="WishList">
                                            <IconButton>
                                                <StyledBadge badgeContent={list.length} color="primary">
                                                    <IoMdHeartEmpty className='text-[2.4rem]' />
                                                </StyledBadge>
                                            </IconButton>
                                        </Tooltip>
                                    </Link>
                                </li>
                                <li>
                                    <Tooltip title={"Cart"}>
                                        <IconButton onClick={toggleDrawer(true)}>
                                            <StyledBadge badgeContent={cart.length} color="primary">
                                                <HiOutlineShoppingCart className='text-[2.4rem]' />
                                            </StyledBadge>
                                        </IconButton>
                                    </Tooltip>

                                    <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
                                        <div className='cartPanel w-[550px] text-[#3e3e3e] h-[100vh] grid grid-rows-[max-content_1fr_max-content]'>
                                            <div className="cartPanelHead flex justify-between  items-center py-4 px-8">
                                                <h2 className="text-[2rem] font-[600]">Shopping Cart {cart.length ? `(${cart.length})` : ''}</h2>
                                                <Button className='!rounded-full !min-w-auto !p-3 !text-[#3e3e3e]' onClick={toggleDrawer(false)}>
                                                    <IoClose className='text-[2.2rem]' />
                                                </Button>
                                            </div>
                                            {!isCartLoading && cart.length === 0 ?
                                                <div className="emaptyCart items-center flex flex-col">
                                                    <img src="/img/empty-cartPanel.png" alt="cart is empty" className='w-[65%]' />
                                                    <h2 className='mt-4 text-[3rem] font-bold text-[#666]'>Oops!</h2>
                                                    <p className='mt-1 mb-3 text-[1.5rem] font-medium text-[#787878]'>The cart seems a little lonely</p>
                                                    <Button
                                                        className='!min-w-auto !rounded-xl !w-max !py-3 !px-4 !text-white !bg-[#ff5252] !cursor-pointer'
                                                        onClick={() => goTo('products')}>
                                                        <p className='text-[1.5rem] font-medium h-max !capitalize'>Go Shopping</p>
                                                    </Button>
                                                </div>
                                                :
                                                <>
                                                    <div className="cartPanelItems overflow-y-scroll overflow-x-hidden scrollable">
                                                        {cart.map(cartItem => {
                                                            return (
                                                                <CartPanelItem
                                                                    cartProduct={cartItem.product}
                                                                    cartId={cartItem._id}
                                                                    setCart={setCart}
                                                                    qty={cartItem.quantity}
                                                                    toggleDrawer={toggleDrawer}
                                                                    key={cartItem._id} />
                                                            )
                                                        })}
                                                    </div>

                                                    <div className="cartPanelTotal">
                                                        <div className="flex justify-between items-center border-b border-[rgba(0,0,0,0.2)] px-8 py-5">
                                                            <h3 className="text-[1.7rem] font-[600]">Total Items</h3>
                                                            <span className='text-[1.7rem] font-[600]'>{cart.length} Items</span>
                                                        </div>
                                                        <div className="flex justify-between items-center border-b border-[rgba(0,0,0,0.2)] px-8 py-5">
                                                            <h3 className="text-[1.7rem] font-[600]">Sub Total</h3>
                                                            <span className='text-[1.7rem] primary-color font-[600]'>${subtotal}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center border-b border-[rgba(0,0,0,0.2)] px-8 py-5">
                                                            <h3 className="text-[1.7rem] font-[600]">Shipping</h3>
                                                            <span className='text-[1.7rem] primary-color font-[600]'>${shippingCost}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center px-8 py-5">
                                                            <h3 className="text-[1.7rem] font-[600]">Total</h3>
                                                            <span className='text-[1.7rem] primary-color font-[600]'>${total}</span>
                                                        </div>
                                                        <div className="flex gap-3 items-center px-16 pb-8">
                                                            <Button className="!border !border-[#ff5252] !rounded-xl !w-full !min-w-auto !px-8 !text-center !py-3 !text-white !bg-[#ff5252] !cursor-pointer !mt-2 !flex !justify-center !items-center !gap-3"
                                                                onClick={() => {
                                                                    toggleDrawer(false)()
                                                                    goTo('cart')
                                                                }}>
                                                                <HiOutlineShoppingCart className="text-[2.4rem]" />
                                                                <p className="text-[1.5rem] font-medium h-max">View Cart</p>
                                                            </Button>

                                                            <Button className="!border !border-[#ff5252] !rounded-xl !w-full !min-w-auto !px-8 !text-center !text-[#ff5252] !py-3 !cursor-pointer !mt-2 !flex !justify-center !items-center !gap-3"
                                                                onClick={() => {
                                                                    toggleDrawer(false)()
                                                                    navigate('/checkout', { state: { allowAccess: true } })
                                                                }}>
                                                                <IoBagCheckOutline className="text-[2.4rem]" />
                                                                <p className="text-[1.5rem] font-medium h-max">Checkout</p>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </Drawer>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div >
            <Navigation />
        </header >
    )
}

export default Header