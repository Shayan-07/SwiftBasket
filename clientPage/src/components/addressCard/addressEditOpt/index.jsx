import { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Tooltip } from '@mui/material'
import { FiEdit } from "react-icons/fi"

import AddressDrawer from '../../addressDrawer'
import UpdateData from '../../../helpers/updateDataFunc'
import { context } from '../../../App'

const AddressEditOpt = ({ address, setData }) => {
    const [openDrawer, setOpenDrawer] = useState(false)

    const toggleDrawer = (newOpen) => {
        setOpenDrawer(newOpen)
    }

    const { setIsError, setIsSuccess, appURI } = useContext(context)

    const {
        register,
        handleSubmit,
        reset,
        control
    } = useForm()

    useEffect(() => {
        if (address) {
            const defaultValues = {}
            Object.keys(address).forEach(key => {
                defaultValues[key] = typeof address[key] === 'object' ? address[key]?._id : String(address[key])
            })
            reset(defaultValues)
        }
    }, [address])

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

        await UpdateData(
            'address',
            address._id,
            payload,
            setData,
            setIsSubmitting,
            setIsError,
            setIsSuccess,
            appURI,
            reset
        )

        toggleDrawer(false)
    }


    const onError = (errors) => {
        const firstError = Object.values(errors)[0]
        if (firstError) {
            setIsError(firstError.message)
        }
    }

    return (
        <>
            <Tooltip title={'Edit'} aria-label='readonly'>
                <Button className='!text-[#3e3e3e] !rounded-full !min-w-auto !p-3' onClick={() => toggleDrawer(true)}>
                    <FiEdit className='text-[2rem]' />
                </Button>
            </Tooltip>

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
        </>
    )
}

export default AddressEditOpt
