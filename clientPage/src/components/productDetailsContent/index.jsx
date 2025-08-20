import { useEffect, useState, useContext } from 'react'
import { Rating, Skeleton, ToggleButton, ToggleButtonGroup, Button } from '@mui/material'

import { CgHeart } from "react-icons/cg"
import { HiHeart } from "react-icons/hi"
import { VscGitCompare } from "react-icons/vsc"
import QtyBox from '../qtyBox'
import UploadData from '../../helpers/uploadDataFunc'
import { context } from '../../App'
import GetData from '../../helpers/getData'

const ProductDetailsContent = ({ id, brandName, title, desc, rating, price, discountedPrice, totalReviews, stock, isProductLoading }) => {

    const { appURI, setIsError, setIsSuccess, cart, setCart, list, setList, setIsListLoading } = useContext(context)
    const [quantity, setQuantity] = useState(1)

    const [size, setSize] = useState(null)

    const handleSizeChange = (event, newSize) => {
        if (newSize !== null) {
            setSize(newSize)
        }
    }

    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [isAddingToList, setIsAddingToList] = useState(false)

    const [isAddedToCart, setIsAddedToCart] = useState(false)
    const [isAddedToList, setIsAddedToList] = useState(false)

    useEffect(() => {
        const cartIds = cart.map(item => item.product._id)
        setIsAddedToCart(cartIds.includes(id))
    }, [cart, id])

    useEffect(() => {
        const listIds = list.map(item => item.product._id)
        setIsAddedToList(listIds.includes(id))
    }, [list, id])

    const getList = async () => {
        const listRes = await GetData(appURI, setIsListLoading, 'wishlist')
        if (listRes.data) setList(listRes.data)
        else if (listRes.error) setIsError(listRes.error)
    }

    const addToCart = async () => {
        if (isAddedToCart) return
        const payload = { productId: id, quantity }
        const isAdded = await UploadData(setCart, setIsAddingToCart, setIsError, setIsSuccess, appURI, 'cart', payload, () => { })
        if (isAdded) getList()
    }

    const addToList = () => {
        if (isAddedToList) return
        const payload = { productId: id }
        UploadData(setList, setIsAddingToList, setIsError, setIsSuccess, appURI, 'wishlist', payload, () => { })
    }


    return (
        <>
            {isProductLoading ?
                <div className="productDetailsContent text-[#3e3e3e] pl-20 flex flex-col justify-center gap-4">
                    <Skeleton variant="text" width="60%" height={40} />

                    <div className="flex items-center gap-20">
                        <Skeleton variant="text" width="20%" height={30} />
                        <Skeleton variant="text" width="20%" height={30} />
                    </div>

                    <div className="flex items-center gap-20">
                        <Skeleton variant="text" width="25%" height={35} />
                        <Skeleton variant="text" width="20%" height={30} />
                    </div>

                    <div className="productDesc">
                        <Skeleton variant="text" width="100%" height={20} />
                        <Skeleton variant="text" width="100%" height={20} />
                        <Skeleton variant="text" width="90%" height={20} />
                    </div>

                    <div className="size flex items-center gap-4 my-2">
                        <Skeleton variant="text" width={70} height={30} />
                        <div className="flex gap-3">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} variant="rectangular" width={45} height={36} sx={{ borderRadius: '6px' }} />
                            ))}
                        </div>
                    </div>

                    <Skeleton variant="text" width="30%" height={25} />

                    <div className="actionBtns flex gap-5 mb-10">
                        <Skeleton variant="rectangular" width={100} height={50} sx={{ borderRadius: '8px' }} />
                        <Skeleton variant="rectangular" width={140} height={50} sx={{ borderRadius: '8px' }} />
                        <Skeleton variant="rectangular" width={140} height={50} sx={{ borderRadius: '8px' }} />
                    </div>

                    <div className="otherOpts flex gap-8">
                        <Skeleton variant="text" width={140} height={30} />
                        <Skeleton variant="text" width={140} height={30} />
                    </div>
                </div>
                :
                <div className="productDetailsContent text-[#3e3e3e] pl-20 flex flex-col justify-center gap-4">
                    <h2 className='productName text-[2rem] font-[600] capitalize'>{title}</h2>
                    <div className="flex items-center gap-20">
                        <div className="brand text-[1.3rem] font-medium flex items-center gap-2">
                            <span className='text-[#777]'>Brand:</span>
                            <span className=' text-[1.4rem] capitalize'>{brandName}</span>
                        </div>
                        <div className="rating flex items-center gap-3">
                            <Rating name="read-only size-large half-rating" value={rating} precision={0.5} size='large' readOnly />
                            <p className='text-[#777] text-[1.3rem] font-medium'>{totalReviews} Reviews</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-20">
                        <ul className="productPrice flex gap-8 text-[2.2rem] font-[600]">
                            <li className="oldPrice line-through opacity-70">${price}</li>
                            <li className="newPrice primary-color">${discountedPrice}</li>
                        </ul>
                        <div className="availability text-[1.4rem]">
                            <span className='text-[#777] font-medium'>In Stock: </span>
                            <span className='text-green-600 font-bold'>{stock} items</span>
                        </div>
                    </div>
                    <p className='productDesc text-[#777] text-[1.45rem] font-[500] leading-10' dangerouslySetInnerHTML={{ __html: desc }}></p>
                    <div className="size flex items-center gap-4 my-2">
                        <h3 className='text-[1.8rem] font-[600]'>Size:</h3>
                        <ToggleButtonGroup value={size} exclusive onChange={handleSizeChange} aria-label="size" className="gap-3" >
                            <ToggleButton value="S" className="!py-3 !px-5 !leading-none !rounded-md !font-medium !text-[1.3rem] !min-w-auto">
                                S
                            </ToggleButton>
                            <ToggleButton value="M" className="!py-3 !px-5 !leading-none !rounded-md !font-medium !text-[1.3rem] !min-w-auto">
                                M
                            </ToggleButton>
                            <ToggleButton value="L" className="!py-3 !px-5 !leading-none !rounded-md !font-medium !text-[1.3rem] !min-w-auto">
                                L
                            </ToggleButton>
                            <ToggleButton value="XL" className="!py-3 !px-5 !leading-none !rounded-md !font-medium !text-[1.3rem] !min-w-auto">
                                XL
                            </ToggleButton>
                            <ToggleButton value="XXL" className="!py-3 !px-5 !leading-none !rounded-md !font-medium !text-[1.3rem] !min-w-auto">
                                XXL
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    <p className='deliveryTime text-[1.5rem] font-medium mb-4'>Free Shipping ( Est. Delivery Time {2}-{3} Days )</p>
                    <div className="actionBtns flex gap-5 mb-10">
                        <QtyBox inputValue={quantity} setInputValue={setQuantity} />
                        <Button
                            disabled={isAddingToCart || isAddingToList}
                            className={`
                                !bg-[#FF5252] !text-white !py-5 !px-8 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize disabled:opacity-60 disabled:select-none
                                ${isAddedToCart && '!text-white !bg-[#ff5252]'}
                                `}
                            onClick={addToCart}>
                            <p className='text-[1.5rem] font-medium h-max'>{isAddedToCart ? 'Added To Cart' : 'Add To Cart'}</p>
                        </Button>
                    </div>
                    <div className="otherOpts flex gap-8">
                        <button
                            type='button'
                            className={`flex items-center gap-1 primary-hov text-[1.4rem] font-medium cursor-pointer ${isAddedToList && 'primary-color'}`}
                            disabled={isAddingToList || isAddingToCart}
                            onClick={addToList}
                        >
                            {isAddedToList ?
                                <HiHeart className={`text-[2.1rem] primary-color`} />
                                :
                                <CgHeart className={`text-[2.1rem] transition-colors duration-300`} />
                            }
                            <span>{isAddedToList ? "Added to Wishlist" : "Add to Wishlist"}</span>
                        </button>
                        <button type='button' className='flex items-center gap-1 primary-hov text-[1.4rem] font-medium cursor-pointer'>
                            <VscGitCompare className='text-[2rem] transition-colors duration-300' />
                            <span>Add To Compare</span>
                        </button>
                    </div>
                </div>}
        </>
    )
}

export default ProductDetailsContent
