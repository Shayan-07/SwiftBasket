import { useContext, useState } from 'react'
import { styled, Badge, Button, Tooltip } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router-dom'
import { context } from '../../App'
import LogoutFunc from '../../helpers/logoutFunc'

import { RiMenu3Fill } from "react-icons/ri"
import { BiBell } from "react-icons/bi"
import { FaRegUser } from "react-icons/fa"
import { MdLogout } from "react-icons/md"

const Header = () => {

    const { isSidebarOpen, setIsError, setIsSuccess, setIsAuthenticated, appURI, setIsSidebarOpen, userData } = useContext(context)

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const navigate = useNavigate()

  const handleLogout = () => {
    LogoutFunc(appURI, setIsAuthenticated, setIsError, setIsSuccess, navigate)
  }

    const goTo = (url) => {
        navigate(`/${url}`)
    }

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: 6,
            top: 15,
            border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
            padding: '0 4px',
            background: '#ff5252'
        },
    }))

    return (
        <header className={`header dark-color shadow-md py-4 bg-white fixed top-0 z-50 transition-all duration-300 ${isSidebarOpen ? 'w-[80vw]' : 'w-full'}`}>
            <div className="wrapper">
                <div className='flex items-center justify-between'>
                    <div className="sideBarMenu">
                        <Tooltip title='Collapse Sidebar'>
                            <Button className='!min-w-auto !p-2.5 dark-color !leading-none !rounded-full' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                <RiMenu3Fill className='text-[2.7rem]' />
                            </Button>
                        </Tooltip>
                    </div>
                    <ul className='flex gap-10 items-center'>
                        <li>
                            <Tooltip title='Notification'>
                                <StyledBadge badgeContent={4} color="primary">
                                    <Button className='!min-w-auto !p-2.5 dark-color !leading-none !rounded-full'>
                                        <BiBell className='text-[2.7rem]' />
                                    </Button>
                                </StyledBadge>
                            </Tooltip>
                        </li>
                        <li>
                            <Button
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                className='!min-w-auto !p-2.5 !rounded-full'>
                                <img src={userData.avatar} alt="" className='w-[2.7rem] h-[2.7rem] object-cover object-top-left' />
                            </Button>

                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem
                                    onClick={() => {
                                        handleClose()
                                        goTo('profile')
                                    }}
                                    className='!py-3 !pr-32 !gap-3.5 !text-[1.4rem]'>
                                    <FaRegUser className='text-[1.7rem]' />
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    onClick={handleLogout}
                                    className='!py-3 !pr-32 !gap-3.5 !text-[1.4rem]'>
                                    <MdLogout className='text-[1.7rem]' />
                                    Logout
                                </MenuItem>
                            </Menu>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header
