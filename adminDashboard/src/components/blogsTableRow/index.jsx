import { useState, useContext, useEffect } from 'react'
import { Button, Checkbox, CircularProgress, Tooltip } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { FaRegEdit } from "react-icons/fa"
import { AiOutlineDelete } from "react-icons/ai"
import DeleteSingleData from '../../helpers/deleteSingleData'
import { context } from '../../App'
import EditDrawer from '../editDrawer'
import BlogFormBody from '../../pages/blogs/addBlog/BlogsFormBody'
import { EditorProvider } from 'react-simple-wysiwyg'

const BlogsTableRow = ({ selected, onSelect, checkBoxColor, selectable, item, isDeleting }) => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

    const [openDrawer, setOpenDrawer] = useState(false)
    const [isDeletingSingle, setIsDeletingSingle] = useState(false)
    const { setBlogs, setIsError, setIsSuccess, appURI } = useContext(context)

    const toggleDrawer = (newOpen) => {
        setOpenDrawer(newOpen)
    }

    const handleDelete = () => {
        DeleteSingleData(setBlogs, setIsDeletingSingle, setIsError, setIsSuccess, appURI, 'blog', item._id)
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
                <div className="prImg w-[25rem] h-[13rem] overflow-hidden rounded-2xl">
                    <img
                        src={item.imgUrl}
                        alt=""
                        className="w-full h-full object-cover object-top-left hover:scale-115 origin-top transition-all duration-300"
                    />
                </div>
            </TableCell>
            <TableCell className="!py-6 !pr-10 !text-[1.3rem] !font-medium">
                <p className="line-clamp-3 capitalize">{item.title}</p>
            </TableCell>
            <TableCell className="!py-6 !pr-10 !text-[1.3rem] !font-medium">
                <p className="line-clamp-3">{item.description.replace(/<[^>]+>/g, '')}</p>
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
                        <EditorProvider>
                            <EditDrawer
                                toggleDrawer={toggleDrawer}
                                openDrawer={openDrawer}
                                editUri={'blog'}
                                item={item}
                                formBody={BlogFormBody}
                                isImgArr={true}
                                setData={setBlogs}
                                isControl={true}
                            />
                        </EditorProvider>
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

export default BlogsTableRow
