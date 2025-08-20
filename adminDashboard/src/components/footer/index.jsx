import React, { useContext } from 'react';
import { context } from '../../App';

import { FaXTwitter, FaPinterestP, FaLinkedinIn, FaInstagram } from "react-icons/fa6";

const Footer = () => {
    const { isSidebarOpen } = useContext(context)

    return (
        <footer className={`footer bg-[#f1f1f1] mt-10 border-t border-[#cacaca] transition-all duration-300 ${isSidebarOpen ? 'w-[80vw]' : 'w-full'}`}>
            <div className="wrapper">
                <div className="border-t border-[#ddd] py-6">
                    <div className="flex items-center justify-between">
                        <div className="social flex gap-3 dark-color">
                            <span className='text-[1.7rem] border border-[#3e3e3e] p-3 cursor-pointer rounded-full transition-colors duration-200 hover:text-white hover:bg-[#ff5252] hover:border-[#ff5252]'>
                                <FaXTwitter />
                            </span>
                            <span className='text-[1.7rem] border border-[#3e3e3e] p-3 cursor-pointer rounded-full transition-colors duration-200 hover:text-white hover:bg-[#ff5252] hover:border-[#ff5252]'>
                                <FaPinterestP />
                            </span>
                            <span className='text-[1.7rem] border border-[#3e3e3e] p-3 cursor-pointer rounded-full transition-colors duration-200 hover:text-white hover:bg-[#ff5252] hover:border-[#ff5252]'>
                                <FaLinkedinIn />
                            </span>
                            <span className='text-[1.7rem] border border-[#3e3e3e] p-3 cursor-pointer rounded-full transition-colors duration-200 hover:text-white hover:bg-[#ff5252] hover:border-[#ff5252]'>
                                <FaInstagram />
                            </span>
                        </div>
                        <p className='text-[1.3rem] text-[#666] font-medium'>© 2025 All rights reserved, Created by: Muhammad Shayan</p>
                        <div className="payMethod flex gap-3">
                            <span>
                                <img src="/img/pay-method1.png" alt="" />
                            </span>
                            <span>
                                <img src="/img/pay-method2.png" alt="" />
                            </span>
                            <span>
                                <img src="/img/pay-method3.png" alt="" />
                            </span>
                            <span>
                                <img src="/img/pay-method4.png" alt="" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    )
}

export default Footer
