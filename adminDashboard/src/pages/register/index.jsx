import React, { useState, useContext } from 'react'
import { context } from '../../App'
import { useForm } from "react-hook-form"
import CustomTextField from '../../components/customTextField'
import { Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa"
import firebase from '../../firebase'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"

const auth = getAuth(firebase)
const provider = new GoogleAuthProvider()

const Register = () => {

    const { setIsError, setIsSuccess, appURI, setIsAuthenticated } = useContext(context)

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
    } = useForm()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = (data) => {
        if (data) {
            const dataFields = {
                name: data.username,
                email: data.email,
                password: data.password,
                role: 'admin'
            }
            postData(`${appURI}/auth/register`, dataFields, () => {
                navigate('/verifyemail', { state: { email: data.email } })
            })
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
                    password: null,
                    avatar: user.photoURL,
                    isGoogleAuth: true,
                    role: 'admin'
                }

                postData(`${appURI}/auth/google`, dataFields, () => navigate('/'))

            }).catch(error => {
                setIsError('Something went wrong!')
                setIsSubmitting(false)
            })
    }

    const postData = (uri, body, navigate) => {
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
                    setIsSuccess(resData.message)
                    setIsAuthenticated(resData.auth || false)
                    navigate()
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
            setIsError(firstError.message)
        }
    }

    return (
        <div className=' wrapper'>
            <div className="authForm my-10 mx-auto w-max">
                <div className='registerForm w-[32vw] text-[#3e3e3e] justify-center bg-white'>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className='py-10 px-14 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.3)]'>
                        <h2 className="text-[2.2rem] font-semibold mb-1">Join Us Today</h2>
                        <p className="text-[1.4rem] font-medium text-[#777]">
                            Start your journey with us — one account, endless possibilities. Deals, Discoveries, & Dopamine.
                        </p>
                        <div className="flex flex-col gap-8 my-8">
                            <CustomTextField
                                label="Username"
                                name='username'
                                {...register('username', {
                                    required: `Kindly fill the Username field`,
                                    maxLength: { value: 25, message: `Username can't be more than 25 characters` }
                                })}
                            />

                            <CustomTextField
                                type={'email'}
                                name={'email'}
                                label={'Email'}
                                {...register('email', { required: `Kindly fill the Email Field` })} />

                            <CustomTextField
                                type={'password'}
                                label={'New Password'}
                                {...register('password', {
                                    required: `Kindly fill the Password field`,
                                    minLength: {
                                        value: 8,
                                        message: `Password must be atleast 8 characters`
                                    }
                                })}
                            />
                        </div>
                        <Button type='submit' disabled={isSubmitting}
                            className={`
                            !bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !mt-8 !my-4
                            ${isSubmitting ? 'opacity-60' : 'opacity-100'} 
                        `}
                        >
                            Register
                        </Button>
                        <p className='flex gap-2 items-center justify-center tracking-[0.015em] mb-6'>
                            <span className='text-[1.4rem] font-[420] text-[#454545]'>Already have an account?</span>
                            <Link to={'/login'} disabled={isSubmitting}
                                className={`
                                primary-color font-medium text-[1.5rem]
                                ${isSubmitting ? 'opacity-60' : 'opacity-100'}
                            `}
                            >Login
                            </Link>
                        </p>
                        <p className='text-[1.4rem] font-medium text-[#454545] mb-5 text-center'>Or continue with Google</p>
                        <Button
                            onClick={signInWithGoogle}
                            className="!flex !justify-center !items-center !w-full !text-[#3e3e3e] !capitalize !py-5 !gap-4 !cursor-pointer !rounded-md 
                            !shadow-[0_0_3px_rgba(0,0,0,0.084),0_2px_3px_rgba(0,0,0,0.168)] !p-0 !min-w-auto !bg-[#f1f1f1] !leading-none !mb-5">
                            <FcGoogle className='text-[2.5rem] text-white' />
                            <span className='text-[1.5rem] font-[550]'>Continue with Google</span>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
