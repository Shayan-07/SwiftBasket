import { Link } from 'react-router-dom'

const OrderedItem = ({ id, src, title, qty, price, discountedPrice }) => {
    return (
        <div className="orderedItem flex items-center gap-2 py-6">
            <div className='grid grid-cols-[max-content_1fr] items-center gap-6'>
                <div className="orderedItemThumbnail w-[6.5rem] h-[7rem] rounded-md overflow-hidden">
                    <Link to={`/productdetails/${id}`}>
                        <img src={src} alt="" className='w-full h-full object-cover object-top-left hover:scale-120 transition-all duration-300 origin-top' />
                    </Link>
                </div>
                <div className="orderedItemDetails">
                    <Link to={`/productdetails/${id}`}>
                        <p className='text-[1.3rem] primary-hov font-medium w-[100%] line-clamp-1 leading-none capitalize'>{title}</p>
                    </Link>
                    <div className="itemSpecification flex gap-4 mt-2 mb-1">
                        <span className='text-[1rem] font-medium bg-[#dcdcdc] py-1 px-2 rounded-md'>Qty: {qty}</span>
                        <span className='text-[1rem] font-medium bg-[#dcdcdc] py-1 px-2 rounded-md'>Size: Sml</span>
                        <span className='text-[1rem] font-medium bg-[#dcdcdc] py-1 px-2 rounded-md'>Color: Gray</span>
                    </div>
                    <div className="productPrice w-max flex gap-8 text-[1.6rem] font-[600]">
                        <span className="oldPrice line-through opacity-70 text-[1.5rem] font-[600]">${price}</span>
                        <span className='price text-[1.5rem] primary-color font-[600]'>${discountedPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderedItem
