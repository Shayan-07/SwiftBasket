import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules';
import { context } from '../../App'


const Hero = () => {
    const { homeSlides, categories, isSlideLoading, isCatLoading } = useContext(context)

    return (
        <>
            <div className="hero bg-[#f5f0f0]">
                <Swiper
                    loop={true}
                    navigation={true}
                    pagination={{ clickable: true }}
                    mousewheel={true}
                    keyboard={true}
                    modules={[Autoplay, Navigation, Pagination, Mousewheel, Keyboard]}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    className="mySwiper"
                >
                    {isSlideLoading ?
                        <Skeleton animation={'wave'} variant="rectangular" width={'100%'} height={450} />
                        :
                        homeSlides.map(slide => {
                            return (
                                <SwiperSlide>
                                    <img src={slide.imgUrl} alt="" width={'100%'} height={450} className='object-contain object-center' />
                                </SwiperSlide>
                            )
                        })}
                </Swiper>

                <div className="wrapper">
                    {isCatLoading ?
                        <ul className='grid grid-cols-6 justify-between gap-5 py-10'>
                            <Skeleton animation={'wave'} variant="rectangular" width={'100%'} height={175} />
                            <Skeleton animation={'wave'} variant="rectangular" width={'100%'} height={175} />
                            <Skeleton animation={'wave'} variant="rectangular" width={'100%'} height={175} />
                            <Skeleton animation={'wave'} variant="rectangular" width={'100%'} height={175} />
                            <Skeleton animation={'wave'} variant="rectangular" width={'100%'} height={175} />
                            <Skeleton animation={'wave'} variant="rectangular" width={'100%'} height={175} />
                        </ul>
                        :
                        <ul className='py-10'>
                            <Swiper
                                loop={true}
                                slidesPerView={7}
                                spaceBetween={10}
                                modules={[Autoplay]}
                                autoplay={{ delay: 2000, disableOnInteraction: true }}
                                className="mySwiper"
                            >
                                {categories.map((cat) => (
                                    <SwiperSlide className='shadow-none'>
                                        <li key={cat._id}>
                                            <Link to={`/products?category=${cat._id}`}
                                                className='catCard flex flex-col items-center justify-center bg-white py-7 px-3 gap-6'>
                                                <img src={cat.imgUrl} alt="" className='transition-all duration-150 w-[55%] scale-[0.9]' />
                                                <p className='text-[1.8rem] text-gray-700 font-medium transition-colors duration-250 capitalize'>{cat.category}</p>
                                            </Link>
                                        </li>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </ul>}
                </div>
            </div>
        </>
    );
}

export default Hero