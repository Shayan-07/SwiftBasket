import { useContext, useState } from 'react'
import CartProduct from '../../components/cartProduct'
import { Button, Skeleton } from '@mui/material'

import { IoBagCheckOutline } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import { context } from '../../App'

const Cart = () => {

    const { cart, isCartLoading } = useContext(context)
    const [allSubs, setAllSubs] = useState([])

    const navigate = useNavigate()

    const subtotal = allSubs.reduce((acc, item) => acc + Number(item.subTotal), 0)
    const shippingCost = subtotal === 0 ? 0 : 3.00
    const total = subtotal + shippingCost

    return (
        <section className="cart py-16 bg-[rgba(0,0,0,0.05)]">
            <div className="wrapper">
                {!isCartLoading && cart.length === 0 ?
                    <div className="emaptyCart items-center flex flex-col">
                        <img src="/img/empty_cart.png" alt="cart is empty" className='w-[50rem]' />
                        <h2 className='mt-5 text-[3.5rem] font-bold text-[#666]'>Oops!</h2>
                        <p className='mt-1 mb-3 text-[1.75rem] font-medium text-[#787878]'>Looks like your Cart is Empty? — Let's fix that</p>
                        <Button className='!min-w-auto !rounded-xl !w-max !py-3 !px-4 !text-white !bg-[#ff5252] !cursor-pointer' onClick={() => navigate('/products')}>
                            <p className='text-[1.4rem] font-medium h-max !capitalize'>Lets Go Shopping</p>
                        </Button>
                    </div>
                    :
                    <div className="cartContainer grid grid-cols-[65%_31%] justify-between">
                        <table className="cartProductsForm text-[#3e3e3e] h-max">
                            <thead className='cartProductHead'>
                                <tr>
                                    <th className='text-start'>
                                        <h2 className='text-[2rem] font-[600] p-6'>Product</h2>
                                    </th>
                                    <th className='text-start'>
                                        <h2 className='text-[2rem] font-[600] p-6'>Price</h2>
                                    </th>
                                    <th className='text-start'>
                                        <h2 className='text-[2rem] font-[600] p-6'>Quantity</h2>
                                    </th>
                                    <th className='text-start'>
                                        <h2 className='text-[2rem] font-[600] p-6'>Sub Total</h2>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isCartLoading ?
                                    Array(4).fill(0).map((_, i) => {
                                        return (
                                            <tr className="cartProduct border-t border-[rgba(0,0,0,0.2)]" key={i}>
                                                <td className="cartProductDetailing py-8 px-6 max-w-[50%] w-full">
                                                    <div className="grid grid-cols-[max-content_1fr] items-center gap-6">
                                                        <div className="cartProductThumbnail w-[8rem] h-[8.5rem] rounded-md overflow-hidden">
                                                            <Skeleton variant="rectangular" width={80} height={85} />
                                                        </div>
                                                        <div className="cartProductOpts flex flex-col gap-2 w-full">
                                                            <Skeleton variant="text" width={100} height={20} />
                                                            <Skeleton variant="text" width={160} height={24} />
                                                            <div className="itemSpecification flex gap-2 mt-2">
                                                                <Skeleton variant="rectangular" width={70} height={24} />
                                                                <Skeleton variant="rectangular" width={70} height={24} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="cartProductPrice py-8 px-6">
                                                    <Skeleton variant="text" width={60} height={24} />
                                                </td>

                                                <td className="cartProductQty py-8 px-6">
                                                    <Skeleton variant="rectangular" width={80} height={40} />
                                                </td>

                                                <td className="cartProductSubTotal py-8 px-6">
                                                    <Skeleton variant="text" width={70} height={24} />
                                                </td>

                                                <td className="cartProductAction py-8 px-6">
                                                    <Skeleton variant="circular" width={40} height={40} />
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    cart.map(cartItem => {
                                        return (
                                            <CartProduct cartId={cartItem._id} cartProduct={cartItem.product} qty={cartItem.quantity} key={cartItem._id} subs={setAllSubs} />
                                        )
                                    })}
                            </tbody>
                        </table>

                        <div className="cartTotal bg-white w-full rounded-2xl text-[#3e3e3e] px-10 py-12 h-max mt-20">
                            <h2 className="text-[2.2rem] font-[600] mb-6">Cart Totals</h2>
                            <div className="flex justify-between items-center border-b border-[rgba(0,0,0,0.2)] py-8">
                                <h3 className="text-[1.7rem] font-[600]">Sub Total</h3>
                                <span className='text-[1.7rem] primary-color font-[600]'>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[rgba(0,0,0,0.2)] py-8">
                                <h3 className="text-[1.7rem] font-[600]">Shipping</h3>
                                <span className='text-[1.7rem] primary-color font-[600]'>${shippingCost}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[rgba(0,0,0,0.2)] py-8">
                                <h3 className="text-[1.7rem] font-[600]">Estimated Time</h3>
                                <span className='text-[1.7rem] font-[600]'>{2}-{3} Days</span>
                            </div>
                            <div className="flex justify-between items-center py-8">
                                <h3 className="text-[1.7rem] font-[600]">Total</h3>
                                <span className='text-[1.7rem] primary-color font-[600]'>${total.toFixed(2)}</span>
                            </div>
                            <Button
                                className="!border !border-[#ff5252] !rounded-xl !px-6 !text-center !text-[#ff5252] !py-4 hover:!text-white hover:!bg-[#ff5252] !transition-all !duration-300 !cursor-pointer !mt-2 !flex !justify-center !items-center !gap-3 !leading-none !w-full"
                                onClick={() => navigate('/checkout', { state: { allowAccess: true } })}
                            >
                                <IoBagCheckOutline className='text-[2.4rem]' />
                                <p className='text-[1.5rem] font-medium h-max'>Proceed To Checkout</p>
                            </Button>
                        </div>
                    </div>
                }
            </div>
        </section>
    )
}

export default Cart
