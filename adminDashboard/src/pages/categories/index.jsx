import { useState, useEffect, useContext } from 'react'
import { context } from '../../App'
import ItemsTable from '../../components/itemsTable'
import CategoriesTableRow from '../../components/categoriesTableRow'
import { Button } from '@mui/material'
import DeleteMultipleData from '../../helpers/deleteMultipleData'

import { BiSearch } from 'react-icons/bi'
import { MutatingDots, ThreeDots } from 'react-loader-spinner'

const Categories = () => {

    const { isItemSelected, setIsItemSelected, categories, setCategories, setIsError, setIsSuccess, appURI, selectedItems, setSelectedItems, isLoading } = useContext(context)

    const [isDeleting, setIsDeleting] = useState(false)

    const handleMultipleDeletion = () => {
        const body = { catIds: selectedItems }
        DeleteMultipleData(setCategories, setIsDeleting, setIsError, setIsSuccess, appURI, 'category', body, setSelectedItems, setIsItemSelected)
    }

    return (
        <section>
            <div className="wrapper">
                <div className="relative shadow-[0_0_10px_rgba(0,0,0,0.15)] px-2 sm:rounded-lg grid grid-rows-[max-content_1fr] overflow-hidden bg-white">
                    <div className="flex items-center justify-between px-6 py-7">
                        <h2 className='text-[1.8rem] font-[600]'>Categories List</h2>
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
                    <div className="tableContainer">
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
                            <ItemsTable
                                tableHeading={['Category Img', 'Category Name', 'SubCategory Name', 'Actions']}
                                ItemsTableRow={CategoriesTableRow}
                                ITEMS={categories || []}
                                isDeleting={isDeleting}
                            />
                        }
                    </div>
                </div>
            </div>
        </section>
    )

}

export default Categories
