import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Skeleton } from '@mui/material'
import 'swiper/css';
import { Autoplay } from 'swiper/modules'
import { context } from '../../../App'

const AdsBanner = ({ item }) => {
  const { adsBanners, isAdsLoading } = useContext(context)
  return (
    <>
      <div className="adsBanner">
        {isAdsLoading ?
          <ul className={`flex justify-between gap-6 py-10`}>
            {[...Array(item)]?.map((_, index) => (
              <li key={index} className='overflow-hidden rounded-2xl w-full'>
                <Skeleton variant="rectangular" width="100%" height={275} />
              </li>
            ))}
          </ul>
          :
          <div className='flex justify-between pt-14'>
            <Swiper
              loop={item > 3 ? true : false}
              slidesPerView={item}
              spaceBetween={10}
              modules={[Autoplay]}
              autoplay={{ delay: 1500, disableOnInteraction: true }}
              className="mySwiper"
            >
              {adsBanners.map(banner => {
                return (
                  <SwiperSlide key={banner._id}>
                    <div className='overflow-hidden rounded-2xl'>
                      <Link to={`/products?category=${banner.nestedSubCategory?.nestedSubCategory || banner.subCategory?.subCategory || banner.category?.category}`}>
                        <img src={banner.imgUrl} alt="" className='object-center hover:scale-[1.05] hover:rotate-1 transition-all duration-200 w-full' />
                      </Link>
                    </div>
                  </SwiperSlide>
                )
              })}

            </Swiper>
          </div>}
      </div>
    </>
  )
}

export default AdsBanner