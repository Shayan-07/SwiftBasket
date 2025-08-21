import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { LiaShippingFastSolid } from "react-icons/lia";
import { GoGift } from "react-icons/go";
import { BiSupport } from "react-icons/bi";
import { IoChatboxOutline } from "react-icons/io5";
import { PiKeyReturn } from "react-icons/pi";
import { SlWallet } from "react-icons/sl";
import { FaXTwitter , FaPinterestP , FaLinkedinIn , FaInstagram  } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className='bg-[#f7f7f7]'>
            <div className="wrapper">
                <div className="perks flex justify-center items-center gap-36  py-16">
                    <div className="perk text-[#3e3e3e] flex flex-col gap-2 items-center group">
                        <LiaShippingFastSolid className='text-[4rem] group-hover:text-[#ff5252] group-hover:-translate-y-3 transition-all duration-200 relative' />
                        <h3 className='text-[1.6rem] font-[600]'>Free Shipping</h3>
                        <p className='text-[1.2rem] font-medium'>For All Orders Over $50</p>
                    </div>
                    <div className="perk text-[#3e3e3e] flex flex-col gap-2 items-center group">
                        <PiKeyReturn className='text-[4rem] group-hover:text-[#ff5252] group-hover:-translate-y-3 transition-all duration-200 relative' />
                        <h3 className='text-[1.6rem] font-[600]'>30 Days Returns</h3>
                        <p className='text-[1.2rem] font-medium'>For an Exchange Product</p>
                    </div>
                    <div className="perk text-[#3e3e3e] flex flex-col gap-2 items-center group">
                        <SlWallet className='text-[4rem] group-hover:text-[#ff5252] group-hover:-translate-y-3 transition-all duration-200 relative' />
                        <h3 className='text-[1.6rem] font-[600]'>Secured Payment</h3>
                        <p className='text-[1.2rem] font-medium'>Payment Cards Accepted</p>
                    </div>
                    <div className="perk text-[#3e3e3e] flex flex-col gap-2 items-center group">
                        <GoGift className='text-[4rem] group-hover:text-[#ff5252] group-hover:-translate-y-3 transition-all duration-200 relative' />
                        <h3 className='text-[1.6rem] font-[600]'>Special Gifts</h3>
                        <p className='text-[1.2rem] font-medium'>Our First Product Order</p>
                    </div>
                    <div className="perk text-[#3e3e3e] flex flex-col gap-2 items-center group">
                        <BiSupport className='text-[4rem] group-hover:text-[#ff5252] group-hover:-translate-y-3 transition-all duration-200 relative' />
                        <h3 className='text-[1.6rem] font-[600]'>Support 24/7</h3>
                        <p className='text-[1.2rem] font-medium'>Contact us Anytime</p>
                    </div>
                </div>
                <hr className='text-[#ddd]' />
                <div className="footer py-16 grid grid-cols-[25%_40%_30%] justify-between text-[#3e3e3e]">
                    <div className="footerItem flex flex-col gap-5">
                        <h2 className='text-[2.4rem] font-[600]'>Contact Us</h2>
                        <p className='text-[1.3rem] font-medium text-[#777]'>Classyshop - Mega Super Store 507-Union Trade Centre France</p>
                        <Link to={'mailto:someone@example.com'} className='text-[1.3rem] font-[600] primary-hov'>sales@yourcompany.com</Link>
                        <h3 className='text-[2rem] font-bold primary-color'>(+91) 9876-543-210</h3>
                        <div className="flex items-center gap-3">
                            <IoChatboxOutline className='text-[5rem] primary-color' />
                            <ul className='text-[1.5rem] font-[600]'>
                                <li>Online Chat</li>
                                <li>Get Expert Help</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footerItem grid grid-cols-2 pl-10 border-l border-[#ddd]">
                        <div className="footerPrList">
                            <h2 className='text-[2.4rem] font-[600] mb-5'>Products</h2>
                            <ul className='text-[1.4rem] font-medium flex flex-col gap-3'>
                                <li>
                                    <Link className='primary-hov'>Prices drop</Link>
                                </li>
                                <li>
                                    <Link className='primary-hov'>New products</Link>
                                </li>
                                <li>
                                    <Link className='primary-hov'>Best sales</Link>
                                </li>
                                <li>
                                    <Link className='primary-hov'>Contact us</Link>
                                </li>
                                <li>
                                    <Link className='primary-hov'>Sitemap</Link>
                                </li>
                                <li>
                                    <Link className='primary-hov'>Stores</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footerPgList">
                            <h2 className='text-[2.4rem] font-[600] mb-5'>Our company</h2>
                            <ul className='text-[1.4rem] font-medium flex flex-col gap-3'>
                                <li>
                                    <Link className='primary-hov'>Delivery</Link>
                                </li>
                                <li>
                                    <Link className='primary-hov'>Legal Notice</Link>
                                </li>
                                <li>
                                    <Link className='primary-hov'>Terms and conditions of use</Link>
                                </li>
                                <li>
                                    <Link className='primary-hov'>About us</Link>
                                </li>
                                <li>
                                    <Link className='primary-hov'>Secure payment</Link>
                                </li>
                                <li>
                                    <Link className='primary-hov'>Login</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footerItem flex flex-col gap-6">
                        <h2 className='text-[2.4rem] font-[600]'>Contact Us</h2>
                        <p className='text-[1.4rem]'>Subscribe to our latest newsletter to get news about special discounts.</p>
                        <form className='flex flex-col gap-2'>
                            <div className="subscribe flex">
                                <input type="email"
                                    id='footer'
                                    className='text-[1.4rem] py-3 px-4 border border-r-0 border-[#ddd] rounded-l-lg focus:border-[#ff5252] w-full font-medium'
                                    placeholder='Your Email Address' />
                                <Button className='primary-bg !text-white !text-[1.4rem] !py-3 !px-4 !min-w-auto !rounded-l-none'>Subscribe</Button>
                            </div>
                            <FormControlLabel
                                required
                                control={
                                    <Checkbox
                                        sx={{
                                            '&.Mui-checked': {
                                                color: '#ff5252',
                                            },
                                        }}
                                    />
                                }
                                label="I agree to the terms and conditions and the privacy policy"
                            />
                        </form>
                    </div>
                </div>
            </div>
            <div className="bottom-strip border-t border-[#ddd] bg-white py-6">
                <div className="wrapper flex items-center justify-between">
                    <div className="social flex gap-3">
                        <span className='text-[1.7rem] border border-[#3e3e3e] text-[#3e3e3e] p-3 cursor-pointer rounded-full transition-colors duration-200 hover:text-white hover:bg-[#ff5252] hover:border-[#ff5252]'>
                            <FaXTwitter/>
                        </span>
                        <span className='text-[1.7rem] border border-[#3e3e3e] text-[#3e3e3e] p-3 cursor-pointer rounded-full transition-colors duration-200 hover:text-white hover:bg-[#ff5252] hover:border-[#ff5252]'>
                            <FaPinterestP/>
                        </span>
                        <span className='text-[1.7rem] border border-[#3e3e3e] text-[#3e3e3e] p-3 cursor-pointer rounded-full transition-colors duration-200 hover:text-white hover:bg-[#ff5252] hover:border-[#ff5252]'>
                            <FaLinkedinIn/>
                        </span>
                        <span className='text-[1.7rem] border border-[#3e3e3e] text-[#3e3e3e] p-3 cursor-pointer rounded-full transition-colors duration-200 hover:text-white hover:bg-[#ff5252] hover:border-[#ff5252]'>
                            <FaInstagram/>
                        </span>
                    </div>
                    <p className='text-[1.3rem] text-[#666] font-medium'>© 2025 All rights reserved, Created by: Muhammad Shayan</p>
                    <div className="payMethod flex gap-3">
                        <span>
                            <img src="img/pay-method1.png" alt="" />
                        </span>
                        <span>
                            <img src="img/pay-method2.png" alt="" />
                        </span>
                        <span>
                            <img src="img/pay-method3.png" alt="" />
                        </span>
                        <span>
                            <img src="img/pay-method4.png" alt="" />
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
