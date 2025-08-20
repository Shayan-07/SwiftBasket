import React, { useContext, useState, useEffect, useRef } from 'react'
import { context } from '../../../App'
import { useForm } from 'react-hook-form'
import { Button } from '@mui/material'
import BlogFormBody from './BlogsFormBody'
import { EditorProvider } from 'react-simple-wysiwyg'
import UploadImagesFunc from '../../../helpers/uploadImgFunc'
import DestroyImagesFunc from '../../../helpers/destroyImgFunc'
import UploadData from '../../../helpers/uploadDataFunc'

const AddBlog = () => {

    const { setIsError, setIsSuccess, setBlogs, appURI } = useContext(context)

    const {
        register,
        handleSubmit,
        reset,
        control
    } = useForm()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [imgArr, setImgArr] = useState([])
    const wasSubmitted = useRef(false)

    const handleImgUpload = (e) => {
        UploadImagesFunc(e, `blog`, setImgArr, setIsLoading, setIsError, appURI, false, imgArr)
    }

    const handleImgDestroy = (publicId) => {
        DestroyImagesFunc([publicId], 'blog', setImgArr, setIsSubmitting, setIsError, appURI)
    }

    const onSubmit = async (data) => {
        const payload = {
            title: data.title,
            description: data.description,
            imgArr
        }
        const dataUpload = UploadData(setBlogs, setIsSubmitting, setIsError, setIsSuccess, appURI, 'blog', payload, reset)
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
        <div className="addBlogs">
            <div className=' wrapper'>
                <div className="addBlogsForm my-10 mx-auto w-max">
                    <div className='w-[52.5vw] text-[#3e3e3e] justify-center bg-white'>
                        <form onSubmit={handleSubmit(onSubmit, onError)} className='py-10 px-14 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.3)]'>
                            <h2 className="text-[2.2rem] font-semibold mb-1">Add Blog</h2>
                            <p className="text-[1.4rem] font-medium text-[#777]">
                                Fill in the details below to add a new Blog to your catalog. Keep your store fresh and up to date.
                            </p>
                            <EditorProvider>
                                <BlogFormBody
                                    register={register}
                                    handleImgUpload={handleImgUpload}
                                    handleImgDestroy={handleImgDestroy}
                                    isLoading={isLoading}
                                    imgArr={imgArr}
                                    control={control}
                                />
                            </EditorProvider>
                            <Button
                                className='!bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !my-4'
                                type='submit'
                                disabled={isSubmitting || isLoading}>
                                Upload Product
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddBlog
