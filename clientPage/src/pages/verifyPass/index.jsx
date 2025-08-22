import React, { useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { context } from '../../App'
import { Button } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { IoShieldCheckmarkOutline } from "react-icons/io5"

const VerifyPass = () => {

    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if (!location.state || !location.state.email) navigate(-1)
    }, [location, navigate])

    const { setResetFlow, setIsAuthenticated, setIsError, setIsSuccess, appURI } = useContext(context)

    const {
        register,
        handleSubmit,
        setFocus,
    } = useForm()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [isCoolDown, setIsCoolDown] = useState(parseInt(localStorage.getItem('PassCoolDown')) || 0)

    const onSubmit = (data) => {
        if (data) {
            setIsSubmitting(true)
            const otp = Object.values(data).map(d => d.trim()).join('')
            if (otp.length === 6 && otp.match(/^\d+$/)) {
                fetch(`${appURI}/auth/verifypassword`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ otp })
                }).then(response => response.json())
                    .then(resData => {
                        if (resData.success) {
                            setIsSubmitting(false)
                            setIsAuthenticated(true)
                            setResetFlow(true)
                            setIsSuccess('Verified')
                            if (localStorage.getItem('PassCoolDown')) {
                                localStorage.setItem('PassCoolDown', 0)
                            }
                            navigate("/resetpassword", { state: { email: resData.email }, replace: true })
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
    }

    const resend = () => {
        const email = location.state.email
        if (email) {
            if (isCoolDown === 0) {
                setIsResending(true)
                fetch(`${appURI}/auth/verifypassword/resendotp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                }).then(response => response.json())
                    .then(resData => {
                        if (resData.success) {
                            setIsResending(false)
                            setIsSuccess('Resended OTP')
                            localStorage.setItem('PassCoolDown', resData.coolDown)
                            setIsCoolDown(resData.coolDown)
                        } else {
                            setIsResending(false)
                            setIsError(resData.message)
                        }
                    }).catch(error => {
                        setIsError('Something Went Wrong!')
                        setIsResending(false)
                    })
            }
        }
    }

    const onError = (errors) => {
        if (errors) {
            setIsError("Invalid OTP")
        }
    }

    useEffect(() => {
        if (isCoolDown > 0) {
            const timer = setTimeout(() => {
                setIsCoolDown(prev => {
                    const newValue = prev - 1
                    localStorage.setItem('PassCoolDown', newValue)
                    return newValue
                })
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [isCoolDown])


    const handleInput = (e, index) => {
        let value = e.target.value

        if (isNaN(value)) {
            e.target.value = ''
            return
        }

        if (value.length > 1) {
            e.target.value = value[0]
        }

        if (value && index < 5) {
            setFocus(`otp_${index + 1}`)
        }
    }

    const handleKeyUp = (e, index) => {
        const key = e.key.toLowerCase()
        if ((key === 'backspace' || key === 'delete') && index > 0) {
            setFocus(`otp_${index - 1}`)
        }
    }

    return (
        <div className='wrapper flex items-center h-[100vh]'>
            <div className="authForm mx-auto w-max">
                <div className='verifyOTP w-[32vw] text-[#3e3e3e] flex flex-col justify-center bg-white'>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className='py-10 px-14 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.3)]'>
                        <h2 className="text-[2.2rem] font-semibold mb-2 flex gap-2 items-center">
                            <IoShieldCheckmarkOutline className='text-[3.5rem]' />
                            <span>Verify OTP</span>
                        </h2>
                        <p className="text-[1.4rem] text-[#777] mb-8">
                            Enter the verification code sent to {location.state?.email}.
                        </p>

                        <div className="flex justify-center items-center">
                            <div className="flex flex-wrap gap-4" id="inputs">
                                {Array(6).fill().map((_, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        autoComplete="off"
                                        {...register(`otp_${i}`, { required: true, maxLength: { value: 1, message: 'Invalid Approach' } })}
                                        onInput={(e) => handleInput(e, i)}
                                        onKeyUp={(e) => handleKeyUp(e, i)}
                                        className="w-[6rem] h-[6rem] rounded-lg text-center text-[3rem] font-medium text-[#5f5f5f] bg-[rgba(227,227,227)] focus:text-[#222]"
                                    />
                                ))}
                            </div>
                        </div>

                        <Button type='submit' disabled={isSubmitting}
                            className={`
                            !bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !mt-8 !mb-4
                            ${isSubmitting ? 'opacity-60' : 'opacity-100'}
                        `}>
                            Verify
                        </Button>

                        <p className='flex gap-2 items-center justify-center tracking-[0.015em] mb-2'>
                            <span className='text-[1.4rem] font-[420] text-[#454545]'>Didn't Receive Code?</span>
                            <button onClick={resend} type='button' disabled={isResending || isCoolDown > 0 || isSubmitting}
                                className={`
                                primary-color font-medium text-[1.5rem] cursor-pointer
                                ${isResending || isCoolDown > 0 ? 'opacity-60' : 'opacity-100'}
                            `} >
                                Resend OTP
                            </button>
                            {isCoolDown > 0 && <p className='primary-color font-medium text-[1.5rem]'>({isCoolDown}s)</p>}
                        </p>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default VerifyPass
