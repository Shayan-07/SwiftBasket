import React, { useState, useContext } from 'react'
import { context } from '../../App'
import { useForm } from "react-hook-form"
import CustomTextField from '../../components/customTextField'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'

import { MdOutlineKeyboardBackspace } from "react-icons/md";

const ForgotPassword = () => {

    const { setIsError, setIsSuccess, appURI } = useContext(context)

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
    } = useForm();

    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = (data) => {
        setIsSubmitting(true)
        fetch(`${appURI}/auth/forgotpassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: data.email })
        }).then(response => response.json())
            .then(resData => {
                if (resData.success) {
                    setIsSubmitting(false)
                    setIsSuccess(`OTP sent to ${resData.email}`)
                    navigate("/verifypass", { state: { email: resData.email }, replace: true })
                } else {
                    setIsSubmitting(false)
                    setIsError(resData.message)
                }
            }).catch(error => {
                setIsError('Something Went Wrong!')
                setIsSubmitting(false)
            })
    }

    const onError = (errors) => {
        const firstError = Object.values(errors)[0]
        if (firstError) {
            setIsError(firstError.message);
        }
    };

    return (
        <div className="wrapper">
            <div className='forgotPassword w-[35%] text-[#3e3e3e] justify-center m-auto'>
                <form onSubmit={handleSubmit(onSubmit, onError)} className='my-15 py-10 px-14 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.3)]'>
                    <h2 className="text-[2.2rem] font-semibold mb-1">Forgot Password!</h2>
                    <p className="text-[1.4rem] text-[#777] mb-6">Kindly enter your Email so we can send you an OTP</p>
                    <CustomTextField
                        type={'email'}
                        label={'Email'}
                        {...register('email', { required: 'Email is Required' })} />
                    <Button type='submit' disabled={isSubmitting}
                        className={`
                                !bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !mt-8 !my-4
                                ${isSubmitting ? 'opacity-60' : 'opacity-100'} 
                            `}>
                        Send OTP
                    </Button>
                    <Link to={'/login'} className='text-[1.5rem] font-medium primary-hov flex items-center justify-center gap-2 mt-4'>
                        <MdOutlineKeyboardBackspace className='text-[1.7rem]' />
                        <span>Back To Login</span>
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword
