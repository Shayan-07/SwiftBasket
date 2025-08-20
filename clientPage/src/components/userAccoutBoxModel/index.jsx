import { useContext, useState } from 'react'
import { context } from '../../App'

import { FaRegAddressCard, FaRegHeart } from 'react-icons/fa6'
import { MdMyLocation, MdLogout } from "react-icons/md"
import { FiShoppingBag } from "react-icons/fi"
import { Button } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { LuImages } from "react-icons/lu"
import LogoutFunc from '../../helpers/logoutFunc'
import UploadImagesFunc from '../../helpers/uploadImgFunc'

const UserAccoutBoxModel = () => {

  const { appURI, setIsAuthenticated, setIsError, setIsSuccess, userData, setUserData } = useContext(context)
  const navigate = useNavigate()
  const location = useLocation()

  const navigateTo = (url) => {
    navigate(`/${url}`)
  }

  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = (e) => {
    UploadImagesFunc(e, setUserData, setIsUploading, setIsError, setIsSuccess, appURI)
  }

  const logout = async () => {
    LogoutFunc(appURI, setIsAuthenticated, setIsError, setIsSuccess, navigate)
  }

  const isActive = (path) => {
    return location.pathname === `/${path}` ? '!text-[#ff5252] !bg-[#f2f2f2]' : '!text-[#3e3e3e]'
  }

  return (
    <div className='userAccoutBoxModel bg-white h-max rounded-2xl shadow-[0px_0px_12px_rgba(0,0,0,0.2)]'>
      <div className="userInfo flex flex-col items-center text-[#3e3e3e] py-8">
        <div className="userImg w-[10rem] h-[10rem] rounded-full border border-[rgba(0,0,0,0.2)] overflow-hidden pt-1 mb-4 relative group">
          <img src={userData.avatar} alt="" className='w-full h-full object-cover object-left-top' />

          <div className={`
                uploadImg absolute inset-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300
                ${isUploading && '!opacity-60'}
            `}>
            <LuImages className='text-white text-[3.5rem]' />
            <input
              type="file"
              multiple={false}
              className='w-full h-full inset-0 absolute opacity-0 cursor-pointer'
              title='Upload Profile Image'
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </div>
        </div>
        <h4 className='text-[1.6rem] font-[600] capitalize'>{userData.name}</h4>
      </div>
      <div className="userAccountNavigation border-t border-[rgba(0,0,0,0.3)] py-8">
        <Button onClick={() => navigateTo('profile')}
          className={`!min-w-auto !py-5 !px-6 !w-full !leading-none !flex !items-center !justify-start !gap-3 !text-[1.5rem] !rounded-none ${isActive('profile')}`}>
          <FaRegAddressCard className='text-[2.2rem]' />
          <span>Profile</span>
        </Button>

        <Button onClick={() => navigateTo('address')}
          className={`!min-w-auto !py-5 !px-6 !w-full !leading-none !flex !items-center !justify-start !gap-3 !text-[1.5rem] !rounded-none ${isActive('address')}`}>
          <MdMyLocation className='text-[2.2rem]' />
          <span>Address</span>
        </Button>

        <Button onClick={() => navigateTo('wishlist')}
          className={`!min-w-auto !py-5 !px-6 !w-full !leading-none !flex !items-center !justify-start !gap-3 !text-[1.5rem] !rounded-none ${isActive('wishlist')}`}>
          <FaRegHeart className='text-[2.2rem]' />
          <span>Wishlist</span>
        </Button>

        <Button onClick={() => navigateTo('orders')}
          className={`!min-w-auto !py-5 !px-6 !w-full !leading-none !flex !items-center !justify-start !gap-3 !text-[1.5rem] !rounded-none ${isActive('orders')}`}>
          <FiShoppingBag className='text-[2.2rem]' />
          <span>Orders</span>
        </Button>

        <Button
          onClick={logout}
          className='!min-w-auto !py-5 !px-6 !w-full !leading-none !flex !items-center !justify-start !gap-3 !text-[1.5rem] !rounded-none !text-[#3e3e3e]'>
          <MdLogout className='text-[2.2rem]' />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}

export default UserAccoutBoxModel
