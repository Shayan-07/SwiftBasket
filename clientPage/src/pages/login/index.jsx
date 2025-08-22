import React, { useState, useContext } from 'react'
import { context } from '../../App'
import { useForm } from "react-hook-form"
import CustomTextField from '../../components/customTextField'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'

import { FcGoogle } from "react-icons/fc"

import firebase from '../../firebase'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"

const auth = getAuth(firebase)
const provider = new GoogleAuthProvider()

const Login = () => {

    const { setIsAuthenticated, setIsError, setIsSuccess, appURI } = useContext(context)

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
    } = useForm()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = (data) => {
        if (data) {
            const dataFields = {
                email: data.email,
                password: data.password
            }
            postData(`${appURI}/auth/login`, dataFields)
        }
    }

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result)
                const token = credential.accessToken

                const user = result.user
                const dataFields = {
                    name: user.displayName,
                    email: user.email,
                    isGoogleAuth: true
                }

                postData(`${appURI}/auth/google`, dataFields)

            }).catch(error => {
                setIsError('Something Went Wrong!')
                setIsSubmitting(false)
            })
    }

    const postData = (uri, body) => {
        setIsSubmitting(true)
        fetch(uri, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(response => response.json())
            .then(resData => {
                if (resData.success) {
                    setIsSubmitting(false)
                    setIsAuthenticated(true)
                    setIsSuccess("Logged In")
                    navigate('/')
                } else {
                    setIsSubmitting(false)
                    setIsError(resData.message)
                }

            })
            .catch(error => {
                setIsError('Something Went Wrong!')
                setIsSubmitting(false)
            })
    }

    const onError = (errors) => {
        const firstError = Object.values(errors)[0]
        if (firstError) {
            setIsError(firstError.message)
        }
    }

    return (
        <div className=' wrapper flex items-center h-[100vh]'>
            <div className="authForm mx-auto w-max">
                <div className='loginForm w-[32vw] text-[#3e3e3e] justify-center bg-white'>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className='py-10 px-14 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.3)]'>

                        <h2 className="text-[2.2rem] font-semibold mb-1">Welcome Back!</h2>
                        <p className="text-[1.4rem] text-[#777]">Log in to securely manage your account and enjoy a seamless shopping experience.</p>
                        <div className="flex flex-col gap-8 my-8">
                            <CustomTextField
                                type={'email'}
                                name={'email'}
                                label={'Email'}
                                {...register('email', { required: `Email is Required` })} />

                            <CustomTextField
                                type={'password'}
                                label={'Password'}
                                {...register('password', { required: `Password is Required` })}
                            />
                        </div>
                        <Link to={'/forgotpassword'} disabled={isSubmitting}
                            className={`
                            block text-[1.5rem] font-medium primary-hov w-max
                            ${isSubmitting ? 'opacity-60' : 'opacity-100'}
                        `}
                        >Forgot Password?
                        </Link>
                        <Button type='submit' disabled={isSubmitting}
                            className={`
                                !bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !mt-8 !my-4
                                ${isSubmitting ? 'opacity-60' : 'opacity-100'} 
                            `}>
                            Login
                        </Button>
                        <p className='flex gap-2 items-center justify-center tracking-[0.015em] mb-6'>
                            <span className='text-[1.4rem] font-[420] text-[#454545]'>Not Registered?</span>
                            <Link to={'/register'} className='primary-color font-medium text-[1.5rem]'>Sign Up</Link>
                        </p>
                        <p className='text-[1.4rem] font-medium text-[#454545] mb-5 text-center'>Or continue with social account</p>
                        <Button onClick={signInWithGoogle} disabled={isSubmitting}
                            className={`
                            !flex !justify-center !items-center !w-full !text-[#3e3e3e] !capitalize !py-5 !gap-4 !cursor-pointer !rounded-md 
                            !shadow-[0_0_3px_rgba(0,0,0,0.084),0_2px_3px_rgba(0,0,0,0.168)] !p-0 !min-w-auto !bg-[#f1f1f1] !leading-none !mb-5
                            ${isSubmitting ? 'opacity-60' : 'opacity-100'} 
                        `}
                        >
                            <FcGoogle className='text-[2.5rem] text-white' />
                            <span className='text-[1.5rem] font-[550]'>Continue with Google</span>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
