import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Skeleton } from '@mui/material'

import { TbZoomIn } from "react-icons/tb"
import { TbZoomOut } from "react-icons/tb"

const ImgZoom = ({ mediaImgUrls, isProductLoading }) => {

  const [slideIndex, setSlideIndex] = useState(0)
  const productSideBarSlider = useRef(null)
  const productImgSlider = useRef(null)

  const goto = (index) => {
    setSlideIndex(index)
    productSideBarSlider.current.swiper.slideTo(index)
    productImgSlider.current.swiper.slideTo(index)
  }

  const [zoom, setZoom] = useState(false)

  const handleOnMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.target.style.transformOrigin = `${x}% ${y}%`
  }
  return (
    <>
      {isProductLoading ?
        <div className="productDetailsImg grid grid-cols-[19%_79%] justify-between gap-5">
          <div className="productSideBarSlider h-[600px] flex flex-col gap-5">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={120}
                width="100%"
                sx={{ borderRadius: '12px' }}
              />
            ))}
          </div>

          <div className="productImgSlider h-[600px] relative">
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ borderRadius: '12px' }}
            />

            <Skeleton
              variant="circular"
              width={50}
              height={50}
              sx={{
                position: 'absolute',
                bottom: '1.5rem',
                right: '1.5rem',
                bgcolor: 'rgba(255,255,255,0.6)'
              }}
            />
          </div>
        </div>
        :
        <div className="productDetailsImg grid grid-cols-[19%_79%] justify-between">
          <div className="productSideBarSlider h-[600px]">
            <Swiper direction={'vertical'} slidesPerView={4} spaceBetween={20} className="mySwiper h-full" ref={productSideBarSlider} >
              {mediaImgUrls.map((url, i) => {
                return (
                  <SwiperSlide>
                    <img src={url} alt="" onClick={() => goto(i)}
                      className={`w-full h-full object-cover object-left-top rounded-xl cursor-pointer transition-opacity duration-300 ${slideIndex === i ? 'opacity-100 ' : 'opacity-40'}`} />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
          <div className="productImgSlider h-[600px]">
            <Swiper className="mySwiper h-full" ref={productImgSlider} onSlideChange={(swiper) => goto(swiper.activeIndex)}>
              {mediaImgUrls.map(url => {
                return (
                  <SwiperSlide>
                    <div className="imgZoom group overflow-hidden group w-full h-full relative">
                      <img src={url} alt="" onMouseMove={(e) => handleOnMouseMove(e)} onClick={() => setZoom(false)}
                        className={`w-full h-full object-cover object-left-top ${zoom ? 'group-hover:scale-180 cursor-zoom-out' : 'cursor-grab'} transition-transform duration-200 transform`}
                      />
                    </div>
                  </SwiperSlide>
                )
              })}

              <span className="zoomOpt p-4 bg-[rgba(255,255,255,0.7)] absolute z-5 bottom-6 right-6 cursor-pointer"
                onClick={() => setZoom(!zoom)}>
                {!zoom ? <TbZoomIn className='text-[#222] text-[2.5rem]' /> : <TbZoomOut className='text-[#222] text-[2.5rem]' />}
              </span>
            </Swiper>
          </div>
        </div>}
    </>
  )
}

export default ImgZoom
