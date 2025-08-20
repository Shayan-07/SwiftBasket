import React from 'react'
import { Button } from '@mui/material'
import { useNavigate, useRouteError } from 'react-router-dom'

import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { RiHome2Line } from 'react-icons/ri'

const Page404 = () => {

  const navigate = useNavigate()
  const goBack = () => {
    navigate(-1)
  }
  const goHome = () => {
    navigate('/')
  }

  const error = useRouteError();
  console.log(error)

  return (
    <div className='page404 flex gap-8 items-end justify-center pb-10 relative'>
      <Button className='!text-white !text-[1.5rem] !font-medium !flex !items-center !justify-center !gap-3 primary-bg !rounded-4xl !py-3 !px-6' onClick={goHome}>
        <RiHome2Line className='text-[1.7rem]' />
        <span>Home</span>
      </Button>
      <Button className='!text-white !text-[1.5rem] !font-medium !flex !items-center !justify-center !gap-3 primary-bg !rounded-4xl !py-3 !px-6' onClick={goBack}>
        <MdOutlineKeyboardBackspace className='text-[1.7rem]' />
        <span>Back</span>
      </Button>
    </div>
  )
}

export default Page404
