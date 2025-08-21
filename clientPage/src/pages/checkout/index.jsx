import { useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, FormControlLabel, Radio, RadioGroup, Skeleton } from '@mui/material'
import AddressDrawer from '../../components/addressDrawer'
import AddressCard from '../../components/addressCard'
import OrderedItem from '../../components/orderedItem'
import { useLocation, Navigate } from 'react-router-dom'

import { SiRazorpay, SiPaypal } from "react-icons/si"
import { IoBagCheckOutline } from 'react-icons/io5'
import { context } from '../../App'
import UploadData from '../../helpers/uploadDataFunc'

const Checkout = () => {

    const { setIsError, setIsSuccess, appURI, addresses, setAddresses, isAddressLoading, cart, setCart, isCartLoading, setIsOrdered, setOrder } = useContext(context)

    const {
        register,
        handleSubmit,
        reset,
        control
    } = useForm()

    const location = useLocation()

    if (!location.state?.allowAccess || (!isCartLoading && cart.length === 0)) {
        return <Navigate to="/" replace />
    }

    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (data) => {
        if (!data) return

        const payload = {
            addressLine: data.addressLine,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            landmark: data.landmark,
            phone: data.phone,
            addressOf: data.addressOf
        }

        const success = await UploadData(
            setAddresses,
            setIsSubmitting,
            setIsError,
            setIsSuccess,
            appURI,
            'address',
            payload,
            reset
        )

        if (success) {
            toggleDrawer(false)
        }
    }

    const onError = (errors) => {
        const firstError = Object.values(errors)[0]
        if (firstError) {
            setIsError(firstError.message)
        }
    }

    const [openDrawer, setOpenDrawer] = useState(false)

    const toggleDrawer = (newOpen) => {
        setOpenDrawer(newOpen)
    }

    const [selectedAddressId, setSelectedAddressId] = useState("")

    useEffect(() => {
        if (!isAddressLoading && addresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(addresses[0]._id)
        }
    }, [addresses, selectedAddressId, isAddressLoading])

    const subtotal = cart.reduce((acc, item) => acc + (item.product.discountedPrice * item.quantity), 0)
    const shippingCost = subtotal === 0 ? 0 : 3.00
    const total = subtotal + shippingCost

    const [isSubmittingCOD, setIsSubmittingCOD] = useState(false)

    const handleCOD = async () => {
        setIsSubmittingCOD(true)
        const items = cart.map(cartItem => ({ product: cartItem.product._id, quantity: cartItem.quantity }))
        fetch(`${appURI}/order/place`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items,
                address: selectedAddressId
            }),
            credentials: 'include'
        }).then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setCart([])
                    setIsSuccess(resData.message)
                    setOrder(resData.data)
                    setIsOrdered(true)
                } else {
                    setIsError(resData.message)
                }
            })
            .catch(error => setIsError('Something went wrong!'))
            .finally(() => setIsSubmittingCOD(false))
    }

    return (
        <section className="checkout py-10 bg-[rgba(0,0,0,0.05)]">
            <div className="wrapper">
                <div className="checkoutContainer text-[#3e3e3e] grid grid-cols-[53%_45%] justify-between w-[80%] mx-auto">
                    <div className="deliveryAddressBox bg-white p-10 rounded-xl h-max">
                        <div className="deliveryAddressHead flex justify-between items-center mb-10">
                            <h2 className='text-[2rem] font-[600]'>Select Delivery Address</h2>
                            <Button
                                className='!min-w-auto !px-5 !py-3 primary-color !text-[1.5rem] !capitalize !leading-none !border !border-[#ff5252]'
                                onClick={() => toggleDrawer(true)}>
                                Add New Address
                            </Button>
                            <AddressDrawer
                                toggleDrawer={toggleDrawer}
                                openDrawer={openDrawer}
                                onSubmit={onSubmit}
                                onError={onError}
                                handleSubmit={handleSubmit}
                                register={register}
                                isSubmitting={isSubmitting}
                                control={control}
                            />
                        </div>
                        {!isAddressLoading && addresses.length === 0 ?
                            <div className="emaptyAddress items-center flex flex-col">
                                <img src="/img/empty-address.png" alt="no address found" className='w-[50rem]' />
                            </div>
                            :
                            <div className="deliveryAddress">
                                <RadioGroup
                                    value={selectedAddressId}
                                    onChange={(e) => setSelectedAddressId(e.target.value)}
                                    sx={{ width: '100%' }}
                                >
                                    {isAddressLoading ?
                                        <div className="address border border-dashed border-[rgba(0,0,0,0.2)] py-4 px-6 rounded-lg flex justify-between items-center mt-5">
                                            <div className="addressText w-full">
                                                <div className="mb-2">
                                                    <Skeleton variant="rectangular" width={80} height={24} />
                                                </div>
                                                <div className="flex gap-3 items-center mb-2">
                                                    <Skeleton variant="text" width={100} height={20} />
                                                    <Skeleton variant="text" width={120} height={20} />
                                                </div>
                                                <div>
                                                    <Skeleton variant="text" width="70%" height={18} />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <Skeleton variant="rectangular" width={24} height={24} sx={{ borderRadius: '4px' }} />
                                            </div>
                                        </div>
                                        :
                                        addresses.map(address => {
                                            return (
                                                <FormControlLabel
                                                    value={address._id}
                                                    control={<Radio size='large' />}
                                                    label={
                                                        <AddressCard
                                                            menu={false}
                                                            address={address}
                                                            setData={setAddresses}
                                                        />}
                                                    key={address._id}
                                                />
                                            )
                                        })}
                                </RadioGroup>
                            </div>
                        }
                    </div>
                    <div className="checkoutBox bg-white py-10 rounded-xl grid grid-rows-[max-content_minmax(max-content_40vh)_max-content_max-content] gap-3">
                        <h2 className='text-[2rem] font-[600] pb-6 px-10'>Checkout</h2>
                        <div className="orderedItems scrollable overflow-y-scroll overflow-x-hidden">
                            {!isCartLoading &&
                                cart.map(cartItem => (
                                    <div className='border-t border-[rgba(0,0,0,0.2)] flex gap-4 items-center justify-between px-10' key={cartItem._id}>
                                        <div>
                                            <OrderedItem
                                                id={cartItem.product._id}
                                                src={cartItem.product.mediaImgUrls[0]}
                                                title={cartItem.product.title}
                                                qty={cartItem.quantity}
                                                price={cartItem.product.price}
                                                discountedPrice={cartItem.product.discountedPrice}
                                            />
                                        </div>
                                        <div className='text-[#333]'>
                                            <p className='font-medium text-[1.3rem]'>SubTotal:</p>
                                            <span className='font-[550] text-[1.5rem]'>${(cartItem.product.discountedPrice * cartItem.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="total bg-white w-full rounded-2xl text-[#3e3e3e] h-max px-10">
                            <div className="flex justify-between items-center border-b border-[rgba(0,0,0,0.2)] py-8">
                                <h3 className="text-[1.7rem] font-[600]">Sub Total</h3>
                                <span className='text-[1.7rem] primary-color font-[600]'>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[rgba(0,0,0,0.2)] py-8">
                                <h3 className="text-[1.7rem] font-[600]">Shipping</h3>
                                <span className='text-[1.7rem] primary-color font-[600]'>${shippingCost}</span>
                            </div>
                            <div className="flex justify-between items-center py-8">
                                <h3 className="text-[1.7rem] font-[600]">Total</h3>
                                <span className='text-[1.7rem] primary-color font-[600]'>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="paymentMethod px-10">
                            {/* <Button
                                disabled={isSubmittingCOD}
                                className="!flex !justify-center !items-center !w-full !text-white !capitalize !py-5 !gap-4 !cursor-pointer !rounded-md 
                                !shadow-[0_0_3px_rgba(0,0,0,0.084),0_2px_3px_rgba(0,0,0,0.168)] !p-0 !min-w-auto !bg-[#0B5FFF] !leading-none !mb-5 disabled:opacity-60 disabled:select-none"
                                type='submit'
                                onClick={handleRazorPay}
                            >
                                <SiRazorpay className='text-[2.5rem] text-white' />
                                <span className='text-[1.5rem] font-[600]'>RazorPay</span>
                            </Button>
                            <Button
                                disabled={isSubmittingCOD}
                                className="!flex !justify-center !items-center !w-full !text-white !capitalize !py-5 !gap-4 !cursor-pointer !rounded-md 
                                !shadow-[0_0_3px_rgba(0,0,0,0.084),0_2px_3px_rgba(0,0,0,0.168)] !p-0 !min-w-auto !bg-[#FFC439] !leading-none !mb-5 disabled:opacity-60 disabled:select-none"
                                type='submit'
                                onClick={handlePayPal}
                            >
                                <SiPaypal className='text-[2.5rem] text-[white]' />
                                <span className='text-[1.5rem] font-[600]'>PayPal</span>
                            </Button> */}
                            <Button
                                disabled={isSubmittingCOD}
                                className="!flex !justify-center !items-center !w-full !text-white !capitalize !py-5 !gap-4 !cursor-pointer !rounded-md 
                                !shadow-[0_0_3px_rgba(0,0,0,0.084),0_2px_3px_rgba(0,0,0,0.168)] !p-0 !min-w-auto !bg-[#ff5252] !leading-none disabled:opacity-60 disabled:select-none"
                                type='submit'
                                onClick={handleCOD}
                            >
                                <IoBagCheckOutline className='text-[2.5rem] text-white' />
                                <span className='text-[1.5rem] font-[600]'>Cash on Delivery</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Checkout
