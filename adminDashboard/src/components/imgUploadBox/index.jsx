import { LuImages } from 'react-icons/lu'

const ImgUploadBox = ({ multiple = false, register, name, onChange, imgArrLength }) => {
    return (
        <div className="imgUploadBox border border-dashed border-[rgba(0,0,0,0.3)] rounded-lg w-full hover:bg-gray-200 cursor-pointer transition-colors duration-200 relative">
            <div className="flex flex-col gap-4 items-center justify-center text-[#777] py-10">
                <LuImages className='text-[5rem]' />
                <p className='text-[2rem] font-medium'>Upload Image</p>
            </div>
            <input
                type="file"
                {...register(name, { required: imgArrLength === 0, message: 'Kindly upload an image' })}
                className='absolute w-full h-full inset-0 opacity-0 cursor-pointer'
                title='Upload Image'
                multiple={multiple}
                onChange={onChange}
            />
        </div>
    )
}

export default ImgUploadBox
