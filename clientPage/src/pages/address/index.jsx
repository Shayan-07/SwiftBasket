import { useState, useContext } from 'react'
import UserAccoutBoxModel from '../../components/userAccoutBoxModel'
import { Button, Skeleton } from '@mui/material'
import AddressDrawer from '../../components/addressDrawer'
import { useForm } from "react-hook-form"
import AddressCard from '../../components/addressCard'
import { context } from '../../App'

import { MdOutlineAddLocationAlt } from "react-icons/md"
import UploadData from '../../helpers/uploadDataFunc'

const Address = () => {

    const { setIsError, setIsSuccess, appURI, addresses, setAddresses, isAddressLoading } = useContext(context)

    const {
        register,
        handleSubmit,
        reset,
        control
    } = useForm()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (data) => {
        if (!data) return

        const payload = {
            addressLine: data.addressLine,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            landmark: data.landmark,
            phone: data.phone,
            addressOf: data.addressOf
        }

        const success = await UploadData(
            setAddresses,
            setIsSubmitting,
            setIsError,
            setIsSuccess,
            appURI,
            'address',
            payload,
            reset
        )

        if (success) {
            toggleDrawer(false)
        }
    }


    const onError = (errors) => {
        const firstError = Object.values(errors)[0]
        if (firstError) {
            setIsError(firstError.message)
        }
    }

    const [openDrawer, setOpenDrawer] = useState(false)

    const toggleDrawer = (newOpen) => {
        setOpenDrawer(newOpen)
    }

    return (
        <div className='addAddress py-16 bg-[rgba(0,0,0,0.05)]'>
            <div className="wrapper">
                <div className="addressContainer grid grid-cols-[25%_73%] justify-between text-[#3e3e3e]">
                    <div className="boxModel">
                        <UserAccoutBoxModel />
                    </div>
                    <div className="addressBox w-[60%] h-max bg-white rounded-2xl pt-10 pb-12 px-8 text-[#3e3e3e]">
                        <h2 className='text-[2rem] font-[600] mb-5'>Adderss</h2>
                        <div className="addAddressBtn mb-10">
                            <Button className='!min-w-auto !border !border-dashed !border-[rgba(0,0,0,0.2)] !bg-[#f1faff] hover:!bg-[#e7f3f9] !text-[#aab7bd] !transition-colors !duration-200 !leading-none gap-4 w-full !py-6 !rounded-lg' onClick={() => toggleDrawer(true)}>
                                <MdOutlineAddLocationAlt className='text-[4rem]' />
                                <p className='text-[1.5rem] font-[600]'>Add Adderss</p>
                            </Button>

                            <AddressDrawer
                                toggleDrawer={toggleDrawer}
                                openDrawer={openDrawer}
                                onSubmit={onSubmit}
                                onError={onError}
                                handleSubmit={handleSubmit}
                                register={register}
                                isSubmitting={isSubmitting}
                                control={control}
                            />

                        </div>
                        <div className="addresses">
                            {isAddressLoading ?
                                <div className="address border border-dashed border-[rgba(0,0,0,0.2)] py-4 px-6 rounded-lg flex justify-between items-center mt-5">
                                    <div className="addressText w-full">
                                        <div className="mb-2">
                                            <Skeleton variant="rectangular" width={80} height={24} />
                                        </div>
                                        <div className="flex gap-3 items-center mb-2">
                                            <Skeleton variant="text" width={100} height={20} />
                                            <Skeleton variant="text" width={120} height={20} />
                                        </div>
                                        <div>
                                            <Skeleton variant="text" width="70%" height={18} />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <Skeleton variant="rectangular" width={24} height={24} sx={{ borderRadius: '4px' }} />
                                    </div>
                                </div>
                                :
                                addresses.map(address => {
                                    return (
                                        <AddressCard menu={true} address={address} setData={setAddresses} key={address._id} />
                                    )
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Address
