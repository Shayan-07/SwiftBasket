import { useState, useContext } from 'react'
import { context } from '../../App'
import CustomTextField from '../customTextField'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'

import { FiEdit } from "react-icons/fi"

const ProfileForm = ({ handleShowPasswordBox }) => {

    const { setIsError, setIsSuccess, userData, setUserData, appURI } = useContext(context)
    
    const {
        register,
        handleSubmit,
        watch
    } = useForm({
        defaultValues: { username: userData.name || '' }
    })
    
    const watchedUsername = watch('username')
    const isChanged = watchedUsername !== userData.name

    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = (data) => {
        setIsSubmitting(true)
        fetch(`${appURI}/user/username`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: data.username }),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setUserData(resData.data)
                    setIsSuccess(resData.message)
                } else {
                    if (resData.message !== '') {
                        setIsError(resData.message)
                    }
                }
            })
            .catch((error) => {
                setIsError(error.message || 'Something went wrong!')
            })
            .finally(() => setIsSubmitting(false))
    }

    const onError = (errors) => {
        const firstError = Object.values(errors)[0]
        if (firstError) {
            setIsError(firstError.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)} className={`w-full h-max bg-white rounded-2xl pt-10 pb-12 px-8`}>
            <div className="flex justify-between items-center mb-12">
                <h2 className='text-[2rem] font-[600]'>My Profile</h2>
                {!userData?.isGoogleAuth &&
                    <Button className='!text-[#3e3e3e] !min-w-auto !rounded-none !py-3 !px-5 !leading-none !capitalize hover:!text-[#ff5252] !transition-all !duration-300'
                        onClick={handleShowPasswordBox}>
                        <FiEdit className='text-[1.7rem]' />
                        <p className='text-[1.4rem] font-medium'>Change Password</p>
                    </Button>}

            </div>
            <div className="userInfoInputBox z-5 relative flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-[2rem]">
                    <CustomTextField
                        label="Username"
                        variant="outlined"
                        name='username'
                        {...register('username', {
                            required: `Username is Required`,
                            maxLength: { value: 25, message: `Username can't be more than 25 characters` }
                        })}
                    />

                    <CustomTextField id="outlined-disabled"
                        label="Email"
                        variant="outlined"
                        name='email'
                        value={userData.email}
                        disabled
                    />
                </div>

                <Button
                    type='submit'
                    disabled={!isChanged || isSubmitting}
                    className={`!bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !my-4 disabled:!opacity-60 disabled:!cursor-not-allowed`}
                >
                    Update Profile
                </Button>
            </div>
        </form>
    )
}

export default ProfileForm
