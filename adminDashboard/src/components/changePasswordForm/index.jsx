import { useState, useContext } from 'react'
import { context } from '../../App'
import Button from '@mui/material/Button'
import CustomTextField from '../customTextField'
import { useForm } from 'react-hook-form'

import { MdOutlineClose } from "react-icons/md"

const ChangePasswordForm = ({ showPasswordBox, setShowPasswordBox }) => {

    const { setIsError, setIsSuccess, appURI } = useContext(context)

    const {
        register,
        handleSubmit,
        reset
    } = useForm()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = (data) => {
        setIsSubmitting(true)
        fetch(`${appURI}/user/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                currentPassword: data.currentPass,
                newPassword: data.newPass
             }),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setIsSuccess(resData.message)
                    setShowPasswordBox(true)
                    reset()
                } else {
                    if (resData.message !== '') {
                        setIsError(resData.message)
                    }
                }
            })
            .catch((error) => {
                setIsError(error.messgae ||'Something went wrong!')
            })
            .finally(() => setIsSubmitting(false))
    }

    const onError = (errors) => {
        const firstError = Object.values(errors)[0]
        if (firstError) {
            setIsError(firstError.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)}
            className={`w-full overflow-hidden bg-white rounded-2xl px-8 transition-all duration-800 ${showPasswordBox ? 'max-h-0' : 'max-h-[999px]'}`}>
            <div className="flex justify-between items-center mb-12 pt-10">
                <h2 className='text-[2rem] font-[600]'>Change Password</h2>
                <Button className='!text-[#3e3e3e] !min-w-auto !rounded-full !p-3 !leading-none' onClick={() => setShowPasswordBox(true)}>
                    <MdOutlineClose className='text-[1.7rem]' />
                </Button>

            </div>
            <div className="changePass z-5 relative flex flex-col gap-8 pb-12">
                <div className="grid grid-cols-2 gap-[2rem]">
                    <CustomTextField
                        type='password'
                        label="Current Password"
                        variant="outlined"
                        {...register('currentPass', { required: `Kindly fill the Current Password field` })}
                    />
                    <CustomTextField
                        type='password'
                        label="New Password"
                        variant="outlined"
                        {...register('newPass', {
                            required: `Kindly add a New Password`,
                            minLength: {
                                value: 8,
                                message: `Password must be atleast 8 characters`
                            }
                        })}
                    />
                </div>
                <Button type='submit'
                    className={`!bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !my-4
                  ${isSubmitting ? '!opacity-60 !cursor-not-allowed' : '!opacity-100 !cursor-pointer'}`}
                    disabled={(isSubmitting)}>
                    Change Password
                </Button>
            </div>
        </form>
    )
}

export default ChangePasswordForm
