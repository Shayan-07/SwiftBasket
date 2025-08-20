import { useContext, useState } from 'react'
import { context } from '../../App'
import { Button } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import ProductsTableRow from '../productsTableRow'
import ItemsTable from '../itemsTable'

import { BiSearch } from "react-icons/bi"
import { MutatingDots, ThreeDots } from 'react-loader-spinner'
import DeleteMultipleData from '../../helpers/deleteMultipleData'
import GetData from '../../helpers/getData'
import FilterData from '../../helpers/filterDataFunc'

const ProductsTable = () => {
  const { isItemSelected, setIsItemSelected, products, setProducts, setIsError, setIsSuccess, appURI, selectedItems, setSelectedItems, categories, subCategories, isLoading } = useContext(context)

  const [isDeleting, setIsDeleting] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [catValue, setCatValue] = useState('')
  const [subCatValue, setSubCatValue] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')

  const handleMultipleDeletion = () => {
    const body = { productIds: selectedItems }
    DeleteMultipleData(setProducts, setIsDeleting, setIsError, setIsSuccess, appURI, 'product', body, setSelectedItems, setIsItemSelected)
  }

  const filterProductsByCatType = async (id, catType) => {
    if (!id || id === '') {
      setIsFiltering(true)
      const productsRes = await GetData(appURI, 'product')
      if (productsRes.data) {
        setProducts(productsRes.data)
      } else {
        setIsError(productsRes.error)
      }
      setIsFiltering(false)
      return
    }
    const payload = {
      catType,
      ids: [id]
    }
    FilterData(appURI, payload, setIsFiltering, setProducts, setIsError)
  }

  const filterProductsByKeyword = async (searchedKeyword) => {
    const payload = {
      searchedKeyword
    }
    FilterData(appURI, payload, setIsFiltering, setProducts, setIsError)
  }


  return (
    <section>
      <div className="relative shadow-[0_0_10px_rgba(0,0,0,0.15)] px-2 sm:rounded-lg grid grid-rows-[max-content_1fr] overflow-hidden bg-white">
        <div className="productSearch">
          <div className='grid grid-cols-[1fr_1fr_1fr_max-content] px-4 gap-10 py-7'>
            <div className="selectCat">
              <h2 className='text-[1.5rem] font-[600] dark-color mb-3'>Categoriez By</h2>
              <FormControl
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #ff5252',
                  },
                }}
                variant="outlined"
                className='w-full'>
                <Select
                  labelId="cat-label"
                  id="cat-label"
                  value={catValue}
                  onChange={(e) => {
                    const newCat = e.target.value
                    setCatValue(newCat)
                    filterProductsByCatType(newCat, 'category')
                  }}
                  className='capitalize'
                >
                  <MenuItem className="!text-[1.4rem] !font-medium" value=""><em>None</em></MenuItem>
                  {categories.map(cat => {
                    return (
                      <MenuItem className="!text-[1.4rem] !font-medium capitalize" key={cat._id} value={cat._id}>{cat.category}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="selectSubCat">
              <h2 className='text-[1.5rem] font-[600] dark-color mb-3'>Sub Categoriez By</h2>
              <FormControl
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #ff5252',
                  },
                }}
                variant="outlined"
                className='w-full'>
                <Select
                  labelId="subCat-label"
                  id="subCat-label"
                  value={subCatValue}
                  onChange={(e) => {
                    const newSubCat = e.target.value
                    setSubCatValue(newSubCat)
                    filterProductsByCatType(newSubCat, 'subCategory')
                  }}
                  className='capitalize'
                >
                  <MenuItem className="!text-[1.4rem] !font-medium" value="">None</MenuItem>
                  {subCategories.filter(subCat => catValue ? subCat.category._id === catValue : subCat).map(subCat => {
                    return (
                      <MenuItem className="!text-[1.4rem] !font-medium capitalize" key={subCat._id} value={subCat._id}>{subCat.subCategory}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="searchBar h-max self-end mb-[0.15rem] flex items-center px-4 py-2 w-full border rounded-[4px] border-[rgba(0,0,0,0.3)] dark-color justify-between gap-1.5
              focus-within:border-[#ff5252]">
              <input
                type="text"
                className='text-[1.5rem] font-medium w-full'
                placeholder='Search Product'
                value={searchKeyword}
                onKeyDown={(e) => e.key === 'Enter' && searchKeyword && filterProductsByKeyword(searchKeyword)}
                onChange={(e) => setSearchKeyword(e.target.value)} />
              <Button className='!min-w-auto !p-2 !rounded-full dark-color' onClick={() => searchKeyword ? filterProductsByKeyword(searchKeyword) : null}>
                <BiSearch className='text-[1.8rem]' />
              </Button>
            </div>
            <div className="opts self-end mb-2 flex gap-5 items-center justify-end">
              <Button
                disabled={!isItemSelected || isDeleting}
                className='disabled:opacity-35 disabled:select-none disabled:cursor-not-allowed !min-w-auto !bg-blue-500 !text-[1.4rem] !capitalize !text-white !py-2 !px-7'>
                Export
              </Button>
              <Button
                disabled={!isItemSelected || isDeleting}
                onClick={isItemSelected ? handleMultipleDeletion : () => null}
                className='disabled:opacity-35 disabled:select-none disabled:cursor-not-allowed !min-w-auto !bg-red-500 !text-[1.4rem] !capitalize !text-white !py-2 !px-7 flex justify-center items-center gap-2'>
                {isDeleting ?
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
                  'Delete'
                }
              </Button>
            </div>
          </div>
        </div>
        <div className="tableContainer">
          {isLoading || isFiltering ?
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
            <ItemsTable
              tableHeading={['Product', 'Category', 'Sub-Category', 'Price', 'Sales', 'Stock', 'Rating', 'Actions']}
              ItemsTableRow={ProductsTableRow}
              ITEMS={products || []}
              isDeleting={isDeleting}
            />}
        </div>
      </div>
    </section>
  )
}

export default ProductsTable
