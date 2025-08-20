import { useState, useContext, useEffect, useRef } from 'react'
import { context } from '../../../App'
import { useForm } from 'react-hook-form'
import { Button } from '@mui/material'
import CategoryFormBody from './categoryFormBody'
import DestroyImagesFunc from '../../../helpers/destroyImgFunc'
import UploadImagesFunc from '../../../helpers/uploadImgFunc'
import UploadData from '../../../helpers/uploadDataFunc'

const AddCategories = () => {

    const { setIsError, setIsSuccess, setCategories, appURI } = useContext(context)

    const {
        register,
        handleSubmit,
        reset
    } = useForm()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [imgArr, setImgArr] = useState([])
    const wasSubmitted = useRef(false)

    const handleImgUpload = (e) => {
        UploadImagesFunc(e, `category`, setImgArr, setIsLoading, setIsError, appURI, false, imgArr)
    }

    const handleImgDestroy = (publicId) => {
        DestroyImagesFunc([publicId], 'category', setImgArr, setIsSubmitting, setIsError, appURI)
    }

    const onSubmit = async (data) => {
        const payload = {
            category: data.category,
            imgArr
        }
        const dataUpload = UploadData(setCategories, setIsSubmitting, setIsError, setIsSuccess, appURI, 'category', payload, reset)
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
        <div className="addCategories">
            <div className=' wrapper'>
                <div className="addCategoriesForm my-10 mx-auto w-max">
                    <div className='w-[52.5vw] text-[#3e3e3e] justify-center bg-white'>
                        <form onSubmit={handleSubmit(onSubmit, onError)} className='py-10 px-14 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.3)]' encType='multipart/form-data'>
                            <h2 className="text-[2.2rem] font-semibold mb-1">Add Category</h2>
                            <p className="text-[1.4rem] font-medium text-[#777]">
                                Fill in the details below to add a new Category.
                            </p>
                            <CategoryFormBody
                                register={register}
                                handleImgUpload={handleImgUpload}
                                handleImgDestroy={handleImgDestroy}
                                isLoading={isLoading}
                                imgArr={imgArr} />
                            <Button type='submit' disabled={isSubmitting || isLoading}
                                className={`
                                    !bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !my-4
                                    ${isSubmitting || isLoading ? 'opacity-60' : 'opacity-100'} 
                                `}
                            >
                                Add Category
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCategories

