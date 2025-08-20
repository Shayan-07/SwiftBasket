import { useRef, useState, useContext } from 'react'
import UserAccoutBoxModel from '../../components/userAccoutBoxModel'
import { Button, Skeleton } from '@mui/material'

import { IoIosArrowDown } from 'react-icons/io'
import { context } from '../../App'

const Orders = () => {

    const { order, isOrderLoading } = useContext(context)

    const [openOrderedProduct, setOpenOrderedProduct] = useState(null)
    const contentRefs = useRef({})

    const isShowOrderedProduct = (index) => {
        if (openOrderedProduct !== index) {
            setOpenOrderedProduct(index)
        } else {
            setOpenOrderedProduct(null)
        }
    }

    return (
        <section className='orders py-16 bg-[rgba(0,0,0,0.05)]'>
            <div className="wrapper">
                <div className="ordersContainer grid grid-cols-[25%_73%] justify-between text-[#3e3e3e]">
                    <div className="boxModel">
                        <UserAccoutBoxModel />
                    </div>
                    <div className="ordersBox h-max bg-white rounded-2xl pt-10 pb-12 px-8 text-[#3e3e3e]">
                        <h2 className='text-[2rem] font-[600] mb-5'>My Orders</h2>
                        <div className="ordersTable pl-8 overflow-x-scroll overflow-y-hidden scrollable py-10 text-[#3e3e3e]">
                            <table>
                                <thead>
                                    <tr className='border-b border-[rgba(0,0,0,0.2)] border-collapse'>
                                        <th className="text-left pr-10 pb-10 whitespace-nowrap text-[1.4rem] font-[600]"></th>
                                        <th className="text-left pr-10 pb-10 whitespace-nowrap text-[1.4rem] font-[600]">Order Id</th>
                                        <th className="text-left pr-10 pb-10 whitespace-nowrap text-[1.4rem] font-[600]">Payment Method</th>
                                        <th className="text-left pr-10 pb-10 whitespace-nowrap text-[1.4rem] font-[600]">User Name</th>
                                        <th className="text-left pr-10 pb-10 whitespace-nowrap text-[1.4rem] font-[600]">Phone Number</th>
                                        <th className="text-left pr-10 pb-10 whitespace-nowrap text-[1.4rem] font-[600]">Address</th>
                                        <th className="text-left pr-10 pb-10 whitespace-nowrap text-[1.4rem] font-[600]">Postal Code</th>
                                        <th className="text-left pr-10 pb-10 whitespace-nowrap text-[1.4rem] font-[600]">Total Amount</th>
                                        <th className="text-left pr-10 pb-10 whitespace-nowrap text-[1.4rem] font-[600]">Email</th>
                                        <th className="text-left pr-10 pb-10 whitespace-nowrap text-[1.4rem] font-[600]">Order Status</th>
                                        <th className="text-left pr-10 pb-10 whitespace-nowrap text-[1.4rem] font-[600]">Date</th>
                                    </tr>
                                </thead>

                                {isOrderLoading ?
                                    <tbody>
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <tr key={idx}>
                                                {Array.from({ length: 11 }).map((_, cellIdx) => (
                                                    <td key={cellIdx} className="py-6 pr-10">
                                                        <Skeleton
                                                            variant={cellIdx === 0 ? 'circular' : 'rectangular'}
                                                            width={cellIdx === 0 ? 30 : cellIdx === 2 ? 120 : 80}
                                                            height={cellIdx === 0 ? 30 : 20}
                                                            className='rounded-lg'
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                    :
                                    order.map(orderItem =>
                                        <tbody key={orderItem._id}>
                                            <tr className='border-b border-[rgba(0,0,0,0.2)] border-collapse'>
                                                <td className='py-6 pr-10'>
                                                    <Button className='!min-w-auto !rounded-full !p-2 !text-[#3e3e3e]' onClick={() => isShowOrderedProduct(orderItem._id)}>
                                                        <IoIosArrowDown
                                                            className={`
                                                                text-[1.8rem] transition-all duration-300 ${openOrderedProduct === orderItem._id ? 'rotate-180' : 'rotate-0'}
                                                            `} />
                                                    </Button>
                                                </td>
                                                <td className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium"> <span className='primary-color'>{orderItem._id}</span> </td>
                                                <td className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium capitalize">
                                                    {orderItem.paymentMethod === 'cod' ? 'cash on delivery' : orderItem.paymentMethod}
                                                </td>
                                                <td className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium capitalize">{orderItem.user.name}</td>
                                                <td className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium">+92{orderItem.address.phone}</td>
                                                <td className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium capitalize">{orderItem.address.addressLine}</td>
                                                <td className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium">{orderItem.address.postalCode}</td>
                                                <td className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium">${orderItem.total}</td>
                                                <td className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium">{orderItem.user.email}</td>
                                                <td className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium capitalize">{orderItem.orderStatus}</td>
                                                <td className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium">{new Date(orderItem.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={8}>
                                                    <div ref={(el) => (contentRefs.current[orderItem._id] = el)}
                                                        className={`orderedProduct transition-all duration-500 overflow-hidden`}
                                                        style={{
                                                            maxHeight: openOrderedProduct === orderItem._id
                                                                ? `${contentRefs.current[orderItem._id]?.scrollHeight}px`
                                                                : '0px',
                                                        }}
                                                    >
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th className="text-left pr-10 pt-6 pb-4 whitespace-nowrap text-[1.4rem] font-[600]"></th>
                                                                    <th className="text-left pr-10 pt-6 pb-4 whitespace-nowrap text-[1.4rem] font-[600]">Product Id</th>
                                                                    <th className="text-left pr-10 pt-6 pb-4 whitespace-nowrap text-[1.4rem] font-[600]">Product Img</th>
                                                                    <th className="text-left pr-10 pt-6 pb-4 whitespace-nowrap text-[1.4rem] font-[600]">Product Title</th>
                                                                    <th className="text-left pr-10 pt-6 pb-4 whitespace-nowrap text-[1.4rem] font-[600]">Quantity</th>
                                                                    <th className="text-left pr-10 pt-6 pb-4 whitespace-nowrap text-[1.4rem] font-[600]">Price</th>
                                                                    <th className="text-left pr-10 pt-6 pb-4 whitespace-nowrap text-[1.4rem] font-[600]">Sub Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {orderItem.products.map(item =>
                                                                    <tr className='border-b border-[rgba(0,0,0,0.2)] border-collapse' key={item.product._id}>
                                                                        <td className="py-4 px-10 whitespace-nowrap text-[1.3rem] font-medium"></td>
                                                                        <td className="pb-4 pt-7 pr-10 whitespace-nowrap text-[1.3rem] font-medium align-center">
                                                                            <span className='primary-color'>{item.product._id}</span>
                                                                        </td>
                                                                        <td className="py-4 pr-10">
                                                                            <div className="cartProductThumbnail w-[6rem] h-[6rem] rounded-md overflow-hidden">
                                                                                <img src={item.product.mediaImgUrls[0]} alt="" className='w-full h-full object-cover object-top-left hover:scale-120 transition-all duration-300 origin-center' />
                                                                            </div>
                                                                        </td>
                                                                        <td className="pb-4 pt-5 pr-10 text-[1.3rem] font-medium align-center capitalize">
                                                                            <p className='line-clamp-3'>{item.product.title}</p>
                                                                        </td>
                                                                        <td className="pb-4 pt-5 pr-10 whitespace-nowrap text-[1.3rem] font-medium align-center text-center">
                                                                            {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                                                                        </td>
                                                                        <td className="pb-4 pt-5 pr-10 whitespace-nowrap text-[1.3rem] font-medium align-center">
                                                                            ${item.product.discountedPrice}
                                                                        </td>
                                                                        <td className="pb-4 pt-5 pr-10 whitespace-nowrap text-[1.3rem] font-medium align-center">
                                                                            ${(item.product.discountedPrice * item.quantity).toFixed(2)}
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    )}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Orders
