import { useState, useContext, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterBar from '../../components/filterBar'
import ProductCard from '../../components/productCard'
import ProductCardListView from '../../components/productCardListView'
import { Menu, MenuItem, List, ListItemButton, ListItemText, Pagination, Skeleton, Button } from '@mui/material'

import { GrList } from "react-icons/gr"
import { LuLayoutGrid } from "react-icons/lu"
import { context } from '../../App'

const ProductsListing = () => {

    const { setIsError, appURI } = useContext(context)
    const [filteredProducts, setFilteredProducts] = useState([])
    const [isProductLoading, setIsProductLoading] = useState(false)

    const [searchParams] = useSearchParams()
    const categoryParam = searchParams.get('category')
    const subCategoryParam = searchParams.get('subcategory')
    const nestedSubCategoryParam = searchParams.get('nestedsubcategory')

    const searchedKeywordParam = searchParams.get('search')

    const [itemView, setItemView] = useState('grid')
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 12

    const sortOptions = [
        { key: 'az', value: 'Name, A to Z' },
        { key: 'za', value: 'Name, Z to A' },
        { key: 'lth', value: 'Price, low to high' },
        { key: 'htl', value: 'Price, high to low' }
    ]

    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedSortIndex, setSelectedSortIndex] = useState(0)
    const open = Boolean(anchorEl)

    const handleSortClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleSortSelect = (event, index) => {
        setSelectedSortIndex(index)
        setAnchorEl(null)
    }

    const handleSortClose = () => {
        setAnchorEl(null)
    }

    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedRating, setSelectedRating] = useState([])
    const [value, setValue] = useState([0, 5000])

    useEffect(() => {
        setIsProductLoading(true)
        fetch(`${appURI}/product/filter?${sortOptions[selectedSortIndex].key}=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                catType:
                    (selectedCategories.length > 0 || categoryParam) && 'category' ||
                    subCategoryParam && 'subCategory' ||
                    nestedSubCategoryParam && 'nestedSubCategory',
                ids:
                    (selectedCategories.length > 0 && selectedCategories) ||
                    (categoryParam && [categoryParam]) ||
                    (subCategoryParam && [subCategoryParam]) ||
                    nestedSubCategoryParam && [nestedSubCategoryParam],
                searchedKeyword: searchedKeywordParam && searchedKeywordParam || null,
                ratings: selectedRating,
                minPrice: value[0],
                maxPrice: value[1]
            }),
            credentials: 'include'
        }).then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setFilteredProducts(resData.data)
                    setCurrentPage(1)
                } else {
                    setIsError(resData.message)
                }
            })
            .catch(error => setIsError('Something went wrong!'))
            .finally(() => setIsProductLoading(false))
    }, [categoryParam, subCategoryParam, nestedSubCategoryParam, searchedKeywordParam, selectedSortIndex, selectedCategories, selectedRating, value])

    return (
        <section className='productListing py-8'>
            <div className="wrapper grid grid-cols-[18.5%_78.5%] justify-between">
                <FilterBar
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedRating={selectedRating}
                    setSelectedRating={setSelectedRating}
                    value={value}
                    setValue={setValue}
                />
                <div className="productsBox">
                    <div className="listViewEditor bg-[#f1f1f1] p-3 rounded-2xl flex items-center justify-between">
                        <div className="viewBox flex items-center">
                            <Button
                                className={`!min-w-auto !p-3 !rounded-full !text-[2rem] ${(itemView === 'list') ? '!bg-[#ddd] !text-[#ff5252]' : '!bg-transparent !text-[#3e3e3e]'}`} onClick={() => setItemView('list')}>
                                <GrList />
                            </Button>
                            <Button
                                className={`!min-w-auto !p-3 !rounded-full !text-[2rem] ${(itemView === 'grid') ? '!bg-[#ddd] !text-[#ff5252]' : '!bg-transparent !text-[#3e3e3e]'}`}
                                onClick={() => setItemView('grid')}>
                                <LuLayoutGrid />
                            </Button>
                            <p className='text-[1.5rem] font-medium text-[#777] pl-4 select-none'>There are {filteredProducts.length} products</p>
                        </div>

                        <div className="sortingBox flex gap-3 items-center px-3">
                            <h3 className='text-[#777] text-[1.5rem] font-medium'>Sort By:</h3>
                            <div className="sortMenu">
                                <List
                                    component="nav"
                                    aria-label="Sort Options"
                                    sx={{ bgcolor: 'white', borderRadius: 1, padding: '0' }}
                                >
                                    <ListItemButton
                                        id="sort-button"
                                        aria-haspopup="listbox"
                                        aria-controls="sort-menu"
                                        aria-label="Sort Products"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleSortClick}
                                        className='!py-2 !px-4 !rounded-lg leading-none'
                                    >
                                        <ListItemText
                                            secondary={sortOptions[selectedSortIndex].value}
                                            secondaryTypographyProps={{ fontSize: '1.3rem', color: '#3e3e3e' }}
                                        />
                                    </ListItemButton>
                                </List>

                                <Menu
                                    id="sort-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleSortClose}
                                    slotProps={{
                                        list: {
                                            'aria-labelledby': 'sort-button',
                                            role: 'listbox',
                                        },
                                    }}
                                    className="ml-4 mt-1"
                                >
                                    {sortOptions.map((option, index) => (
                                        <MenuItem
                                            key={option.value}
                                            selected={index === selectedSortIndex}
                                            onClick={(event) => handleSortSelect(event, index)}
                                            className='!text-[1.4rem] !text-[#3e3e3e] capitalize'
                                        >
                                            {option.value}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <div className={`productsList my-10 flex flex-wrap`}>
                        {itemView === 'grid' ? (
                            <div className='productCards w-full'>
                                {isProductLoading ? (
                                    <ul className="grid grid-cols-4 justify-between gap-5 py-10">
                                        {[...Array(4)].map((_, index) => (
                                            <div className="productCard productItem overflow-hidden rounded-3xl shadow-[4px_4px_8px_rgba(0,0,0,0.13)] !w-full" key={index}>
                                                <div className="productImg h-[20rem] relative">
                                                    <Skeleton variant="rectangular" width="100%" height="100%" className="!absolute !top-0 !left-0 !h-full !w-full" />
                                                    <div className="absolute top-[6%] left-[4%]">
                                                        <Skeleton variant="rounded" width={50} height={24} />
                                                    </div>
                                                </div>
                                                <div className="productDetails text-[#3e3e3e] flex flex-col gap-3 px-3 rounded-b-3xl py-6">
                                                    <Skeleton variant="text" width="70%" height={24} />
                                                    <Skeleton variant="text" width="100%" height={28} />
                                                    <Skeleton variant="rectangular" width={100} height={24} />
                                                    <div className="productPrice flex justify-between text-[1.6rem] font-[600]">
                                                        <Skeleton variant="text" width={60} />
                                                        <Skeleton variant="text" width={60} />
                                                    </div>
                                                    <Skeleton variant="rounded" height={40} width="100%" className="!mt-2" />
                                                </div>
                                            </div>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="grid grid-cols-4 gap-5 justify-between">
                                        {currentProducts.map(product => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {isProductLoading ? (
                                    [...Array(4)].map((_, i) => (
                                        <div className='productCardListView productItem overflow-hidden grid grid-cols-[27.5%_72.5%] items-center py-3 w-full' key={i}>
                                            <div className="productImg h-[30rem] w-full relative rounded-l-2xl overflow-hidden">
                                                <Skeleton variant="rectangular" width="100%" height="100%" className="!absolute !top-0 !left-0 !h-full !w-full !rounded-l-2xl" />
                                                <div className="absolute top-[6%] left-[4%]">
                                                    <Skeleton variant="rounded" width={50} height={24} />
                                                </div>
                                            </div>
                                            <div className="productDetails h-full bg-[#f1f1f1] text-[#3e3e3e] flex flex-col gap-3 px-3 py-6 pl-20 pr-10 rounded-r-2xl justify-center">
                                                <Skeleton variant="text" width="20%" height={28} />
                                                <Skeleton variant="text" width="30%" height={30} />
                                                <Skeleton variant="text" width="100%" height={60} />
                                                <Skeleton variant="text" width="20%" height={28} />
                                                <div className="flex gap-10">
                                                    <Skeleton variant="text" width={60} height={24} />
                                                    <Skeleton variant="text" width={60} height={24} />
                                                </div>
                                                <Skeleton variant="rounded" height={48} width={180} className="!mt-2" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    currentProducts.map(product => (
                                        <ProductCardListView key={product._id} product={product} />
                                    ))
                                )}
                            </>
                        )}
                    </div>

                    {filteredProducts.length > productsPerPage &&
                        <Pagination
                            count={Math.ceil(filteredProducts.length / productsPerPage)}
                            page={currentPage}
                            onChange={(e, val) => setCurrentPage(val)}
                            className="flex justify-end mt-8"
                            color="primary"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    fontSize: '1.4rem',
                                    color: '#3e3e3e',
                                    fontWeight: 450,
                                },
                                '& .MuiPaginationItem-icon': {
                                    fontSize: '2rem',
                                },
                                '& .Mui-selected': {
                                    backgroundColor: '#ff5252 !important',
                                    color: '#fff',
                                },
                            }}
                        />
                    }
                </div>
            </div>
        </section>
    )
}

export default ProductsListing
