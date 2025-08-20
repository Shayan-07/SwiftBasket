import React from 'react'
import { Button } from '@mui/material'

const AdSlide = (props) => {
  return (
    <div className="adSlide relative overflow-hidden cursor-grab rounded-lg">
      <img src={props.src} alt="" className='w-full h-full object-cover object-left-top' />
      <div className='adDetails text-[#3e3e3e] w-1/2 absolute top-1/2 -translate-y-1/2 -right-full opacity-0 transition-all duration-700'>
        <p className='text-[1.8rem] capitalize font-medium transition-all duration-700 delay-100 -right-full relative mb-3'>big saving days sale</p>
        <h2 className='text-[3rem] font-bold capitalize transition-all duration-700 delay-200 -right-full relative truncate mb-3'>{props.adPrName}</h2>
        <h3 className='flex gap-2 items-center transition-all duration-700 delay-300 -right-full relative mb-3'>
          <span className='text-[1.8rem] font-medium'>Starting at only</span>
          <span className='primary-color text-[3rem] font-bold'>${props.price}</span>
        </h3>
        <div className="transition-all duration-700 delay-400 -right-full relative">
          <Button className='primary-bg !text-white !text-[1.3rem] !font-medium !capitalize !px-5'>Shop Now</Button>
        </div>
      </div>
    </div>
  )
}

export default AdSlide

"info absolute top-0 -right-[100%] opacity-0 w-[50%] h-[100%] z-50 p-8 flex items-center flex-col justify-center transition-all duration-700"

"text-[12px] lg:text-[18px] font-[500] w-full text-left mb-3 relative -right-[100%] opacity-0 hidden lg:block"

"text-[16px] sm:text-[20px] md:text-[25px] lg:text-[30px] font-[700] w-full relative -right-[100%] opacity-0"

"flex items-center gap-0 lg:gap-3 text-[12px] lg:text-[18px] font-[500] w-full text-left mt-3 mb-0 lg:mb-3 relative -right-[100%] opacity-0 flex-col lg:flex-row"