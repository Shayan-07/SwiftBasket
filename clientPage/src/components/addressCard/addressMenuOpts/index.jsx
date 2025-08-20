import { useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { IoMdMore } from "react-icons/io"
import { AiOutlineDelete } from 'react-icons/ai'
import { FaRegEdit } from "react-icons/fa"
import { Button, Menu, CircularProgress } from '@mui/material'
import AddressDrawer from '../../addressDrawer'
import { context } from '../../../App'
import UpdateData from '../../../helpers/updateDataFunc'
import DeleteSingleData from '../../../helpers/deleteSingleData'

const AddressMenuOpts = ({ address, setData }) => {

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const [openDrawer, setOpenDrawer] = useState(false)

    const toggleDrawer = (newOpen) => {
        setOpenDrawer(newOpen)
        setAnchorEl(null)
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

    const [isDeleting, setIsDeleting] = useState(false)

    const deleteAddress = async (id) => {
        if (!id) return
        const deleteAddress = await DeleteSingleData(setData, setIsDeleting, setIsError, setIsSuccess, appURI, 'address', id)

        if (deleteAddress) handleClose()
    }

    return (
        <>
            <Button className='!text-[#3e3e3e] !rounded-full !min-w-auto !p-3'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}>
                <IoMdMore className='text-[2rem]' />
            </Button>

            <Menu id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}>
                <Button
                    onClick={() => toggleDrawer(true)}
                    className='!min-w-auto !px-6 !rounded-none w-full !text-[#3e3e3e] !flex !items-center !justify-start gap-3'>
                    <FaRegEdit className='text-[1.7rem]' />
                    <p className='text-[1.3rem] font-medium'>Edit</p>
                </Button>
                <Button
                    disabled={isDeleting}
                    onClick={() => deleteAddress(address._id)}
                    className='!min-w-auto !px-6 !rounded-none w-full !text-[#3e3e3e] !flex !items-center !justify-start gap-3 disabled:opacity-60 disabled:select-none'
                >
                    {isDeleting ? (
                        <CircularProgress
                            size={15}
                            thickness={3}
                            sx={{ color: '#333' }}
                        />
                    ) : (
                        <AiOutlineDelete className='text-[1.7rem]' />
                    )}
                    <p className='text-[1.3rem] font-medium'>Delete</p>
                </Button>

            </Menu>

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

export default AddressMenuOpts
