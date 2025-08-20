import { useContext, useEffect, useState } from 'react'
import ProductCard from '../productCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Skeleton } from '@mui/material'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { context } from '../../App'

const ProductSlider = ({ item, value, isRelated = false, catType }) => {

    const { products, isProductLoading, appURI, setIsError } = useContext(context)

    const [filteredProducts, setFilteredProducts] = useState([])
    const [isFilteredProductLoading, setIsFilteredProductLoading] = useState(false)

    useEffect(() => {
        if (isRelated) {
            if (!value || !catType) return
        }

        setIsFilteredProductLoading(true)
        fetch(`${appURI}/product/filter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                catType : isRelated && catType ? catType : 'category',
                ids: [value]
            }),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setFilteredProducts(resData.data)
                } else {
                    setIsError(resData.message)
                }
            })
            .catch(() => setIsError('Something went wrong!'))
            .finally(() => setIsFilteredProductLoading(false))

    }, [isRelated, value, catType, appURI, setIsError])

    const [randomProducts, setRandomProducts] = useState([])

    useEffect(() => {
        if (!value && !isRelated && products.length > 0) {
            const shuffled = [...products].sort(() => 0.5 - Math.random())
            setRandomProducts(shuffled.slice(0, 20))
        }
    }, [value, products, isRelated])

    return (
        <div className='productSlider'>
            {isProductLoading || isFilteredProductLoading ?
                <ul className={`grid justify-between gap-[10px] py-10`} style={{ gridTemplateColumns: `repeat(${item}, minmax(0, 1fr))` }}>
                    {[...Array(item)].map((_, index) => (
                        <div className="productCard productItem overflow-hidden rounded-3xl shadow-[4px_4px_8px_rgba(0,0,0,0.13)]" key={index}>
                            <div className="productImg h-[20rem] relative">
                                <Skeleton variant="rectangular" width="100%" height="100%" className="!absolute !top-0 !left-0 !h-full !w-full" />
                                <div className="absolute top-[6%] left-[4%]">
                                    <Skeleton variant="rounded" width={50} height={24} />
                                </div>
                            </div>
                            <div className="productDetails text-[#3e3e3e] flex flex-col gap-3 px-3 rounded-b-3xl py-6">
                                <Skeleton variant="text" width="70%" height={24} />
                                <Skeleton variant="text" width="100%" height={28} />
                                <Skeleton variant="rectangular" width={100} height={24} />

                                <div className="productPrice flex justify-between text-[1.6rem] font-[600]">
                                    <Skeleton variant="text" width={60} />
                                    <Skeleton variant="text" width={60} />
                                </div>

                                <Skeleton variant="rounded" height={40} width="100%" className="!mt-2" />
                            </div>
                        </div>
                    ))}
                </ul>
                :
                <Swiper
                    slidesPerView={item}
                    spaceBetween={15}
                    navigation={true}
                    modules={[Navigation]}
                    className="mySwiper"
                >
                    {value ?
                        filteredProducts.map(item => {
                            return (
                                <SwiperSlide key={item._id}>
                                    <ProductCard product={item} />
                                </SwiperSlide>
                            )
                        })
                        :
                        randomProducts.map(item => {
                            return (
                                <SwiperSlide key={item._id}>
                                    <ProductCard product={item} />
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>}
        </div>
    )
}

export default ProductSlider
