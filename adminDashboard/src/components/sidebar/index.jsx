import { useContext, useRef, useState } from 'react'
import { Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { context } from '../../App';
import LogoutFunc from '../../helpers/logoutFunc';

import { LuLayoutDashboard, LuImages, LuUsersRound, LuShoppingBag, LuMessageSquareQuote } from "react-icons/lu";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlineCategory } from "react-icons/md";
import { BsBoxes, BsMegaphone } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";

const SideBar = () => {

  const { isSidebarOpen, setIsError, setIsSuccess, setIsAuthenticated, appURI } = useContext(context)
  const navigate = useNavigate()

  const handleLogout = () => {
    LogoutFunc(appURI, setIsAuthenticated, setIsError, setIsSuccess, navigate)
  }

  const [isInnerListOpen, setIsInnerListOpen] = useState()
  const innerList = useRef({})
  const handleOpenSubMenu = (index) => {
    if (isInnerListOpen !== index) {
      setIsInnerListOpen(index)
    } else {
      setIsInnerListOpen(null)
    }
  }

  const goto = (path) => {
    navigate(path)
  }

  return (
    <aside
      className={`sidebar overflow-x-hidden fixed top-0 left-0 max-h-[100vh] min-h-[100vh] bg-white transition-all duration-300 shadow-2xl z-[51]
        ${isSidebarOpen ? 'w-[20vw]' : 'w-[0px]'}
      `}>
      <div className="grid grid-rows-[max-content_1fr] py-3">
        <div className="logo px-6">
          <Link to={'/'} className='block w-[15vw]'>
            <img src="/img/logo.png" alt="" className='w-full' />
          </Link>
        </div>
        <ul className="sidebarMenu flex flex-col gap-2 px-6 mt-12 overflow-x-hidden overflow-y-scroll scrollable">
          <li className="sidebarMenuItem">
            <Button
              onClick={() => goto('/')}
              className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.5rem] !justify-start !rounded-none !transition-all !duration-500'>
              <LuLayoutDashboard className='text-[2rem]' />
              <span className="whitespace-nowrap">dashboard</span>
            </Button>
          </li>
          <li className="sidebarMenuItem">
            <Button
              onClick={() => handleOpenSubMenu(0)}
              className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.5rem] !justify-between !rounded-none !transition-all !duration-500'>
              <div className="flex items-center gap-3">
                <LuImages className='text-[2rem]' />
                <span className="whitespace-nowrap">home slides</span>
              </div>
              <FaAngleDown className={`text-[1.3rem] transition-all duration-300 ${isInnerListOpen === 0 ? 'rotate-180' : 'rotate-0'}`} />
            </Button>
            <ul
              className="subMenu pl-6 overflow-hidden transition-all duration-350"
              ref={(el) => { innerList.current[0] = el }}
              style={{ maxHeight: isInnerListOpen === 0 ? `${innerList.current[0]?.scrollHeight}px` : 0 }}>
              <li>
                <Button
                  onClick={() => goto('/homeslides')}
                  className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.4rem] !justify-start !rounded-none !transition-all !duration-500'>
                  <span className='p-[3px] rounded-full bg-[#ababab]'></span>
                  <span className="whitespace-nowrap">home slides images</span>
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => goto('/homeslides/add')}
                  className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.4rem] !justify-start !rounded-none !transition-all !duration-500'>
                  <span className='p-[3px] rounded-full bg-[#ababab]'></span>
                  <span className="whitespace-nowrap">add home slides images</span>
                </Button>
              </li>
            </ul>
          </li>
          <li className="sidebarMenuItem">
            <Button
              onClick={() => handleOpenSubMenu(1)}
              className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.5rem] !justify-between !rounded-none !transition-all !duration-500'>
              <div className="flex items-center gap-3">
                <MdOutlineCategory className='text-[2rem]' />
                <span className="whitespace-nowrap">category</span>
              </div>
              <FaAngleDown className={`text-[1.3rem] transition-all duration-300 ${isInnerListOpen === 1 ? 'rotate-180' : 'rotate-0'}`} />
            </Button>
            <ul
              className="subMenu pl-6 overflow-hidden transition-all duration-350"
              ref={(el) => { innerList.current[1] = el }}
              style={{ maxHeight: isInnerListOpen === 1 ? `${innerList.current[1]?.scrollHeight}px` : 0 }}>
              <li>
                <Button
                  onClick={() => goto('/categories')}
                  className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.4rem] !justify-start !rounded-none !transition-all !duration-500'
                >
                  <span className='p-[3px] rounded-full bg-[#ababab]'></span>
                  <span className="whitespace-nowrap">category list</span>
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => goto('/categories/add')}
                  className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.4rem] !justify-start !rounded-none !transition-all !duration-500'
                >
                  <span className='p-[3px] rounded-full bg-[#ababab]'></span>
                  <span className="whitespace-nowrap">add category</span>
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => goto('/subcategories')}
                  className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.4rem] !justify-start !rounded-none !transition-all !duration-500'
                >
                  <span className='p-[3px] rounded-full bg-[#ababab]'></span>
                  <span className="whitespace-nowrap">sub category list</span>
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => goto('/subcategories/add')}
                  className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.4rem] !justify-start !rounded-none !transition-all !duration-500'
                >
                  <span className='p-[3px] rounded-full bg-[#ababab]'></span>
                  <span className="whitespace-nowrap">add sub category</span>
                </Button>
              </li>
            </ul>
          </li>
          <li className="sidebarMenuItem">
            <Button
              onClick={() => handleOpenSubMenu(2)}
              className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.5rem] !justify-between !rounded-none !transition-all !duration-500'>
              <div className="flex items-center gap-3">
                <BsBoxes className='text-[2rem]' />
                <span className="whitespace-nowrap">products</span>
              </div>
              <FaAngleDown className={`text-[1.3rem] transition-all duration-300 ${isInnerListOpen === 2 ? 'rotate-180' : 'rotate-0'}`} />
            </Button>
            <ul
              className="subMenu pl-6 overflow-hidden transition-all duration-350"
              ref={(el) => { innerList.current[2] = el }}
              style={{ maxHeight: isInnerListOpen === 2 ? `${innerList.current[2]?.scrollHeight}px` : 0 }}>
              <li>
                <Button
                  onClick={() => goto('/products')}
                  className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.4rem] !justify-start !rounded-none !transition-all !duration-500'
                >
                  <span className='p-[3px] rounded-full bg-[#ababab]'></span>
                  <span className="whitespace-nowrap">products list</span>
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => goto('/products/add')}
                  className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.4rem] !justify-start !rounded-none !transition-all !duration-500'
                >
                  <span className='p-[3px] rounded-full bg-[#ababab]'></span>
                  <span className="whitespace-nowrap">add product</span>
                </Button>
              </li>
            </ul>
          </li>
          <li className="sidebarMenuItem">
            <Button
              onClick={() => goto('/users')}
              className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.5rem] !justify-start !rounded-none !transition-all !duration-500'>
              <LuUsersRound className='text-[2rem]' />
              <span className="whitespace-nowrap">users</span>
            </Button>
          </li>
          <li className="sidebarMenuItem">
            <Button
              onClick={() => goto('/orders')}
              className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.5rem] !justify-start !rounded-none !transition-all !duration-500'>
              <LuShoppingBag className='text-[2rem]' />
              <span className="whitespace-nowrap">orders</span>
            </Button>
          </li>
          <li className="sidebarMenuItem">
            <Button
              onClick={() => handleOpenSubMenu(3)}
              className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.5rem] !justify-between !rounded-none !transition-all !duration-500'>
              <div className="flex items-center gap-3">
                <BsMegaphone className='text-[2rem]' />
                <span className="whitespace-nowrap">ads banner</span>
              </div>
              <FaAngleDown className={`text-[1.3rem] transition-all duration-300 ${isInnerListOpen === 3 ? 'rotate-180' : 'rotate-0'}`} />
            </Button>
            <ul
              className="subMenu pl-6 overflow-hidden transition-all duration-350"
              ref={(el) => { innerList.current[3] = el }}
              style={{ maxHeight: isInnerListOpen === 3 ? `${innerList.current[3]?.scrollHeight}px` : 0 }}>
              <li>
                <Button
                  onClick={() => goto('/adsbanner')}
                  className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.4rem] !justify-start !rounded-none !transition-all !duration-500'>
                  <span className='p-[3px] rounded-full bg-[#ababab]'></span>
                  <span className="whitespace-nowrap">ads banner list</span>
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => goto('/adsbanner/add')}
                  className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.4rem] !justify-start !rounded-none !transition-all !duration-500'>
                  <span className='p-[3px] rounded-full bg-[#ababab]'></span>
                  <span className="whitespace-nowrap">add ads banner</span>
                </Button>
              </li>
            </ul>
          </li>
          <li className="sidebarMenuItem">
            <Button
              onClick={() => handleOpenSubMenu(4)}
              className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.5rem] !justify-between !rounded-none !transition-all !duration-500'>
              <div className="flex items-center gap-3">
                <LuMessageSquareQuote className='text-[2rem]' />
                <span className="whitespace-nowrap">blog</span>
              </div>
              <FaAngleDown className={`text-[1.3rem] transition-all duration-300 ${isInnerListOpen === 4 ? 'rotate-180' : 'rotate-0'}`} />
            </Button>
            <ul
              className="subMenu pl-6 overflow-hidden transition-all duration-350"
              ref={(el) => { innerList.current[4] = el }}
              style={{ maxHeight: isInnerListOpen === 4 ? `${innerList.current[4]?.scrollHeight}px` : 0 }}>
              <li>
                <Button
                  onClick={() => goto('/blogs')}
                  className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.4rem] !justify-start !rounded-none !transition-all !duration-500'>
                  <span className='p-[3px] rounded-full bg-[#ababab]'></span>
                  <span className="whitespace-nowrap">blogs list</span>
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => goto('/blogs/add')}
                  className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.4rem] !justify-start !rounded-none !transition-all !duration-500'>
                  <span className='p-[3px] rounded-full bg-[#ababab]'></span>
                  <span className="whitespace-nowrap">add blog</span>
                </Button>
              </li>
            </ul>
          </li>
          <li className="sidebarMenuItem">
            <Button onClick={handleLogout} className='!min-w-auto !py-3 !px-6 dark-color !gap-3 !w-full !capitalize !text-[1.5rem] !justify-start !rounded-none !transition-all !duration-500'>
              <IoMdLogOut className='text-[2rem]' />
              <span className="whitespace-nowrap">log out</span>
            </Button>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default SideBar
