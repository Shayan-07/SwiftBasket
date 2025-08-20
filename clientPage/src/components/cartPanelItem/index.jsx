import { useState, useContext } from 'react'
import { Button, Tooltip, CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom'

import { AiOutlineDelete } from 'react-icons/ai'
import { IoChevronDownSharp } from 'react-icons/io5'
import DeleteSingleData from '../../helpers/deleteSingleData'
import { context } from '../../App'

const CartPanelItem = ({ toggleDrawer, cartProduct, cartId, setCart, qty }) => {

  const {setIsError, setIsSuccess, appURI} = useContext(context)

  const [isDeleting, setIsDeleting] = useState(false)
  const handleRemove = async () => {
    await DeleteSingleData(setCart, setIsDeleting, setIsError, setIsSuccess, appURI, 'cart', cartId)
  }

  return (
    <div className="cartPanelItem flex items-center justify-between gap-2 px-8 py-6 border-t border-[rgba(0,0,0,0.2)]">
      <div className='grid grid-cols-[max-content_1fr] items-center gap-6'>
        <div className="cartProductThumbnail w-[8rem] h-[8.5rem] rounded-md overflow-hidden">
          <Link to={`/productdetails/${cartProduct._id}`} onClick={toggleDrawer(false)}>
            <img src={cartProduct.mediaImgUrls[0]} alt="" className='w-full h-full object-cover object-top-left hover:scale-120 transition-all duration-300 origin-top' />
          </Link>
        </div>
        <div className="cartProductOpts">
          <Link to={`/productdetails/${cartProduct._id}`} onClick={toggleDrawer(false)}>
            <p className='text-[1.5rem] primary-hov font-medium w-[100%] line-clamp-1 capitalize'>{cartProduct.title}</p>
          </Link>
          <div className="itemSpecification flex gap-2 mt-2 mb-1.5">
            <div className="py-1 px-2 rounded-md bg-[#dcdcdc] flex w-max gap-1 items-center cursor-pointer">
              <span className='text-[1.2rem] font-medium'>Qty: {qty}</span>
              <IoChevronDownSharp className='text-[1.2rem]' />
            </div>
            <div className="py-1 px-2 rounded-md bg-[#dcdcdc] flex w-max gap-1 items-center cursor-pointer">
              <span className='text-[1.2rem] font-medium'>Size: Sml</span>
              <IoChevronDownSharp className='text-[1.2rem]' />
            </div>
            <div className="py-1 px-2 rounded-md bg-[#dcdcdc] flex w-max gap-1 items-center cursor-pointer">
              <span className='text-[1.2rem] font-medium'>Color: Gray</span>
              <IoChevronDownSharp className='text-[1.2rem]' />
            </div>
          </div>
          <div className="productPrice w-max flex gap-8 text-[1.6rem] font-[600]">
            <span className="oldPrice line-through opacity-70 text-[1.7rem] font-[600]">${cartProduct.price}</span>
            <span className='price text-[1.7rem] primary-color font-[600]'>${cartProduct.discountedPrice}</span>
          </div>
        </div>
      </div>
      <div className='productRemove'>
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
      </div>
    </div>
  )
}

export default CartPanelItem
