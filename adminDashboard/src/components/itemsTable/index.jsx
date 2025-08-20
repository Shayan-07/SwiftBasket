import { useContext, useEffect, useState } from 'react'
import { context } from '../../App'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Checkbox, Box, Pagination } from '@mui/material'

const ItemsTable = ({ tableHeading, ItemsTableRow, selectable = true, ITEMS = [], isDeleting }) => {

  const { setIsItemSelected, selectedItems, setSelectedItems } = useContext(context)

  const [page, setPage] = useState(0)
  const rowsPerPage = 7

  useEffect(() => {
    setIsItemSelected(selectedItems.length !== 0)
  }, [selectedItems, setIsItemSelected])

  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (event) => {
    const currentPageItems = ITEMS?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    const currentPageIds = currentPageItems.map((item) => item._id)

    if (event.target.checked) {
      setSelectedItems((prev) => [...new Set([...prev, ...currentPageIds])])
    } else {
      setSelectedItems((prev) => prev.filter((id) => !currentPageIds.includes(id)))
    }
  }

  const checkBoxColor = {
    color: '#3e3e3e',
    '&.Mui-checked': {
      color: '#ff5252',
    },
    '&.MuiCheckbox-indeterminate': {
      color: '#ff5252',
    },
  }

  const currentPageItems = ITEMS?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const allSelected = currentPageItems.length > 0 && currentPageItems.every((item) => selectedItems.includes(item._id))

  return (
    <Box>
      <TableContainer>
        <Table stickyHeader aria-label="items table">
          <TableHead>
            <TableRow>
              {selectable !== false && (
                <TableCell padding="checkbox" sx={{ pr: 1 }}>
                  <Checkbox
                    sx={checkBoxColor}
                    size="large"
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {tableHeading.map((label) => (
                <TableCell key={label} sx={{ fontSize: '1.6rem', fontWeight: 600, pl: 2 }} className='!whitespace-nowrap'>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {ITEMS.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <ItemsTableRow
                key={item._id}
                item={item}
                selected={selectedItems.includes(item._id)}
                onSelect={() => handleSelect(item._id)}
                checkBoxColor={checkBoxColor}
                selectable={selectable}
                isDeleting={isDeleting}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {ITEMS.length > rowsPerPage && (
        <Box display={'flex'} justifyContent={'end'} padding={'1.5rem 2rem'}>
          <Pagination
            count={Math.ceil(ITEMS.length / rowsPerPage)}
            page={page + 1}
            onChange={(event, newPage) => setPage(newPage - 1)}
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
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
        </Box>
      )}

    </Box>
  )
}

export default ItemsTable
