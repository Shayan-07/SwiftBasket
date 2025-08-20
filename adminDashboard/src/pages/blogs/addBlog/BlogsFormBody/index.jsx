import { Controller } from 'react-hook-form'
import { VscSymbolKeyword } from 'react-icons/vsc'
import { Editor } from 'react-simple-wysiwyg'
import ImgUploadBox from '../../../../components/imgUploadbox'
import UploadedImgBox from '../../../../components/uploadedImgBox'
import { MutatingDots } from 'react-loader-spinner'
import EditorBox from '../../../../components/editorBox'

const BlogFormBody = ({ register, handleImgUpload, handleImgDestroy, isLoading, imgArr, control }) => {
    return (
        <div className="flex flex-col gap-6 my-8 dark-color">
            <div className="blogInputBox flex flex-col gap-3">
                <label htmlFor="blogTitle" className='text-[1.5rem] font-[600]'>Blog Title</label>
                <div className="blogInput border border-[rgba(0,0,0,0.5)] rounded-lg px-4 flex items-center gap-3 focus-within:border-[#ff5252]">
                    <VscSymbolKeyword className='text-[2rem]' />
                    <input
                        type="text"
                        className='text-[1.4rem] text-[#555] font-medium w-full py-4 placeholder:text-[#999]'
                        placeholder='Give it a Catchy Title'
                        {...register('title', { required: `Kindly add the Title of your Blog` })} />
                </div>
            </div>

            <div className="blogInputBox flex flex-col gap-3">
                <label htmlFor="description" className='text-[1.5rem] font-[600]'>Description</label>
                <div className="blogInput">
                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: 'Description is Required' }}
                        render={({ field }) => (
                            <EditorBox field={field} placeholderTxt={`Write Here...`} />
                        )}
                    />
                </div>
            </div>

            <div className="blogImgBox flex flex-col gap-6">
                <h2 className="text-[2.2rem] font-semibold">Blog Image</h2>
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
                                width={'32rem'}
                                height={'16rem'}
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

export default BlogFormBody
