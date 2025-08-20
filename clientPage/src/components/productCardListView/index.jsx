import { useEffect, useState, useContext } from 'react'
import Rating from '@mui/material/Rating';
import { Link } from 'react-router-dom';
import { CgHeart } from "react-icons/cg";
import { CgMaximize } from "react-icons/cg";
import { VscGitCompare } from "react-icons/vsc";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { Button, Tooltip, tooltipClasses } from '@mui/material'
import { context } from '../../App'
import UploadData from '../../helpers/uploadDataFunc'
import GetData from '../../helpers/getData'

const ProductCardListView = ({ product }) => {

  const { setOpenProductModal, setModalProduct, appURI, cart, setCart, list, setList, setIsListLoading, setIsError, setIsSuccess } = useContext(context)
  const [isHover, setIsHover] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToList, setIsAddingToList] = useState(false)

  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isAddedToList, setIsAddedToList] = useState(false)

  useEffect(() => {
    const cartIds = cart.map(item => item.product._id)
    setIsAddedToCart(cartIds.includes(product._id))
  }, [cart, product._id])

  useEffect(() => {
    const listIds = list.map(item => item.product._id)
    setIsAddedToList(listIds.includes(product._id))
  }, [list, product._id])

  const expand = () => {
    setOpenProductModal(true)
    setModalProduct(product)
  }

  const getList = async () => {
    const listRes = await GetData(appURI, setIsListLoading, 'wishlist')
    if (listRes.data) setList(listRes.data)
    else if (listRes.error) setIsError(listRes.error)
  }

  const addToCart = async () => {
    if (isAddedToCart) return
    const payload = { productId: product._id }
    const isAdded = await UploadData(setCart, setIsAddingToCart, setIsError, setIsSuccess, appURI, 'cart', payload, () => { })
    if (isAdded) getList()
  }

  const addToList = () => {
    if (isAddedToList) return
    const payload = { productId: product._id }
    UploadData(setList, setIsAddingToList, setIsError, setIsSuccess, appURI, 'wishlist', payload, () => { })
  }

  return (
    <div
      className='productCardListView productItem overflow-hidden group grid grid-cols-[27.5%_72.5%] grid-rows-1 items-center py-3 w-full'
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="productImg overflow-hidden relative h-[30rem] w-full">
        <Link to={`/productdetails/${product._id}`} >
          <img
            src={product.mediaImgUrls[0]}
            alt={product.title}
            className={`w-full h-full rounded-l-2xl object-cover absolute object-top transition-all duration-500  ${isHover ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
          />
          <img
            src={product.mediaImgUrls[1]}
            alt={product.title}
            className={`w-full h-full rounded-l-2xl object-cover absolute object-top transition-all duration-500  ${isHover ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          />
        </Link>

        <span className="discount primary-bg text-white text-[1.2rem] font-[600] py-1 px-2 rounded-lg absolute top-[6%] left-[4%]">-{product.discount}%</span>
        <ul className='absolute top-[-2%] opacity-0 right-[4%] group-hover:top-[6%] group-hover:opacity-100 transition-all duration-300'>
          <li className='mb-3'>
            <Tooltip title={isAddedToList ? "Added to Wishlist" : "Add to Wishlist"} disableInteractive
              slotProps={{
                popper: {
                  sx: {
                    [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]: { marginTop: '6px' }
                  }
                }
              }}
            >
              <button className={`
                rounded-full bg-white p-3 hover:bg-[#ff5252] transition-colors duration-300 cursor-pointer text-black hover:text-white disabled:opacity-60 disabled:select-none
                ${isAddedToList && '!bg-[#ff5252] !text-white'}
              `}
                onClick={addToList} disabled={isAddingToList || isAddingToCart}>
                <CgHeart className='text-[2rem] transition-colors duration-300' />
              </button>
            </Tooltip>
          </li>
          <li className='mb-3'>
            <Tooltip title={"Maximize"} disableInteractive
              slotProps={{
                popper: {
                  sx: {
                    [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                    {
                      marginTop: '6px',
                    }
                  },
                },
              }}
            >
              <button className='rounded-full bg-white p-3 hover:bg-[#ff5252] transition-colors duration-300 cursor-pointer text-black hover:text-white'
                onClick={expand}>
                <CgMaximize className='text-[2rem] transition-colors duration-300' />
              </button>
            </Tooltip>
          </li>
          <li>
            <Tooltip title={"Compare"} disableInteractive
              slotProps={{
                popper: {
                  sx: {
                    [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                    {
                      marginTop: '6px',
                    }
                  },
                },
              }}
            >
              <button className='rounded-full bg-white p-3 hover:bg-[#ff5252] transition-colors duration-300 cursor-pointer text-black hover:text-white'>
                <VscGitCompare className='text-[2rem] transition-colors duration-300' />
              </button>
            </Tooltip>
          </li>
        </ul>
      </div>
      <div className="productDetails h-full bg-[#f1f1f1] text-[#3e3e3e] flex flex-col gap-3 px-3 py-6 pl-20 pr-10 rounded-r-2xl justify-center">
        <Link className="productBrand text-[1.3rem] primary-hov truncate w-max capitalize font-medium" to={`/productdetails/${product._id}`}>{product.brandName}</Link>
        <Link to={`/productdetails/${product._id}`} className="productName text-[1.5rem] font-medium text-[#222] primary-hov truncate w-max capitalize">{product.title}</Link>
        <p className='text-[1.5rem] font-medium text-[#777] line-clamp-3' dangerouslySetInnerHTML={{ __html: product.desc }}></p>
        <Rating name="read-only size-large half-rating" value={product.totalRating} precision={0.5} size='large' readOnly />
        <ul className="productPrice flex w-max gap-10 text-[1.6rem] font-[600]">
          <li className="oldPrice line-through opacity-75">${product.price}</li>
          <li className="newPrice primary-color">${product.discountedPrice}</li>
        </ul>
        <Button
          disabled={isAddingToCart || isAddingToList}
          className={`
            !min-w-auto !border !border-[#ff5252] !rounded-xl !w-full !text-center !text-[#ff5252] !py-2 hover:!text-white hover:!bg-[#ff5252] !transition-all !duration-300 !cursor-pointer !mt-2 !flex !justify-center !items-center !gap-3 disabled:opacity-60 disabled:select-none
            ${isAddedToCart && '!text-white !bg-[#ff5252]'}
            `}
          onClick={addToCart}>
          <HiOutlineShoppingCart className='text-[2.4rem]' />
          <p className='text-[1.5rem] font-medium h-max'>{isAddedToCart ? 'Added To Cart' : 'Add To Cart'}</p>
        </Button>
      </div>

    </div>
  )
}

export default ProductCardListView
