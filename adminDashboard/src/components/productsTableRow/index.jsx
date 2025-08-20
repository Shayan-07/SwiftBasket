import { useState, useContext } from 'react'
import { Button, Checkbox, CircularProgress, Rating, Tooltip } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { context } from '../../App'
import EditDrawer from '../editDrawer'
import ProductFormBody from '../../pages/products/addProducts/productFormBody'
import DeleteSingleData from '../../helpers/deleteSingleData'

import { FaRegEdit } from "react-icons/fa"
import { AiOutlineDelete } from "react-icons/ai"

const ProductsTableRow = ({ selected, onSelect, checkBoxColor, selectable, item, isDeleting }) => {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

  const { setProducts, setIsError, setIsSuccess, appURI } = useContext(context)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [isDeletingSingle, setIsDeletingSingle] = useState(false)

  const toggleDrawer = (newOpen) => {
    setOpenDrawer(newOpen)
  }

  const handleDelete = () => {
    DeleteSingleData(setProducts, setIsDeletingSingle, setIsError, setIsSuccess, appURI, 'product', item._id)
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
      <TableCell className="py-6 pr-10 whitespace-nowrap text-[1.3rem] font-medium">
        <div className="product grid grid-cols-[6rem_1fr] items-center gap-3">
          <div className="prImg w-full h-[6rem] rounded-xl overflow-hidden">
            <img
              src={item.mediaImgUrls[0]}
              alt=""
              className="w-full h-full object-cover object-top-left hover:scale-115 origin-top transition-all duration-300"
            />
          </div>
          <ul>
            <li className="brand line-clamp-1">
              <h4 className="text-[1.4rem] font-[600] capitalize">{item.brandName}</h4>
            </li>
            <li className="title line-clamp-1">
              <p className="text-[1.4rem] font-medium capitalize">
                {item.title}
              </p>
            </li>
          </ul>
        </div>
      </TableCell>
      <TableCell className="!py-6 !pr-10 !whitespace-nowrap !text-[1.3rem] !font-medium capitalize">{item?.category?.category || 'None'}</TableCell>
      <TableCell className="!py-6 !pr-10 !whitespace-nowrap !text-[1.3rem] !font-medium capitalize">{item?.subCategory?.subCategory || 'None'}</TableCell>
      <TableCell className="!py-6 !pr-10 !whitespace-nowrap !text-[1.3rem] !font-medium capitalize">${item.price}</TableCell>
      <TableCell className="!py-6 !pr-10 !whitespace-nowrap !text-[1.3rem] !font-medium capitalize">{item.soldItemsCount} Sold</TableCell>
      <TableCell className="!py-6 !pr-10 !whitespace-nowrap !text-[1.3rem] !font-medium capitalize">{item.stock}</TableCell>
      <TableCell className="!py-6 !pr-10 !whitespace-nowrap !text-[1.3rem] !font-medium capitalize">
        <Rating name="read-only" value={item.totalRating} precision={0.5} readOnly size="large" />
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
              editUri={'product'}
              item={item}
              formBody={ProductFormBody}
              isImgArr={true}
              setData={setProducts}
              isControl={true}
              isProduct={true}
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

export default ProductsTableRow
