import { useState, useContext, useRef } from 'react'
import { Box, Button, Pagination, Table, TableCell, TableContainer, TableHead, TableRow, Skeleton, FormControl, Select, MenuItem } from '@mui/material'
import { context } from '../../App'

import { BiSearch } from 'react-icons/bi'
import { IoIosArrowDown } from 'react-icons/io'


const OrdersTable = () => {
    const { orders, setOrders, isLoading, appURI, setIsError } = useContext(context)

    const [openOrderedProduct, setOpenOrderedProduct] = useState(null)
    const contentRefs = useRef({})

    const isShowOrderedProduct = (index) => {
        if (openOrderedProduct !== index) {
            setOpenOrderedProduct(index)
        } else {
            setOpenOrderedProduct(null)
        }
    }

    const rowsPerPage = 7
    const [page, setPage] = useState(0)

    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    const currentOrders = orders.slice(startIndex, endIndex)

    const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSelect = (e, id) => {
        setIsSubmitting(true)
        fetch(`${appURI}/order/status/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderStatus: e.target.value }),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setOrders(resData.data)
                } else {
                    setIsError(resData.message)
                }
            })
            .catch((error) => {
                setIsError(error.message || 'Something went wrong!')
            })
            .finally(() => setIsSubmitting(false))
    }

    const [isSearching, setIsSearching] = useState(false)
    const [searchedKeyword, setSearchedKeyword] = useState(false)

    const handleChange = (e) => {
        setSearchedKeyword(e.target.value)
    }

    const handleSearch = () => {
        setIsSearching(true)
        fetch(`${appURI}/order/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchedKeyword }),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setOrders(resData.data)
                } else {
                    setIsError(resData.message)
                }
            })
            .catch((error) => {
                setIsError(error.message || 'Something went wrong!')
            })
            .finally(() => setIsSearching(false))
    }

    return (
        <div className="relative shadow-[0_0_10px_rgba(0,0,0,0.15)] pt-5 sm:rounded-lg overflow-hidden bg-white px-6">
            <div className="orderSearch flex justify-between items-center pb-6 pt-3">
                <h2 className='text-[1.8rem] font-[600] dark-color'>Orders List</h2>
                <div className="mb-[0.15rem] flex items-center px-4 py-2 w-[30%] border rounded-[4px] border-[rgba(0,0,0,0.3)] dark-color justify-between gap-1.5 focus-within:border-[#ff5252]">
                    <input
                        type="text"
                        className='text-[1.5rem] font-medium w-full'
                        placeholder='Search Here' disabled={isSearching}
                        onChange={(e) => handleChange(e)}
                        onKeyDown={(e) => e.key === 'Enter'&& searchedKeyword  && handleSearch()} />
                    <Button className='!min-w-auto !p-2 !rounded-full dark-color' onClick={() => searchedKeyword && handleSearch()} disabled={isSearching}>
                        <BiSearch className='text-[1.8rem]' />
                    </Button>
                </div>
            </div>
            <TableContainer className="!overflow-y-hidden !overflow-x-scroll !pr-6">
                <Table stickyHeader aria-label="order table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ pr: 1 }}></TableCell>
                            <TableCell sx={{ fontSize: '1.6rem', fontWeight: 600, pl: 0 }} className='!whitespace-nowrap'>
                                Order Id
                            </TableCell>
                            <TableCell sx={{ fontSize: '1.6rem', fontWeight: 600, pl: 0 }} className='!whitespace-nowrap'>
                                Payment Method
                            </TableCell>
                            <TableCell sx={{ fontSize: '1.6rem', fontWeight: 600, pl: 0 }} className='!whitespace-nowrap'>
                                User Name
                            </TableCell>
                            <TableCell sx={{ fontSize: '1.6rem', fontWeight: 600, pl: 0 }} className='!whitespace-nowrap'>
                                Phone Number
                            </TableCell>
                            <TableCell sx={{ fontSize: '1.6rem', fontWeight: 600, pl: 0 }} className='!whitespace-nowrap'>
                                Address
                            </TableCell>
                            <TableCell sx={{ fontSize: '1.6rem', fontWeight: 600, pl: 0 }} className='!whitespace-nowrap'>
                                Postal Code
                            </TableCell>
                            <TableCell sx={{ fontSize: '1.6rem', fontWeight: 600, pl: 0 }} className='!whitespace-nowrap'>
                                Total Amount
                            </TableCell>
                            <TableCell sx={{ fontSize: '1.6rem', fontWeight: 600, pl: 0 }} className='!whitespace-nowrap'>
                                Email
                            </TableCell>
                            <TableCell sx={{ fontSize: '1.6rem', fontWeight: 600, pl: 0 }} className='!whitespace-nowrap'>
                                Order Status
                            </TableCell>
                            <TableCell sx={{ fontSize: '1.6rem', fontWeight: 600, pl: 0 }} className='!whitespace-nowrap'>
                                Date
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {isLoading || isSearching ?
                        <tbody>
                            {Array.from({ length: rowsPerPage }).map((_, idx) => (
                                <tr key={idx}>
                                    {Array.from({ length: 11 }).map((_, cellIdx) => (
                                        <td key={cellIdx} className="py-6 pr-10">
                                            <Skeleton
                                                variant={cellIdx === 0 ? 'circular' : 'rectangular'}
                                                width={cellIdx === 0 ? 30 : cellIdx === 2 ? 120 : 80}
                                                height={cellIdx === 0 ? 30 : 20}
                                                className="rounded-lg"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        :
                        currentOrders.map(orderItem =>
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
                                    <td className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium capitalize">
                                        <FormControl fullWidth>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={orderItem.orderStatus}
                                                onChange={(e) => handleSelect(e, orderItem._id)}
                                                sx={{
                                                    '& .MuiSelect-icon': { display: 'none' },
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                {statuses.map((status, i) =>
                                                    <MenuItem
                                                        value={status}
                                                        key={i}
                                                        sx={{
                                                            fontSize: '1.4rem',
                                                            fontWeight: 'medium',
                                                            textTransform: 'capitalize'
                                                        }}
                                                    >
                                                        {status}
                                                    </MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </td>
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
                </Table>
            </TableContainer>

            <Box display={'flex'} justifyContent={'end'} padding={'1rem 1.5rem 1.5rem 0'}>
                <Pagination
                    count={Math.ceil(orders.length / rowsPerPage)}
                    page={page + 1}
                    onChange={(event, newPage) => setPage(newPage - 1)}
                    shape="rounded"
                    siblingCount={1}
                    boundaryCount={1}
                    sx={{
                        '& .MuiPaginationItem-root': {
                            fontSize: '1.4rem',
                            color: '#3e3e3e',
                            fontWeight: 450
                        },
                        '& .Mui-selected': {
                            backgroundColor: '#ff5252 !important',
                            color: '#fff',
                        }
                    }}
                />
            </Box>
        </div>
    )
}

export default OrdersTable
