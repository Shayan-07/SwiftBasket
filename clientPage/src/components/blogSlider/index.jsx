import { useContext } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Skeleton } from '@mui/material'
import 'swiper/css'
import { context } from '../../App'
import BlogItem from '../blogItem'
import { Navigation } from 'swiper/modules'

const BlogSlider = () => {
    const { blogs, isBlogLoading } = useContext(context)
    return (
        <>
            <section className="blogs pb-10">
                <div className="wrapper">
                    {isBlogLoading ?
                        <div className="blogSkeleton flex gap-10">
                            {[...Array(4)]?.map((_, index) => (
                                <div className="blogItem rounded-4xl mb-[10px] w-full" key={index}>
                                    <div className="blogImg rounded-t-xl overflow-hidden relative">
                                        <Skeleton variant="rectangular" width="100%" height={200} />
                                        <div className="absolute bottom-6 right-6 z-10">
                                            <Skeleton variant="rounded" width={100} height={30} />
                                        </div>
                                    </div>

                                    <div className="blogText flex flex-col gap-4 p-4 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                                        <Skeleton variant="text" width="80%" height={30} />

                                        <Skeleton variant="text" width="100%" height={20} />
                                        <Skeleton variant="text" width="95%" height={20} />
                                        <Skeleton variant="text" width="90%" height={20} />

                                        <Skeleton variant="text" width={100} height={25} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        :
                        <Swiper
                            navigation={true}
                            slidesPerView={4}
                            spaceBetween={15}
                            modules={[Navigation]}
                            className="mySwiper"
                        >
                            {blogs.map(blog => {
                                return (
                                    <SwiperSlide key={blog._id}>
                                        <BlogItem id={blog._id} imgUrl={blog.imgUrl} date={blog.createdAt} title={blog.title} desc={blog.description} />
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>}
                </div>
            </section>
        </>
    )
}

export default BlogSlider