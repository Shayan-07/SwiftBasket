import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import AdSlide from './adSlide';

const AdSlider = ({slide}) => {
  return (
    <div className="adSlider">
      <Swiper
        loop={true}
        effect='fade'
        navigation={true}
        pagination={{ clickable: true }}
        modules={[EffectFade, Navigation, Pagination, Autoplay]}
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 3000 }}
        className="mySwiper"
      >

        <SwiperSlide>
          {slide}
          <AdSlide src={"img/adSlide1.jpg"} adPrName={'women solid rounded yellow t-shirt'} price={'18.99'}/>
        </SwiperSlide>

        <SwiperSlide>
        {slide}
          <AdSlide src={"img/adSlide2.jpg"} adPrName={'apple iphone 13 128gb, pink'} price={'69.99'}/>
        </SwiperSlide>

      </Swiper>
    </div>
  )
}

export default AdSlider
