import { useState } from 'react'
import { Button, Checkbox, CircularProgress, Tooltip, TableCell, TableRow } from '@mui/material'

import { FaRegEdit } from "react-icons/fa"
import { AiOutlineDelete } from "react-icons/ai"
import CategoryFormBody from '../../pages/categories/addCategories/categoryFormBody'
import { context } from '../../App'
import { useContext } from 'react'
import EditDrawer from '../editDrawer';
import DeleteSingleData from '../../helpers/deleteSingleData'

const CategoriesTableRow = ({ selected, onSelect, checkBoxColor, selectable, item, isDeleting }) => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

    const [openDrawer, setOpenDrawer] = useState(false)
    const [isDeletingSingle, setIsDeletingSingle] = useState(false)
    const { setCategories, setIsError, setIsSuccess, appURI } = useContext(context)

    const toggleDrawer = (newOpen) => {
        setOpenDrawer(newOpen)
    }

    const handleDelete = () => {
        DeleteSingleData(setCategories, setIsDeletingSingle, setIsError, setIsSuccess, appURI, 'category', item._id)
    }

    return (
        <TableRow className={`border-b border-gray-200 dark-color ${isDeleting && selected && 'opacity-75 select-none pointer-events-none'}`} hover selected={selected}>
            {selectable &&
                <TableCell padding="checkbox" className="px-3 py-4">
                    <Checkbox
                        sx={checkBoxColor}
                        {...label}
                        size="large"
                        checked={selected}
                        onChange={onSelect}
                    />
                </TableCell>}
            <TableCell className="py-6 pr-10">
                <div className="catImg w-[6rem] h-[6rem] overflow-hidden">
                    <img
                        src={item.imgUrl}
                        alt=""
                        className="w-full h-full object-cover object-top-left hover:scale-115 origin-top transition-all duration-300"
                    />
                </div>
            </TableCell>
            <TableCell className="!py-6 !pr-10 !whitespace-nowrap !text-[1.3rem] !font-medium">
                <span className='dark-bg rounded-[1.3rem] py-3 px-5 text-white capitalize'>{item.category}</span>
            </TableCell>
            <TableCell className="!py-6 !pr-10 !whitespace-nowrap !text-[1.3rem] !font-medium">
                <ul className='flex items-center gap-x-2.5'>
                    {
                        item.subCategory.length === 0 ?
                            <li className='primary-bg rounded-[1.3rem] py-2 px-5 text-white capitalize'>No Sub Category To Show</li>
                            :
                            item.subCategory.map((subCat) => {
                                return (
                                    <li className='primary-bg rounded-[1.3rem] py-2 px-5 text-white capitalize' key={subCat._id}>{subCat.subCategory}</li>
                                )
                            })
                    }
                </ul>
            </TableCell>
            <TableCell className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium">
                <div className="acts flex items-center gap-2">
                    <div className="edit">
                        <Button className="dark-color !rounded-full !p-2 !min-w-auto" onClick={() => toggleDrawer(true)}>
                            <Tooltip title="Edit" placement="top" arrow>
                                <span>
                                    <FaRegEdit className="text-[1.7rem]" />
                                </span>
                            </Tooltip>
                        </Button>
                        <EditDrawer
                            toggleDrawer={toggleDrawer}
                            openDrawer={openDrawer}
                            editUri={'category'}
                            item={item}
                            formBody={CategoryFormBody}
                            isImgArr={true}
                            setData={setCategories}
                        />
                    </div>

                    <div className="delete">
                        {isDeletingSingle ?
                            <CircularProgress
                                size={15}
                                thickness={3}
                                sx={{
                                    color: '#333',
                                }}
                            />
                            :
                            <Button className="dark-color !rounded-full !p-2 !min-w-auto" onClick={handleDelete}>
                                <Tooltip title="Delete" placement="top" arrow>
                                    <span>
                                        <AiOutlineDelete className="text-[1.7rem]" />
                                    </span>
                                </Tooltip>
                            </Button>
                        }
                    </div>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default CategoriesTableRow
