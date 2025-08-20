import { useEffect, useContext, useState } from 'react'
import QtyBox from '../qtyBox'
import { AiOutlineDelete } from "react-icons/ai"
import { Button, CircularProgress, Tooltip } from '@mui/material'
import { Link } from 'react-router-dom'

import { IoChevronDownSharp } from "react-icons/io5"
import DeleteSingleData from '../../helpers/deleteSingleData'
import { context } from '../../App'

const CartProduct = ({ cartId, cartProduct, qty, subs }) => {

    const { setCart, setIsError, setIsSuccess, appURI } = useContext(context)
    const [quantity, setQuantity] = useState(qty)

    const unitPrice = cartProduct.discountedPrice
    const [subTotal, setSubTotal] = useState(unitPrice)

    useEffect(() => {
        setSubTotal((unitPrice * quantity).toFixed(2))
    }, [quantity])

    const handleQuantity = async (newQty) => {
        const numericQty = parseInt(newQty)
        if (!numericQty || numericQty < 1) return setQuantity(1)

        try {
            const response = await fetch(`${appURI}/cart/quantity/${cartId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: numericQty }),
                credentials: 'include'
            })

            const resData = await response.json()

            if (resData.success) {
                setCart(resData.data)
            } else {
                setIsError(resData.message)
            }
        } catch (error) {
            setIsError(error.message || 'Something went wrong!')
        }
    }

    useEffect(() => {
        subs(prevSubs => {
            const existing = prevSubs.filter(p => p._id !== cartProduct._id)
            return [...existing, { _id: cartProduct._id, subTotal }]
        })
    }, [subTotal])

    const [isDeleting, setIsDeleting] = useState(false)
    const handleRemove = async () => {
        const removeItem = await DeleteSingleData(setCart, setIsDeleting, setIsError, setIsSuccess, appURI, 'cart', cartId)
        if (removeItem) subs(prevSubs => prevSubs.filter(p => p._id !== cartProduct._id))
    }

    return (
        <tr className="cartProduct border-t border-[rgba(0,0,0,0.2)]">
            <td className="cartProductDetailing py-8 px-6 max-w-[50%] w-full">
                <div className='grid grid-cols-[max-content_1fr] items-center gap-6 content-start'>
                    <div className="cartProductThumbnail w-[8rem] h-[8.5rem] rounded-md overflow-hidden">
                        <Link to={`/productdetails/${cartProduct._id}`}>
                            <img
                                src={cartProduct?.mediaImgUrls[0]}
                                alt={cartProduct.title}
                                className='w-full h-full object-cover object-top-left hover:scale-120 transition-all duration-300 origin-top' />
                        </Link>
                    </div>
                    <div className="cartProductOpts">
                        <Link to={`/productdetails/${cartProduct._id}`}>
                            <p className="productBrand text-[1.2rem] primary-hov truncate font-medium capitalize">{cartProduct.brandName}</p>
                        </Link>
                        <Link to={`/productdetails/${cartProduct._id}`}>
                            <p className='text-[1.5rem] primary-hov font-medium w-[100%] line-clamp-1 capitalize'>{cartProduct.title}</p>
                        </Link>
                        <div className="itemSpecification flex gap-2 mt-2">
                            <div className="py-1 px-2 rounded-md bg-[#dcdcdc] flex w-max gap-1 items-center text-black cursor-pointer">
                                <span className='text-[1.2rem] font-medium'>Size: Sml</span>
                                <IoChevronDownSharp className='text-[1.2rem]' />
                            </div>
                            <div className="py-1 px-2 rounded-md bg-[#dcdcdc] flex w-max gap-1 items-center text-black cursor-pointer">
                                <span className='text-[1.2rem] font-medium'>Color: Gray</span>
                                <IoChevronDownSharp className='text-[1.2rem]' />
                            </div>
                        </div>
                    </div>
                </div>
            </td>
            <td className="cartProductPrice py-8 px-6">
                <span className='text-[1.7rem] primary-color font-medium'>${unitPrice}</span>
            </td>
            <td className="cartProductQty py-8 px-6">
                {/* <QtyBox inputValue={quantity} setInputValue={setQuantity} onChange={handleQuantity} /> */}
                <QtyBox
                    inputValue={quantity}
                    setInputValue={setQuantity}
                    onChange={handleQuantity}
                />
            </td>
            <td className="cartProductSubTotal py-8 px-6">
                <span className='text-[1.7rem] primary-color font-medium'>${subTotal}</span>
            </td>
            <td className="cartProductAction">
                {isDeleting ?
                    <CircularProgress
                        size={20}
                        thickness={3}
                        sx={{ color: '#333' }}
                    />
                    :
                    <Tooltip title='Remove Item'>
                        <Button className='!rounded-full !text-[#3e3e3e] !min-w-auto !p-3 disabled:opacity-60 disabled:select-none' onClick={handleRemove} disabled={isDeleting}>
                            <AiOutlineDelete className='text-[2rem]' />
                        </Button>
                    </Tooltip>
                }
            </td>
        </tr>
    )
}

export default CartProduct
