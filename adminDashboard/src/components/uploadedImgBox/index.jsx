import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { Button } from '@mui/material'

import { IoRemove } from 'react-icons/io5'

const UploadedImgBox = ({ width, height, imgSrc, handleDestroy, isSingle }) => {
    return (
        <div className='lazyloadBox relative group' style={{ width: `${width}`, height: `${height}` }}>
            <LazyLoadImage src={imgSrc} effect='blur' className='w-full h-full object-cover object-center rounded-lg' wrapperClassName='block w-full h-full' />
            {!isSingle &&
                <Button className='!min-w-auto !p-[1px] !rounded-full primary-bg !text-white !absolute !-top-[0.5rem] !-right-[0.5rem] !scale-0 group-hover:!scale-100 !transition-all !duration-300'>
                    <IoRemove className="text-[1.6rem]" onClick={handleDestroy} />
                </Button>}
        </div>
    )
}

export default UploadedImgBox
