import { useEffect, useContext, useState } from 'react'
import { context } from '../../App'
import { useForm } from "react-hook-form"
import { Button, Drawer } from '@mui/material'

import { IoClose } from 'react-icons/io5'
import UploadImagesFunc from '../../helpers/uploadImgFunc'
import DestroyImagesFunc from '../../helpers/destroyImgFunc'

const EditDrawer = ({ toggleDrawer, openDrawer, editUri, item, formBody, isImgArr, setData, isControl = false, isProduct = false }) => {

    const { setIsError, setIsSuccess, appURI } = useContext(context)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [imgArr, setImgArr] = useState([])
    const [originalImgArr, setOriginalImgArr] = useState([])
    const [newImgSelected, setNewImgSelected] = useState(false)
    const [isUpdated, setIsUpdated] = useState(false)

    const FormBody = formBody

    useEffect(() => {
        if (isImgArr && item?.imgUrl && item?.publicId) {
            const imgData = { imgUrl: item.imgUrl, publicId: item.publicId }
            setImgArr([imgData])
            setOriginalImgArr([imgData])
        } else if (isImgArr && item?.mediaImgUrls && item?.mediaImgPublicIds) {
            const imgData = item.mediaImgUrls.map((imgUrl, i) => ({
                imgUrl,
                publicId: item.mediaImgPublicIds[i]
            }))
            setImgArr(imgData)
            setOriginalImgArr(imgData)
        } else {
            setImgArr([])
            setOriginalImgArr([])
        }
    }, [openDrawer])

    useEffect(() => {
        if (item) {
            const defaultValues = {}
            Object.keys(item).forEach(key => {
                defaultValues[key] = typeof item[key] === 'object' ? item[key]?._id : item[key]
            })
            reset(defaultValues)
        }
    }, [item])

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        getValues
    } = useForm()

    const handleImgUpload = async (e) => {
        setNewImgSelected(true)
        try {
            await UploadImagesFunc(e, editUri, setImgArr, setIsLoading, setIsError, appURI, isProduct)
        } catch (error) {
            setImgArr(originalImgArr)
            setNewImgSelected(false)
        }
    }

    const handleImgDestroy = (publicId) => {
        DestroyImagesFunc([publicId], editUri, setImgArr, setIsSubmitting, setIsError, appURI)
    }

    const cleanupUnusedImages = async () => {
        const unusedImgs = imgArr.filter(
            img => !originalImgArr.some(orig => orig.publicId === img.publicId)
        )

        const unusedPublicIds = unusedImgs.map(img => img.publicId)

        if (unusedPublicIds.length > 0) {
            await DestroyImagesFunc(unusedPublicIds, editUri, setImgArr, setIsSubmitting, setIsError, appURI)
            setImgArr(originalImgArr)
        }
    }

    const handleDrawerClose = async () => {
        if (isImgArr && !isUpdated && newImgSelected) {
            await cleanupUnusedImages()
        }
        setNewImgSelected(false)
        toggleDrawer(false)
    }

    const onSubmit = (data) => {
        setIsSubmitting(true)

        const payload = {}

        if (item && typeof item === 'object') {
            Object.keys(item).forEach(key => {
                if (data.hasOwnProperty(key)) {
                    payload[key] = data[key]
                }
            })
        }

        if (isImgArr) {
            payload.imgArr = imgArr
        }

        fetch(`${appURI}/${editUri}/edit/${item._id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(async resData => {
                if (resData.success) {
                    setIsSubmitting(false)
                    setData(resData.data)
                    setIsSuccess(resData.message)
                    reset()
                    setImgArr([])

                    if (originalImgArr.length > 0 && imgArr[0].publicId !== originalImgArr[0].publicId) {
                        await DestroyImagesFunc(
                            [originalImgArr[0].publicId],
                            `${editUri}`,
                            setImgArr,
                            setIsSubmitting,
                            setIsError,
                            appURI
                        )
                    }
                    setIsUpdated(true)
                    toggleDrawer(false)
                } else {
                    setIsSubmitting(false)
                    setIsError(resData.message)
                }
            })
            .catch(error => {
                setIsError(error.message || 'Something Went Wrong!')
                setIsSubmitting(false)
                setIsLoading(false)
            })
    }

    const onError = (errors) => {
        const firstError = Object.values(errors)[0]
        if (firstError) {
            setIsError(firstError.message)
        }
    }

    return (
        <>
            <Drawer open={openDrawer} anchor='bottom' onClose={handleDrawerClose}>
                <div className="h-[100vh]">
                    <div className="addressPanelHead flex justify-between  items-center py-4 px-8 border-b border-[rgba(0,0,0,0.3)] mb-10">
                        <h2 className="text-[2rem] font-[600]">Update Home Slide</h2>
                        <Button className='!rounded-full !min-w-auto !p-3 !text-[#3e3e3e]' onClick={handleDrawerClose}>
                            <IoClose className='text-[2.2rem]' />
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className='flex flex-col gap-8 px-5'>
                        <FormBody
                            register={register}
                            isLoading={isLoading}
                            {...(isImgArr && { handleImgUpload })}
                            {...(isImgArr && { handleImgDestroy })}
                            {...(isImgArr && { imgArr })}
                            {...(isControl && { control })}
                            {...(isControl && { setValue })}
                            {...(isControl && { getValues })}
                        />
                        <Button type='submit' disabled={isSubmitting || isLoading}
                            className={`
                                !bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !my-6
                                ${isSubmitting ? 'opacity-60' : 'opacity-100'} 
                            `}
                        >
                            Update
                        </Button>

                    </form>
                </div>
            </Drawer>
        </>
    )
}

export default EditDrawer
