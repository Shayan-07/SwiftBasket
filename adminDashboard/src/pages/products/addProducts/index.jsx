import { useState, useContext, useRef, useEffect } from 'react'
import { context } from '../../../App'
import { useForm } from 'react-hook-form'
import { Button } from '@mui/material'
import ProductFormBody from './productFormBody'
import UploadImagesFunc from '../../../helpers/uploadImgFunc'
import DestroyImagesFunc from '../../../helpers/destroyImgFunc'
import UploadData from '../../../helpers/uploadDataFunc'
import { EditorProvider } from 'react-simple-wysiwyg'

const AddProducts = () => {

    const { setIsError, setIsSuccess, appURI, setProducts } = useContext(context)
    const { register, handleSubmit, reset, control, setValue, getValues } = useForm()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [imgArr, setImgArr] = useState([])
    const wasSubmitted = useRef(false)

    const handleImgUpload = (e) => {
        UploadImagesFunc(e, `product`, setImgArr, setIsLoading, setIsError, appURI, true)
    }

    const handleImgDestroy = (publicId) => {
        DestroyImagesFunc([publicId], 'product', setImgArr, setIsSubmitting, setIsError, appURI)
    }

    const onSubmit = async (data) => {
        const payload = {
            title: data.title,
            description: data.description,
            category: data.category,
            subCategory: data.subCategory,
            nestedSubCategory: data.nestedSubCategory,
            price: data.price,
            discount: data.discount,
            brandName: data.brandName,
            stock: data.stock,
            imgArr
        }

        const dataUpload = UploadData(setProducts, setIsSubmitting, setIsError, setIsSuccess, appURI, 'product', payload, reset)
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
        <div className="addProducts">
            <div className=' wrapper'>
                <div className="addProductsForm my-10 mx-auto w-max">
                    <div className='w-[52.5vw] text-[#3e3e3e] justify-center bg-white'>
                        <form onSubmit={handleSubmit(onSubmit, onError)} className='py-10 px-14 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.3)]'>
                            <h2 className="text-[2.2rem] font-semibold mb-1">Add Product</h2>
                            <p className="text-[1.4rem] font-medium text-[#777]">
                                Fill in the details below to add a new product to your catalog. Keep your store fresh and up to date.
                            </p>

                            <EditorProvider>
                                <ProductFormBody
                                    register={register}
                                    handleImgUpload={handleImgUpload}
                                    handleImgDestroy={handleImgDestroy}
                                    isLoading={isLoading}
                                    imgArr={imgArr}
                                    control={control}
                                    setValue={setValue}
                                    getValues={getValues}
                                />
                            </EditorProvider>
                            <Button type='submit' disabled={isSubmitting}
                                className={`
                                    !bg-[#FF5252] !text-white !py-5 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize w-full !my-4
                                    ${isSubmitting ? 'opacity-60' : 'opacity-100'} 
                                `}
                            >
                                Upload Product
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProducts
