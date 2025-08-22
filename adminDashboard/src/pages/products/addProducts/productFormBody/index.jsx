import { useContext, useState, useEffect } from 'react'
import ImgUploadBox from '../../../../components/imgUploadBox'
import UploadedImgBox from '../../../../components/uploadedImgBox'
import EditorBox from '../../../../components/editorBox'
import { Controller } from 'react-hook-form'
import { FormControl, MenuItem, Select } from '@mui/material'
import { context } from '../../../../App'
import { MutatingDots } from 'react-loader-spinner'

import { LuDollarSign, LuTag } from "react-icons/lu"
import { PiWarehouse } from "react-icons/pi"
import { RiStackLine } from "react-icons/ri"
import { VscSymbolKeyword } from "react-icons/vsc"

const ProductFormBody = ({ register, handleImgUpload, handleImgDestroy, isLoading, imgArr, control, setValue, getValues }) => {
    const { categories, subCategories, nestedSubCategories } = useContext(context)
    const [catValue, setCatValue] = useState('')
    const [subCatValue, setSubCatValue] = useState('')

    useEffect(() => {
        const initialCategory = getValues('category')
        const initialSubCategory = getValues('subCategory')

        if (initialCategory) setCatValue(initialCategory)
        if (initialSubCategory) setSubCatValue(initialSubCategory)
    }, [])

    return (
        <div className="flex flex-col gap-6 my-8 dark-color">
            <div className="productInputBox flex flex-col gap-3">
                <label htmlFor="title" className='text-[1.5rem] font-[600]'>Title</label>
                <div className="productInput border border-[rgba(0,0,0,0.5)] rounded-lg px-4 flex items-center gap-3 focus-within:border-[#ff5252]">
                    <VscSymbolKeyword className='text-[2rem]' />
                    <input
                        type="text"
                        className='text-[1.4rem] text-[#555] font-medium w-full py-4 placeholder:text-[#999]'
                        placeholder='Give it a Catchy Title'
                        {...register('title', { required: `Title is Required` })} />
                </div>
            </div>

            <div className="productInputBox flex flex-col gap-3">
                <label htmlFor="description" className='text-[1.5rem] font-[600]'>Description</label>
                <div className="productInput">
                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: 'Description is Required' }}
                        render={({ field }) => (
                            <EditorBox field={field} placeholderTxt={`Breifly describe about your Product & it's Features`} />
                        )}
                    />
                </div>
            </div>

            <div className='grid grid-cols-2 gap-6'>
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

                <div className="productInputBox flex flex-col gap-3">
                    <label htmlFor="price" className='text-[1.5rem] font-[600]'>Price</label>
                    <div className="productInput border border-[rgba(0,0,0,0.5)] rounded-lg px-4 flex items-center gap-3 focus-within:border-[#ff5252]">
                        <LuDollarSign className='text-[2rem]' />
                        <input
                            type="number"
                            step={0.01}
                            className='text-[1.4rem] text-[#555] font-medium w-full py-4 placeholder:text-[#999]'
                            placeholder='Amount'
                            {...register('price', { required: `Price is Required` })} />
                    </div>
                </div>

                <div className="productInputBox flex flex-col gap-3">
                    <label htmlFor="discount" className='text-[1.5rem] font-[600]'>Discount</label>
                    <div className="productInput border border-[rgba(0,0,0,0.5)] rounded-lg px-4 flex items-center gap-3 focus-within:border-[#ff5252]">
                        <LuTag className='text-[2rem]' />
                        <input
                            type="number"
                            step={0.01}
                            className='text-[1.4rem] text-[#555] font-medium w-full py-4 placeholder:text-[#999]'
                            placeholder='Discount %'
                            {...register('discount', { required: `Discount is Required` })} />
                    </div>
                </div>

                <div className="productInputBox flex flex-col gap-3">
                    <label htmlFor="brandName" className='text-[1.5rem] font-[600]'>Brand Name</label>
                    <div className="productInput border border-[rgba(0,0,0,0.5)] rounded-lg px-4 flex items-center gap-3 focus-within:border-[#ff5252]">
                        <RiStackLine className='text-[2.3rem]' />
                        <input
                            type="text"
                            className='text-[1.4rem] text-[#555] font-medium w-full py-4 placeholder:text-[#999]'
                            placeholder='Brand Name'
                            {...register('brandName', { required: `Brand Name is Required` })} />
                    </div>
                </div>

                <div className="productInputBox flex flex-col gap-3">
                    <label htmlFor="stock" className='text-[1.5rem] font-[600]'>Stock</label>
                    <div className="productInput border border-[rgba(0,0,0,0.5)] rounded-lg px-4 flex items-center gap-3 focus-within:border-[#ff5252]">
                        <PiWarehouse className='text-[2.3rem]' />
                        <input
                            type="number"
                            className='text-[1.4rem] text-[#555] font-medium w-full py-4 placeholder:text-[#999]'
                            placeholder='Stock'
                            {...register('stock', { required: `Stock is Required` })} />
                    </div>
                </div>
            </div>

            <div className="productImgBox flex flex-col gap-6">
                <div>
                    <h2 className="text-[2.2rem] font-semibold mb-1">Media & Images</h2>
                    <p className="text-[1.4rem] text-[#777]">The first image you select will be set as the product's Front image. All additional images will be stored in the exact order selected and shown in the product gallery accordingly</p>
                </div>
                <ImgUploadBox multiple={true} register={register} name={'productImg'} onChange={handleImgUpload} imgArrLength={imgArr.length} />
                <div className="flex flex-wrap gap-3">
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
                                key={img.publicId + index}
                                width={'16rem'}
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

export default ProductFormBody
