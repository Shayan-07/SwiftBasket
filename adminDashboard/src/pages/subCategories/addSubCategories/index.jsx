import { useContext, useState } from 'react'
import { context } from '../../../App'
import { useForm, Controller } from 'react-hook-form'
import { Button, FormControl, MenuItem, Select } from '@mui/material'
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import UploadData from '../../../helpers/uploadDataFunc'

const AddSubCategories = () => {
  const {
    appURI,
    setIsError,
    setIsSuccess,
    categories,
    subCategories,
    setSubCategories,
    setNestedSubCategories
  } = useContext(context)

  const {
    control: controlSubCat,
    register: registerSubCat,
    handleSubmit: handleSubmitSubCat,
    reset: resetSubCat
  } = useForm({
    defaultValues: {
      subCategory: '',
      category: ''
    }
  })

  const {
    control: controlNestedCat,
    register: registerNestedCat,
    handleSubmit: handleSubmitNestedCat,
    reset: resetNestedCat
  } = useForm({
    defaultValues: {
      nestedSubCategory: '',
      subCategory: ''
    }
  })

  const [isSubmittingSubCat, setIsSubmittingSubCat] = useState(false)
  const [isSubmittingNestedCat, setIsSubmittingNestedCat] = useState(false)

  const onSubmitSubCat = (data) => {
    const payload = {
      subCategory: data.subCategory,
      categoryId: data.category
    }
    UploadData(setSubCategories, setIsSubmittingSubCat, setIsError, setIsSuccess, appURI, 'category/sub', payload, resetSubCat)
  }

  const onSubmitNestedCat = (data) => {
    const payload = {
      nestedSubCategory: data.nestedSubCategory,
      subCategoryId: data.subCategory
    }
    UploadData(setNestedSubCategories, setIsSubmittingNestedCat, setIsError, setIsSuccess, appURI, 'category/sub/nested', payload, resetNestedCat)
  }

  const onErrorSubCat = (errors) => {
    const firstError = Object.values(errors)[0]
    if (firstError) setIsError(firstError.message)
  }

  const onErrorNestedCat = (errors) => {
    const firstError = Object.values(errors)[0]
    if (firstError) setIsError(firstError.message)
  }

  const selectStyles = {
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      border: '1px solid rgba(0,0,0,0.5)',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: '1px solid #ff5252',
    },
    fontSize: '1.4rem',
    fontWeight: 500,
    textTransform: 'capitalize',
    color: '#555'
  }

  return (
    <div className="addSubCategories addNestedSubCategories">
      <div className="wrapper">
        <div className="addSubCategoriesForm my-10 mx-auto w-max">
          <div className="w-[52.5vw] text-[#3e3e3e] justify-center bg-white">
            <form
              onSubmit={handleSubmitSubCat(onSubmitSubCat, onErrorSubCat)}
              className="py-10 px-14 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.3)]"
            >
              <h2 className="text-[2.2rem] font-semibold mb-1">Add Sub Category</h2>
              <p className="text-[1.4rem] font-medium text-[#777]">
                Fill in the details below to add a new Sub Category.
              </p>

              <div className="grid grid-cols-2 gap-6 my-8 dark-color">
                <div className="subCategoryInputBox flex flex-col gap-3">
                  <label htmlFor="subCategory" className="text-[1.5rem] font-[600]">
                    Sub Category Name
                  </label>
                  <div className="border border-[rgba(0,0,0,0.5)] rounded-lg px-4 flex items-center gap-3 focus-within:border-[#ff5252]">
                    <HiOutlineClipboardDocumentList className="text-[2rem]" />
                    <input
                      type="text"
                      id="subCategory"
                      className="text-[1.4rem] text-[#555] font-medium w-full py-4 placeholder:text-[#999]"
                      placeholder="Write Your Sub Category Name"
                      {...registerSubCat('subCategory', {
                        required: 'Kindly add the Name of your Sub Category',
                      })}
                    />
                  </div>
                </div>

                <div className="selectCat">
                  <h2 className="text-[1.5rem] font-[600] mb-3">Category</h2>
                  <Controller
                    name="category"
                    control={controlSubCat}
                    rules={{ required: 'Kindly select a Category' }}
                    render={({ field }) => (
                      <FormControl sx={selectStyles} variant="outlined" className="w-full">
                        <Select {...field}>
                          <MenuItem
                            sx={{
                              fontSize: '1.4rem',
                              fontWeight: 500,
                              textTransform: 'capitalize',
                              color: '#555'
                            }}
                            value=""
                          ><em>None</em></MenuItem>
                          {categories.map(cat => (
                            <MenuItem
                              sx={{
                                fontSize: '1.4rem',
                                fontWeight: 500,
                                textTransform: 'capitalize',
                                color: '#555'
                              }}
                              key={cat._id}
                              value={cat._id}>
                              {cat.category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>
              </div>

              <Button
                className={`!bg-[#FF5252] !text-white !py-5 !rounded-md !font-medium !text-[1.5rem] w-full !my-4 !capitalize
                  ${isSubmittingSubCat ? 'opacity-75 select-none' : ''}`}
                type="submit"
                disabled={isSubmittingSubCat}
              >
                Upload Sub Category
              </Button>
            </form>
          </div>
        </div>

        <div className="addNestedSubCategoriesForm my-10 mx-auto w-max">
          <div className="w-[52.5vw] text-[#3e3e3e] justify-center bg-white">
            <form
              onSubmit={handleSubmitNestedCat(onSubmitNestedCat, onErrorNestedCat)}
              className="py-10 px-14 rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.3)]"
            >
              <h2 className="text-[2.2rem] font-semibold mb-1">Add Nested Sub Category</h2>
              <p className="text-[1.4rem] font-medium text-[#777]">
                Fill in the details below to add a new Nested Sub Category.
              </p>

              <div className="grid grid-cols-2 gap-6 my-8 dark-color">
                <div className="nestedSubCategoryInputBox flex flex-col gap-3">
                  <label htmlFor="nestedSubCategory" className="text-[1.5rem] font-[600]">
                    Nested Sub Category Name
                  </label>
                  <div className="border border-[rgba(0,0,0,0.5)] rounded-lg px-4 flex items-center gap-3 focus-within:border-[#ff5252]">
                    <HiOutlineClipboardDocumentList className="text-[2rem]" />
                    <input
                      type="text"
                      id="nestedSubCategory"
                      className="text-[1.4rem] text-[#555] font-medium w-full py-4 placeholder:text-[#999]"
                      placeholder="Write Your Nested Sub Category Name"
                      {...registerNestedCat('nestedSubCategory', {
                        required: 'Kindly add the Name of your Nested Sub Category',
                      })}
                    />
                  </div>
                </div>

                <div className="selectSubCat">
                  <h2 className="text-[1.5rem] font-[600] mb-3">Sub Category</h2>
                  <Controller
                    name="subCategory"
                    control={controlNestedCat}
                    rules={{ required: 'Kindly select a Sub Category' }}
                    render={({ field }) => (
                      <FormControl
                        sx={selectStyles}
                        className="w-full">
                        <Select {...field}>
                          <MenuItem
                            sx={{
                              fontSize: '1.4rem',
                              fontWeight: 500,
                              textTransform: 'capitalize',
                              color: '#555'
                            }}
                            value=""
                          ><em>None</em></MenuItem>
                          {subCategories.map(sub => (
                            <MenuItem
                              sx={{
                                fontSize: '1.4rem',
                                fontWeight: 500,
                                textTransform: 'capitalize',
                                color: '#555'
                              }}
                              key={sub._id}
                              value={sub._id}>
                              {`${sub.subCategory} (${sub.category.category})`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>
              </div>

              <Button
                className={`!bg-[#FF5252] !text-white !py-5 !rounded-md !font-medium !text-[1.5rem] w-full !my-4 !capitalize
                  ${isSubmittingNestedCat ? 'opacity-75 select-none' : ''}`}
                type="submit"
                disabled={isSubmittingNestedCat}
              >
                Upload Nested Sub Category
              </Button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AddSubCategories
