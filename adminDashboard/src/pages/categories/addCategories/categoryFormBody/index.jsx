import UploadedImgBox from '../../../../components/uploadedImgBox'
import ImgUploadBox from '../../../../components/imgUploadbox'
import { MutatingDots } from 'react-loader-spinner'
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'

const CategoryFormBody = ({ register, handleImgUpload, handleImgDestroy, isLoading, imgArr }) => {    
    return (
        <div className="flex flex-col gap-6 my-8 dark-color">
            <div className="categoryInputBox flex flex-col gap-3">
                <label htmlFor="category" className='text-[1.5rem] font-[600]'>Category Name</label>
                <div className="categoryInput border border-[rgba(0,0,0,0.5)] rounded-lg px-4 flex items-center gap-3 focus-within:border-[#ff5252]">
                    <HiOutlineClipboardDocumentList className='text-[2rem]' />
                    <input
                        type="text"
                        id='category'
                        className='text-[1.4rem] text-[#555] font-medium w-full py-4 placeholder:text-[#999]'
                        placeholder='Write Your Category Name'
                        {...register('category', { required: `Category Name is Required` })} />
                </div>
            </div>

            <div className="categoryImgBox flex flex-col gap-6">
                <h2 className="text-[2.2rem] font-semibold">Category Image</h2>

                <ImgUploadBox multiple={false} register={register} name={'catImg'} onChange={handleImgUpload} />
                <div className="grid grid-cols-2 gap-8">
                    {isLoading ? (
                        <div className="flex w-full justify-center items-center py-10 col-span-2">
                            <MutatingDots
                                visible={true}
                                height="100"
                                width="100"
                                color='#ff5252'
                                secondaryColor="#ff5252"
                                radius="12.5"
                                ariaLabel="mutating-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div>
                    ) : (
                        imgArr.map((img, index) => (
                            <UploadedImgBox
                                key={img.publicId || index}
                                width={'100px'}
                                height={'100px'}
                                imgSrc={img.imgUrl}
                                handleDestroy={() => handleImgDestroy(img.publicId)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default CategoryFormBody
