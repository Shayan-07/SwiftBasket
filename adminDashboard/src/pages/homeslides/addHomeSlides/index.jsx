import { useState, useContext, useRef, useEffect } from 'react'
import { context } from '../../../App'
import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'

import UploadImagesFunc from '../../../helpers/uploadImgFunc'
import DestroyImagesFunc from '../../../helpers/destroyImgFunc'
import HomeSlideFormBody from './homeSlideFormBody'
import UploadData from '../../../helpers/uploadDataFunc'

const AddHomeSlides = () => {

    const { setIsError, setIsSuccess, appURI, setHomeSlides } = useContext(context)
    const { register, handleSubmit, reset } = useForm()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [imgArr, setImgArr] = useState([])
    const wasSubmitted = useRef(false)

    const handleImgUpload = (e) => {
        UploadImagesFunc(e, `homeslide`, setImgArr, setIsLoading, setIsError, appURI, true)
    }

    const handleImgDestroy = (publicId) => {
        DestroyImagesFunc([publicId], 'homeslide', setImgArr, setIsSubmitting, setIsError, appURI)
    }

    const onSubmit = async (data) => {
        const payload = { imgArr }
        const dataUpload = UploadData(setHomeSlides, setIsSubmitting, setIsError, setIsSuccess, appURI, 'homeslide', payload, reset)

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
        <div className="addHomeSlides">
            <div className=' wrapper'>
                <div className="addHomeSlidesForm my-10">
                    <div className='text-[#3e3e3e] justify-center'>
                        <form onSubmit={handleSubmit(onSubmit, onError)} className='py-10 px-14' encType='multipart/form-data'>
                            <HomeSlideFormBody
                                register={register}
                                handleImgUpload={handleImgUpload}
                                handleImgDestroy={handleImgDestroy}
                                isLoading={isLoading}
                                imgArr={imgArr} />
                            <Button type='submit' disabled={isSubmitting || isLoading}
                                className={`
                                    !bg-[#FF5252] w-full !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize px-10 !my-4
                                    ${(isSubmitting || isLoading) ? 'opacity-60' : 'opacity-100'} 
                                `}
                            >
                                Upload Home Slides
                            </Button>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default AddHomeSlides
