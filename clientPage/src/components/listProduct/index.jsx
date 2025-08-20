import { useContext, useState } from 'react'
import { AiOutlineDelete } from "react-icons/ai"
import { Button, CircularProgress, Tooltip } from '@mui/material'
import { Link } from 'react-router-dom'

import { IoChevronDownSharp } from "react-icons/io5"
import { HiOutlineShoppingCart } from 'react-icons/hi2'
import { context } from '../../App'
import DeleteSingleData from '../../helpers/deleteSingleData'
import UploadData from '../../helpers/uploadDataFunc'

const ListProduct = ({ setList, listProduct, listId, getList }) => {

    const { setCart, setIsError, setIsSuccess, appURI } = useContext(context)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const handleRemove = async () => {
        await DeleteSingleData(setList, setIsDeleting, setIsError, setIsSuccess, appURI, 'wishlist', listId)
    }

    const addToCart = async () => {
        const payload = { productId: listProduct._id }
        const upload = await UploadData(setCart, setIsSubmitting, setIsError, setIsSuccess, appURI, 'cart', payload, () => { })
        if (upload) getList()
    }

    return (
        <tr className="cartProduct border-t border-[rgba(0,0,0,0.2)]">
            <td className="cartProductDetailing py-8 px-6 max-w-[50%] w-full">
                <div className='grid grid-cols-[max-content_1fr] items-center gap-6'>
                    <div className="cartProductThumbnail w-[8rem] h-[8.5rem] rounded-md overflow-hidden">
                        <Link to={`/productdetails/${listProduct._id}`}>
                            <img src={listProduct.mediaImgUrls[0]} alt="" className='w-full h-full object-cover object-top-left hover:scale-120 transition-all duration-300 origin-top' />
                        </Link>
                    </div>
                    <div className="cartProductOpts">
                        <Link to={`/productdetails/${listProduct._id}`}>
                            <p className="productBrand text-[1.2rem] primary-hov truncate font-medium">{listProduct.brandName}</p>
                        </Link>
                        <Link to={`/productdetails/${listProduct._id}`}>
                            <p className='text-[1.5rem] primary-hov font-medium w-[100%] line-clamp-1'>{listProduct.title}</p>
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
                <span className='text-[1.7rem] primary-color font-medium'>${listProduct.price}</span>
            </td>
            <td className="cartProductSubTotal py-8 px-6">
                <span className='text-[1.7rem] primary-color font-medium'>${listProduct.discountedPrice}</span>
            </td>
            <td className="cartProductAction py-8 px-6">
                <div className="flex gap-3 items-center">
                    {isSubmitting ?
                        <CircularProgress
                            size={20}
                            thickness={3}
                            sx={{ color: '#333' }}
                        />
                        :
                        <Tooltip title='Add To Cart'>
                            <Button
                                className='!rounded-full !text-[#3e3e3e] !min-w-auto !p-3 disabled:opacity-60 disabled:select-none'
                                onClick={addToCart}
                                disabled={isSubmitting || isDeleting}>
                                <HiOutlineShoppingCart className='text-[2.2rem]' />
                            </Button>
                        </Tooltip>}

                    {isDeleting ?
                        <CircularProgress
                            size={20}
                            thickness={3}
                            sx={{ color: '#333' }}
                        />
                        :
                        <Tooltip title='Remove Item'>
                            <Button
                                className='!rounded-full !text-[#3e3e3e] !min-w-auto !p-3 disabled:opacity-60 disabled:select-none'
                                onClick={handleRemove}
                                disabled={isDeleting || isSubmitting}>
                                <AiOutlineDelete className='text-[2.2rem]' />
                            </Button>
                        </Tooltip>}
                </div>
            </td>
        </tr>
    )
}

export default ListProduct
