import { useContext } from 'react'
import ListProduct from '../../components/listProduct'
import UserAccoutBoxModel from '../../components/userAccoutBoxModel'
import { useNavigate } from 'react-router-dom'
import { context } from '../../App'
import { Skeleton, Button } from '@mui/material'
import GetData from '../../helpers/getData'

const Wishlist = () => {

    const { list, isListLoading, appURI, setIsListLoading, setList } = useContext(context)
    const navigate = useNavigate()

    const getList = async () => {
        const listRes = await GetData(appURI, setIsListLoading, 'wishlist')
        if (listRes.data) setList(listRes.data)
        else if (listRes.error) setIsError(listRes.error)
    }

    return (
        <section className="wishlist py-16 bg-[rgba(0,0,0,0.05)]">
            <div className="wrapper">
                <div className="listContainer grid grid-cols-[25%_73%] justify-between">
                    <div className="boxModel mt-22">
                        <UserAccoutBoxModel />
                    </div>
                    <div className="list">
                        {!isListLoading && list.length === 0 ?
                            <div className="emaptyListt items-center flex flex-col">
                                <img src="/img/empty-list.png" alt="Wishlist is Empty" className='w-[35rem]' />
                                <h2 className='mt-4 text-[3rem] font-bold text-[#666]'>Your wishlist is currently empty.</h2>
                                <p className='mt-1 mb-3 text-[1.5rem] font-medium text-[#787878]'>Start adding your favorite items and save them for later!</p>
                                <Button
                                    className='!min-w-auto !rounded-xl !w-max !py-3 !px-4 !text-white !bg-[#ff5252] !cursor-pointer'
                                    onClick={() => navigate('/products')}>
                                    <p className='text-[1.5rem] font-medium h-max !capitalize'>Explore</p>
                                </Button>
                            </div>
                            :
                            <table className="cartProductsForm text-[#3e3e3e]">
                                <thead className='cartProductHead'>
                                    <tr>
                                        <th className='text-start'>
                                            <h2 className='text-[2rem] font-[600] p-6'>Product</h2>
                                        </th>
                                        <th className='text-start'>
                                            <h2 className='text-[2rem] font-[600] p-6'>Price</h2>
                                        </th>
                                        <th className='text-start'>
                                            <h2 className='text-[2rem] font-[600] p-6'>Sub Total</h2>
                                        </th>
                                        <th className='text-start'>
                                            <h2 className='text-[2rem] font-[600] p-6'>Actions</h2>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isListLoading ?
                                        Array(4).fill(0).map((_, i) => {
                                            return (
                                                <tr className="listProduct border-t border-[rgba(0,0,0,0.2)]" key={i}>
                                                    <td className="listProductDetailing py-8 px-6 max-w-[50%] w-full">
                                                        <div className="grid grid-cols-[max-content_1fr] items-center gap-6">
                                                            <div className="listProductThumbnail w-[8rem] h-[8.5rem] rounded-md overflow-hidden">
                                                                <Skeleton variant="rectangular" width={80} height={85} />
                                                            </div>
                                                            <div className="listProductOpts flex flex-col gap-2 w-full">
                                                                <Skeleton variant="text" width={100} height={20} />
                                                                <Skeleton variant="text" width={160} height={24} />
                                                                <div className="itemSpecification flex gap-2 mt-2">
                                                                    <Skeleton variant="rectangular" width={70} height={24} />
                                                                    <Skeleton variant="rectangular" width={70} height={24} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="listProductPrice py-8 px-6">
                                                        <Skeleton variant="text" width={60} height={24} />
                                                    </td>

                                                    <td className="listProductQty py-8 px-6">
                                                        <Skeleton variant="rectangular" width={80} height={40} />
                                                    </td>

                                                    <td className="listProductSubTotal py-8 px-6">
                                                        <Skeleton variant="text" width={70} height={24} />
                                                    </td>

                                                    <td className="listProductAction py-8 px-6">
                                                        <Skeleton variant="circular" width={40} height={40} />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        list?.map(listItem => {
                                            return (
                                                <ListProduct listId={listItem._id} getList={getList} setList={setList} listProduct={listItem.product} key={listItem._id} />
                                            )
                                        })}
                                </tbody>
                            </table>}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Wishlist
