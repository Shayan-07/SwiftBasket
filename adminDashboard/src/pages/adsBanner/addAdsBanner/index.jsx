import { useState, useContext, useEffect, useRef } from 'react'
import { context } from '../../../App'
import { useForm } from 'react-hook-form'
import { Button } from '@mui/material'
import AdsBannerFormBody from './adsBannerFormBody'
import DestroyImagesFunc from '../../../helpers/destroyImgFunc'
import UploadImagesFunc from '../../../helpers/uploadImgFunc'
import UploadData from '../../../helpers/uploadDataFunc'

const AddAdsBanner = () => {

    const { setIsError, setIsSuccess, setAdsBanners, appURI } = useContext(context)

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue
    } = useForm()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [imgArr, setImgArr] = useState([])
    const wasSubmitted = useRef(false)

    const handleImgUpload = (e) => {
        UploadImagesFunc(e, `adsbanner`, setImgArr, setIsLoading, setIsError, appURI, false)
    }

    const handleImgDestroy = (publicId) => {
        DestroyImagesFunc([publicId], 'adsbanner', setImgArr, setIsSubmitting, setIsError, appURI)
    }

    const onSubmit = async (data) => {
        const payload = {
            category: data.category,
            subCategory: data.subCategory,
            nestedSubCategory: data.nestedSubCategory,
            imgArr
        }
        const dataUpload = UploadData(setAdsBanners, setIsSubmitting, setIsError, setIsSuccess, appURI, 'adsbanner', payload, reset)
        if (dataUpload) {
            wasSubmitted.current = true
            setImgArr([])
        }
    }

    const onError = (errors) => {
        const firstError = Object.values(errors)[0]
        if (firstError) {
            setIsError(firstError.message)
        }
    }

    useEffect(() => {
        const cleanupImages = () => {
            if (!wasSubmitted.current && imgArr.length > 0) {
                const publicIds = imgArr.map(img => img.publicId).filter(Boolean)
                if (publicIds.length > 0) {
                    DestroyImagesFunc(
                        publicIds,
                        'homeslide',
                        setImgArr,
                        setIsSubmitting,
                        setIsError,
                        appURI
                    )
                }
            }
        }

        const handleBeforeUnload = () => {
            cleanupImages()
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            cleanupImages()
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [imgArr, appURI, setIsError])

    return (
        <div className="addAdsBanner">
            <div className=' wrapper'>
                <div className="addAdsBannerForm my-10 mx-auto w-max">
                    <div className='w-[52.5vw] text-[#3e3e3e] justify-center bg-white'>
                        <form onSubmit={handleSubmit(onSubmit, onError)} className='py-10 px-14 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.3)]'>
                            <h2 className="text-[2.2rem] font-semibold mb-1">Add Ads Banner</h2>
                            <p className="text-[1.4rem] font-medium text-[#777]">
                                Fill in the details below to add a new ad banner & to Keep your store fresh and up to date.
                            </p>
                            <AdsBannerFormBody
                                register={register}
                                handleImgUpload={handleImgUpload}
                                handleImgDestroy={handleImgDestroy}
                                isLoading={isLoading}
                                imgArr={imgArr}
                                control={control}
                                setValue={setValue}
                            />
                            <Button
                                className='!bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !my-4'
                                type='submit'
                                disabled={isSubmitting || isLoading}>
                                Upload Banner
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddAdsBanner
