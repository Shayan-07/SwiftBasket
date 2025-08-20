import { useState, useContext } from 'react'
import { Button, Checkbox, CircularProgress, Tooltip } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { context } from '../../App'
import EditDrawer from '../editDrawer'
import HomeSlideFormBody from '../../pages/homeslides/addHomeSlides/homeSlideFormBody'
import DeleteSingleData from '../../helpers/deleteSingleData'

import { FaRegEdit } from "react-icons/fa"
import { AiOutlineDelete } from "react-icons/ai"

const HomeSlidesTableRow = ({ selected, onSelect, checkBoxColor, selectable, item, isDeleting }) => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

    const [openDrawer, setOpenDrawer] = useState(false)
    const [isDeletingSingle, setIsDeletingSingle] = useState(false)
    const { setHomeSlides, setIsError, setIsSuccess, appURI } = useContext(context)

    const toggleDrawer = (newOpen) => {
        setOpenDrawer(newOpen)
    }

    const handleDelete = () => {
        DeleteSingleData(setHomeSlides, setIsDeletingSingle, setIsError, setIsSuccess, appURI, 'homeslide', item._id)
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
            <TableCell className="py-6 pr-10 w-[100%]">
                <div className="prImg w-full h-[20rem] overflow-hidden rounded-2xl">
                    <img
                        src={item.imgUrl}
                        alt=""
                        className="w-full h-full object-cover object-center hover:scale-115 origin-center transition-all duration-300"
                    />
                </div>
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
                            editUri={'homeslide'}
                            item={item}
                            formBody={HomeSlideFormBody}
                            isImgArr={true}
                            setData={setHomeSlides}
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
    )
}

export default HomeSlidesTableRow
