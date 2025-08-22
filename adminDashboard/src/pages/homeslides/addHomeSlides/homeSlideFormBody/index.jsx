import UploadedImgBox from '../../../../components/uploadedImgBox'
import ImgUploadBox from '../../../../components/imgUploadBox'
import { MutatingDots } from 'react-loader-spinner'

const HomeSlideFormBody = ({ register, handleImgUpload, handleImgDestroy, isLoading, imgArr }) => {
    return (
        <div className="homeSlidesImgBox flex flex-col gap-6">
            <h2 className="text-[2.2rem] font-semibold">Add Home Slides</h2>
            <ImgUploadBox multiple={true} register={register} name={'homeSlideImg'} onChange={handleImgUpload} />
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
                            width={'100%'}
                            height={'200px'}
                            imgSrc={img.imgUrl}
                            handleDestroy={() => handleImgDestroy(img.publicId)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default HomeSlideFormBody
