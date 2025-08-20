import React, { useRef, useState, useContext, useEffect } from 'react'
import { Button, CircularProgress, FormControl, MenuItem, Select, Tooltip } from '@mui/material'
import { FaAngleDown } from "react-icons/fa6"
import { FaRegEdit } from 'react-icons/fa'
import { AiOutlineDelete } from 'react-icons/ai'
import { useForm } from 'react-hook-form'
import { context } from '../../App'
import { MutatingDots, ThreeDots } from 'react-loader-spinner'
import DeleteSingleData from '../../helpers/deleteSingleData'
import UpdateData from '../../helpers/updateDataFunc'

const SubCategories = () => {
  const { categories, subCategories, setSubCategories, nestedSubCategories, setNestedSubCategories, isLoading, setIsError, setIsSuccess, appURI } = useContext(context)
  const subCatRef = useRef({})
  const [isAccordionOpen, setIsAccordionOpen] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    setValue
  } = useForm()


  const [editingSubCatId, setEditingSubCatId] = useState(null)
  const [editingNestedSubCatId, setEditingNestedSubCatId] = useState(null)

  const [isDeleting, setIsDeleting] = useState(null)
  const [isDeletingSingle, setIsDeletingSingle] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const isToggleAccordion = (index) => {
    if (isAccordionOpen !== index) {
      setIsAccordionOpen(index)
      setEditingSubCatId(null)
      setEditingNestedSubCatId(null)
    } else {
      setIsAccordionOpen(null)
    }
  }

  useEffect(() => {
    if (!isAccordionOpen && categories.length) {
      setIsAccordionOpen(categories[0]._id)
    }
  }, [categories])

  const editSubCategory = (id, value, catId) => {
    setEditingSubCatId(id)
    setEditingNestedSubCatId(null)
    setValue('subCategory', value)
    setValue('category', catId)
  }

  const editNestedSubCategory = (id, value, subCatId) => {
    setEditingNestedSubCatId(id)
    setEditingSubCatId(null)
    setValue('nestedSubCategory', value)
    setValue('subCategory', subCatId)
  }


  const onSubmit = async (editUri, id, setData, data) => {
    setIsEditing(id)

    const payload =
      editUri === 'sub'
        ? { subCategory: data.subCategory, categoryId: data.category }
        : { nestedSubCategory: data.nestedSubCategory, subCategoryId: data.subCategory }

    await UpdateData(
      `category/${editUri}`,
      id,
      payload,
      setData,
      () => null,
      setIsError,
      setIsSuccess,
      appURI,
      reset
    )

    setEditingSubCatId(null)
    setEditingNestedSubCatId(null)
    setIsEditing(false)
  }


  const onError = (errors) => {
    const firstError = Object.values(errors)[0]
    if (firstError) {
      setIsError(firstError.message)
    }
  }

  const handleDelete = (setData, dltUri, id) => {
    setIsDeleting(id)
    DeleteSingleData(setData, setIsDeletingSingle, setIsError, setIsSuccess, appURI, `category/${dltUri}`, id)
  }

  return (
    <div>
      <div className="subCategories">
        <div className="wrapper">
          <div className="subCategoryAccordionBox bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] p-5 sm:rounded-lg">
            {isLoading ?
              <div className='flex w-full justify-center items-center py-10'>
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
              :
              <div className='Accordion'>
                {categories.map((cat) => {
                  return (
                    <div className="subCategoryAccordion bg-[#f1f1f1] py-4 px-5 rounded-lg overflow-hidden mb-5" key={cat._id}>
                      <div className="flex justify-between items-center">
                        <span className='text-[1.5rem] font-medium capitalize'>{cat.category}</span>
                        {cat?.subCategory.length > 1 &&
                          <Button className="!min-w-auto !rounded-full !bg-transparent dark-color !w-max !p-3" onClick={() => isToggleAccordion(cat._id)}>
                            <FaAngleDown className={`text-[1.5rem] transition-all duration-300 ${isAccordionOpen === cat._id ? 'rotate-180' : 'rotate-0'}`} />
                          </Button>}
                      </div>

                      <div className="AccordionContent overflow-hidden transition-all duration-500"
                        ref={(el) => (subCatRef.current[cat._id] = el)}
                        style={{
                          maxHeight: isAccordionOpen === cat._id
                            ? `${subCatRef.current[cat._id]?.scrollHeight}px`
                            : '0px',
                        }}
                      >
                        <ul className='text-[1.5rem] font-medium dark-color pl-7 pt-3 flex flex-col gap-4'>
                          {subCategories.filter(subCat => subCat.category._id === cat._id).map((subCat) => {
                            return (
                              <React.Fragment key={subCat._id}>
                                <li>
                                  {editingSubCatId !== subCat._id ? (
                                    <div className="rounded-lg py-2 px-3 transition-colors duration-300 bg-white flex items-center justify-between">
                                      <span className='capitalize'>{subCat.subCategory}</span>
                                      <div className="acts flex items-center gap-1">
                                        <Button className="dark-color !rounded-full !p-2 !min-w-auto" onClick={() => editSubCategory(subCat._id, subCat.subCategory, cat._id)}>
                                          <Tooltip title="Edit" placement="top" arrow>
                                            <span>
                                              <FaRegEdit className="text-[1.7rem]" />
                                            </span>
                                          </Tooltip>
                                        </Button>

                                        {isDeletingSingle && isDeleting === subCat._id ?
                                          <CircularProgress
                                            size={15}
                                            thickness={3}
                                            sx={{
                                              color: '#333',
                                            }}
                                          />
                                          :
                                          <Button
                                            className="dark-color !rounded-full !p-2 !min-w-auto"
                                            onClick={() => handleDelete(setSubCategories, 'sub', subCat._id)}>
                                            <Tooltip title="Delete" placement="top" arrow>
                                              <span>
                                                <AiOutlineDelete className="text-[1.7rem]" />
                                              </span>
                                            </Tooltip>
                                          </Button>}
                                      </div>
                                    </div>
                                  ) : (
                                    <form onSubmit={handleSubmit((data) => onSubmit('sub', subCat._id, setSubCategories, data), onError)}>
                                      <ul className="flex gap-4 items-center">
                                        <li>
                                          <FormControl variant="outlined" className="w-full">
                                            <Select
                                              sx={{
                                                paddingRight: '2rem',
                                                fontSize: '1.4rem',
                                                fontWeight: 500,
                                                textTransform: 'capitalize',
                                                color: '#555'
                                              }}
                                              labelId={subCat._id}
                                              id={subCat._id}
                                              {...register('category')}
                                            defaultValue={cat._id}
                                            >
                                              {categories.map((catMenu) => (
                                                <MenuItem
                                                  sx={{
                                                    fontSize: '1.4rem',
                                                    fontWeight: 500,
                                                    textTransform: 'capitalize',
                                                    color: '#555'
                                                  }}
                                                  value={catMenu._id}
                                                  key={catMenu._id}
                                                >
                                                  {catMenu.category}
                                                </MenuItem>
                                              ))}
                                            </Select>
                                          </FormControl>
                                        </li>
                                        <li>
                                          <input
                                            defaultValue={subCat.subCategory}
                                            {...register('subCategory', { required: 'Sub Category Name is required' })}
                                            onChange={(e) => e.target.value}
                                            type="text"
                                            className="text-[1.4rem] capitalize text-[#555] font-medium w-full py-4 placeholder:text-[#999] border border-[rgba(0,0,0,0.5)] rounded-md px-2"
                                            placeholder="Sub Category Name"
                                          />
                                        </li>
                                        <li className="flex items-center gap-3">
                                          <Button
                                            type='submit'
                                            disabled={isEditing === subCat._id}
                                            className="!min-w-auto !px-4 !py-2 !rounded-md !bg-blue-500 !text-white !text-[1.4rem] !font-medium !capitalize disabled:opacity-35 disabled:select-none disabled:cursor-not-allowed"
                                          >
                                            {isEditing === subCat._id ?
                                              <ThreeDots
                                                visible={true}
                                                height="2.5rem"
                                                width="2.5rem"
                                                color="#fff"
                                                radius="9"
                                                ariaLabel="three-dots-loading"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                              />
                                              :
                                              'Edit'
                                            }
                                          </Button>
                                          <Button
                                            type='button'
                                            disabled={isEditing === subCat._id}
                                            className="!min-w-auto !px-4 !py-2 !rounded-md !bg-red-500 !text-white !text-[1.4rem] !font-medium !capitalize disabled:opacity-35 disabled:select-none disabled:cursor-not-allowed"
                                            onClick={() => setEditingSubCatId(null)}>
                                            Cancel
                                          </Button>
                                        </li>
                                      </ul>
                                    </form>
                                  )}
                                  <ul className="px-10 pt-2">
                                    {nestedSubCategories.filter(nestedSubCat => nestedSubCat.subCategory._id === subCat._id).map((nestedSubCat) => {
                                      return (
                                        <React.Fragment key={nestedSubCat._id}>
                                          {editingNestedSubCatId !== nestedSubCat._id ? (
                                            <li className="rounded-lg py-2 px-3 transition-colors duration-300 hover:bg-white flex items-center justify-between">
                                              <span className='capitalize'>{nestedSubCat.nestedSubCategory}</span>
                                              <div className="acts flex items-center gap-1">
                                                <Button
                                                  className="dark-color !rounded-full !p-2 !min-w-auto"
                                                  onClick={() => editNestedSubCategory(nestedSubCat._id, nestedSubCat.nestedSubCategory, subCat._id)}
                                                >
                                                  <Tooltip title="Edit" placement="top" arrow>
                                                    <span>
                                                      <FaRegEdit className="text-[1.7rem]" />
                                                    </span>
                                                  </Tooltip>
                                                </Button>

                                                {isDeletingSingle && isDeleting === nestedSubCat._id ?
                                                  <CircularProgress
                                                    size={15}
                                                    thickness={3}
                                                    sx={{
                                                      color: '#333',
                                                    }}
                                                  />
                                                  :
                                                  <Button
                                                    className="dark-color !rounded-full !p-2 !min-w-auto"
                                                    onClick={() => handleDelete(setNestedSubCategories, 'sub/nested', nestedSubCat._id)}>
                                                    <Tooltip title="Delete" placement="top" arrow>
                                                      <span>
                                                        <AiOutlineDelete className="text-[1.7rem]" />
                                                      </span>
                                                    </Tooltip>
                                                  </Button>}
                                              </div>
                                            </li>
                                          ) : (
                                            <form onSubmit={handleSubmit((data) => onSubmit('sub/nested', nestedSubCat._id, setNestedSubCategories, data), onError)}>
                                              <ul className="flex gap-4 items-center">
                                                <li>
                                                  <FormControl variant="outlined" className="w-full">
                                                    <Select
                                                      sx={{
                                                        paddingRight: '2rem',
                                                        fontSize: '1.4rem',
                                                        fontWeight: 500,
                                                        textTransform: 'capitalize',
                                                        color: '#555'
                                                      }}
                                                      labelId={nestedSubCat._id}
                                                      id={nestedSubCat._id}
                                                      {...register('subCategory')}
                                                    defaultValue={subCat._id}
                                                    >
                                                      {subCategories.map((subMenu) => (
                                                        <MenuItem
                                                          sx={{
                                                            fontSize: '1.4rem',
                                                            fontWeight: 500,
                                                            textTransform: 'capitalize',
                                                            color: '#555'
                                                          }}
                                                          value={subMenu._id}
                                                          key={subMenu._id}
                                                        >
                                                          {subMenu.subCategory}
                                                        </MenuItem>
                                                      ))}
                                                    </Select>
                                                  </FormControl>
                                                </li>
                                                <li>
                                                  <input
                                                    type="text"
                                                    id="nestedSubCat"
                                                    className="text-[1.4rem] text-[#555] capitalize font-medium w-full py-4 placeholder:text-[#999] border border-[rgba(0,0,0,0.5)] rounded-md px-2"
                                                    {...register('nestedSubCategory', { required: 'Nested Sub Category name is required' })}
                                                    defaultValue={nestedSubCat.nestedSubCategory}
                                                    onChange={(e) => e.target.value}
                                                    placeholder="Enter Inner Sub Category Name"
                                                  />
                                                </li>
                                                <li className="flex items-center gap-3">
                                                  <Button
                                                    type='submit'
                                                    disabled={isEditing === nestedSubCat._id}
                                                    className="!min-w-auto !px-4 !py-2 !rounded-md !bg-blue-500 !text-white !text-[1.4rem] !font-medium !capitalize disabled:opacity-35 disabled:cursor-not-allowed"
                                                  >
                                                    {isEditing === nestedSubCat._id ? (
                                                      <ThreeDots
                                                        visible={true}
                                                        height="2.5rem"
                                                        width="2.5rem"
                                                        color="#fff"
                                                        radius="9"
                                                        ariaLabel="three-dots-loading"
                                                        wrapperStyle={{}}
                                                      />
                                                    ) : (
                                                      'Edit'
                                                    )}
                                                  </Button>

                                                  <Button
                                                    type='button'
                                                    disabled={isEditing === nestedSubCat._id}
                                                    className="!min-w-auto !px-4 !py-2 !rounded-md !bg-red-500 !text-white !text-[1.4rem] !font-medium !capitalize disabled:opacity-35 disabled:cursor-not-allowed"
                                                    onClick={() => setEditingNestedSubCatId(null)}
                                                  >
                                                    Cancel
                                                  </Button>
                                                </li>
                                              </ul>
                                            </form>
                                          )}
                                        </React.Fragment>
                                      )
                                    })}
                                  </ul>
                                </li>
                              </React.Fragment>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubCategories
