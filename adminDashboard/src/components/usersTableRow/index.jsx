import { Checkbox } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import { LuMail, LuCalendar } from "react-icons/lu"

const UsersTableRow = ({ selected, onSelect, checkBoxColor, selectable, item }) => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

    return (
        <TableRow className="border-b border-gray-200 dark-color" hover selected={selected}>
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
            <TableCell>
                <img
                    src={item.avatar}
                    alt=""
                    className="w-[6rem] h-[6rem] object-cover object-top-left"
                />
            </TableCell>
            <TableCell className="line-clamp-1">
                <h4 className="text-[1.4rem] font-medium">{item.name}</h4>
            </TableCell>
            <TableCell>
                <div className="line-clamp-1 flex items-center gap-2">
                    <LuMail className='!text-[1.7rem]' />
                    <span className='text-[1.3rem] font-medium'>{item.email}</span>
                </div>
            </TableCell>
            <TableCell className="!py-6 !pr-10 !whitespace-nowrap !text-[1.3rem] !font-medium">
                <div className="flex items-center gap-3">
                    <LuCalendar className='!text-[1.7rem]' />
                    <span>{item.createdAt.split('T')[0]}</span>
                </div>
            </TableCell>

        </TableRow>
    )
}

export default UsersTableRow