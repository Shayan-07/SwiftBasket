import React from 'react'
import { Button } from '@mui/material'

const AdsBannerV2 = (props) => {
  return (
    <div className='adsBannerV2 group overflow-hidden rounded-xl relative'>
      <img src={props.src} alt="" className={`w-full group-hover:scale-120 transition-all duration-700 ${props.position}`} />
      <div className='adBannerV2_details text-[#3e3e3e] absolute top-1/2 -translate-y-1/2 w-[62.5%] flex flex-col gap-2 pl-4'>
        <h3 className='text-[2rem] font-[600] capitalize'>{props.adPrName}</h3>
        <h2 className='text-[2.4rem] primary-color font-[600] mb-4 flex items-center gap-3'>
          <span className='text-[#3e3e3e] text-[1.3rem]'>Only at</span>
          <span className='capitalize'>${props.price}</span>
        </h2>
        <Button className='primary-bg !text-white !text-[1.3rem] !font-medium !capitalize !px-5 !w-max'>Shop Now</Button>
      </div>
    </div>
  )
}

export default AdsBannerV2