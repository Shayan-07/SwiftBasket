import React, { useState, useContext, useEffect } from 'react'
import { context } from '../../App'
import { useForm } from "react-hook-form"
import CustomTextField from '../../components/customTextField'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'

import { RiHome2Line } from "react-icons/ri";

const ResetPassword = () => {

    const { resetFlow, setResetFlow, setIsError, setIsSuccess, appURI } = useContext(context)

    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if (!location || !location.state.email || !resetFlow) {
            navigate(-1)
        }
    }, [location, navigate])

    const {
        register,
        handleSubmit,
    } = useForm()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = (data) => {
        if (data) {
            setIsSubmitting(true)
            fetch(`${appURI}/auth/resetpassword`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: location.state.email,
                    password: data.newPass
                })
            }).then(response => response.json())
                .then(resData => {
                    if (resData.success) {
                        setIsSubmitting(false)
                        setResetFlow(false)
                        setIsSuccess("Password Reset Successfully")
                        navigate('/', { replace: true })
                    } else {
                        setIsSubmitting(false)
                        setIsError(resData.message)
                    }
                }).catch(error => {
                        setIsError('Something Went Wrong!')
                        setIsSubmitting(false)
                    })
        }
    }

    const onError = (errors) => {
        const firstError = Object.values(errors)[0]
        if (firstError) {
            setIsError(firstError.message);
        }
    };

    const goTo = (url) => {
        location.state.email = undefined
        setResetFlow(false)
        navigate(url, { replace: true })
    }

    return (
        <div className=' wrapper flex items-center h-[100vh]'>
            <div className="authForm mx-auto w-max">
                <div className='resetpassword w-[32vw] text-[#3e3e3e] justify-center bg-white'>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className='py-10 px-14 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.3)]'>

                        <h2 className="text-[2.2rem] font-semibold mb-1">Reset Password</h2>
                        <p className="text-[1.4rem] text-[#777] mb-6">To protect your account, Please create a new password.</p>
                        <CustomTextField
                            type={'password'}
                            label={'New Password'}
                            {...register('newPass', {
                                required: `Kindly fill the Password field`,
                                minLength: {
                                    value: 8,
                                    message: `Password must be atleast 8 characters`
                                }
                            })}
                        />
                        <Button type='submit' disabled={isSubmitting}
                            className={`
                                !bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !mb-4 !mt-6
                                ${isSubmitting ? 'opacity-60' : 'opacity-100'} 
                            `}>
                            Reset Password
                        </Button>
                        <Link onClick={() => goTo('/')} disabled={isSubmitting}
                            className={`
                                text-[1.5rem] font-medium primary-hov flex items-center justify-center gap-2 mt-4
                                ${isSubmitting ? 'opacity-60' : 'opacity-100'}
                            `}>
                            <RiHome2Line className='text-[1.7rem]' />
                            <span>Go to Home</span>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
