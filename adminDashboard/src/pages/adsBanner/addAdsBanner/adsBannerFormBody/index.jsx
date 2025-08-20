import { useContext, useState } from 'react'
import UploadedImgBox from '../../../../components/uploadedImgBox'
import ImgUploadBox from '../../../../components/imgUploadbox'
import { MutatingDots } from 'react-loader-spinner'
import { FormControl, MenuItem, Select } from '@mui/material'
import { Controller } from 'react-hook-form'
import { context } from '../../../../App'

const AdsBannerFormBody = ({ register, handleImgUpload, handleImgDestroy, isLoading, imgArr, control, setValue }) => {
    const { categories, subCategories, nestedSubCategories } = useContext(context)
    const [catValue, setCatValue] = useState('')
    const [subCatValue, setSubCatValue] = useState('')
    return (
        <div className="flex flex-col gap-6 dark-color">
            <div className="grid grid-cols-2 gap-6">
                <div className="selectCat">
                    <h2 className='text-[1.5rem] font-[600] mb-3'>Category</h2>
                    <Controller
                        name="category"
                        control={control}
                        rules={{ required: 'Kindly select a Category' }}
                        render={({ field }) => (
                            <FormControl
                                sx={{
                                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                        border: '1px solid rgba(0,0,0,0.5)',
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        border: '1px solid #ff5252',
                                    },
                                }}
                                variant="outlined"
                                className="w-full"
                            >
                                <Select
                                    labelId="cat-label"
                                    id="cat-label"
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        setCatValue(e.target.value)
                                        setValue('subCategory', '')
                                        setValue('nestedSubCategory', '')
                                    }}
                                    className='capitalize !text-[1.4rem] !font-medium'
                                >
                                    <MenuItem className="!text-[1.4rem] !font-medium" value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {categories.map(cat => {
                                        return (
                                            <MenuItem className="!text-[1.4rem] !font-medium capitalize" key={cat._id} value={cat._id}>{cat.category}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        )}
                    />


                </div>

                <div className="selectSubCat">
                    <h2 className='text-[1.5rem] font-[600] mb-3'>Sub Category ( Optional )</h2>
                    <Controller
                        name="subCategory"
                        control={control}
                        rules={{ required: false }}
                        render={({ field }) => (
                            <FormControl
                                sx={{
                                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                        border: '1px solid rgba(0,0,0,0.5)',
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        border: '1px solid #ff5252',
                                    },
                                }}
                                className="w-full"
                            >
                                <Select
                                    labelId="subCat-label"
                                    id="subCat-label"
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        setSubCatValue(e.target.value)
                                        setValue('nestedSubCategory', '')
                                    }}
                                    className='capitalize !text-[1.4rem] !font-medium'
                                >
                                    <MenuItem className="!text-[1.4rem] !font-medium" value=''><em>None</em></MenuItem>
                                    {subCategories.filter(subCat => catValue ? subCat.category._id === catValue : subCat).map(subCat => {
                                        return (
                                            <MenuItem className="!text-[1.4rem] !font-medium capitalize" key={subCat._id} value={subCat._id}>
                                                {subCat.subCategory} ({subCat.category.category})
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        )}
                    />
                </div>

                <div className="selectNestedSubCat">
                    <h2 className='text-[1.5rem] font-[600] mb-3'>Nested Sub Category ( Optional )</h2>
                    <Controller
                        name="nestedSubCategory"
                        control={control}
                        rules={{ required: false }}
                        render={({ field }) => (
                            <FormControl
                                sx={{
                                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                                        border: '1px solid rgba(0,0,0,0.5)',
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        border: '1px solid #ff5252',
                                    },
                                }}
                                className="w-full"
                            >
                                <Select
                                    labelId="nestedSubCat-label"
                                    id="nestedSubCat-label"
                                    {...field}
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    className='capitalize !text-[1.4rem] !font-medium'
                                >
                                    <MenuItem className="!text-[1.4rem] !font-medium" value=''><em>None</em></MenuItem>
                                    {nestedSubCategories.filter(nestedSubCat => {
                                        const matchesCategory = catValue ? nestedSubCat.subCategory.category === catValue : true
                                        const matchesSubCategory = subCatValue ? nestedSubCat.subCategory._id === subCatValue : true
                                        return matchesCategory && matchesSubCategory
                                    }).map(nestedSubCat => {
                                        return (
                                            <MenuItem className="!text-[1.4rem] !font-medium capitalize" key={nestedSubCat._id} value={nestedSubCat._id}>
                                                {nestedSubCat.nestedSubCategory} ({nestedSubCat.subCategory.subCategory})
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        )}
                    />
                </div>
            </div>

            <div className="adsBannerImgBox flex flex-col gap-6">
                <h2 className="text-[2.2rem] font-semibold">Banner Image</h2>
                <ImgUploadBox multiple={false} register={register} name={'adsBannerImg'} onChange={handleImgUpload} />
                <div className="flex flex-wrap">
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

export default AdsBannerFormBody
