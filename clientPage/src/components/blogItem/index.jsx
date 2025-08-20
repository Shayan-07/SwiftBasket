import React from 'react'
import { Link } from 'react-router-dom'
import { FaAngleRight } from "react-icons/fa6"
import { AiOutlineClockCircle } from "react-icons/ai"

const BlogItem = ({id, imgUrl, date, title, desc}) => {
    return (
        <div className="blogItem text-[#3e3e3e] group rounded-4xl mb-[10px]">
            <div className="blogImg rounded-t-xl overflow-hidden">
                <Link to={`/blog/${id}`} className='relative'>
                    <img src={imgUrl} alt="" className='object-center group-hover:scale-[1.1] group-hover:rotate-2 transition-all duration-200 w-full' />

                    <div className="flex items-center gap-2 py-2 px-3 primary-bg rounded-lg text-white text-[1.2rem] font-medium absolute bottom-6 right-6">
                        <span> <AiOutlineClockCircle className='text-[1.8rem]' /> </span>
                        <span>{date.split('T')[0]}</span>
                    </div>
                </Link>
            </div>
            <div className="blogText flex flex-col gap-4 p-4 shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                <h3 className='truncate'>
                    <Link to={`/blog/${id}`} className='text-[1.6rem] font-bold capitalize primary-hov'>{title}</Link>
                </h3>
                <p className='line-clamp-3 text-[1.3rem] font-medium text-[#666]'>{desc.replace(/<[^>]+>/g, '')}</p>
                <Link to={`/blog/${id}`} className='text-[1.4rem] font-medium flex gap-2 items-center primary-hov w-max'>
                    <span>Read More</span>
                    <FaAngleRight className='text-[1.2rem]' />
                </Link>
            </div>
        </div>
    )
}

export default BlogItem
