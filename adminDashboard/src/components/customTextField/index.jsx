import React, { useState, forwardRef } from 'react'
import TextField from '@mui/material/TextField'
import { Button, InputAdornment, Tooltip } from '@mui/material'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

const CustomTextField = forwardRef(({ sx = {}, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <TextField
      type={type !== 'password' ? type : (showPassword ? 'text' : 'password')}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            {type === 'password' && (
              <Tooltip title={showPassword ? 'Hide password' : 'Show password'}>
                <Button
                  className='!rounded-full !p-2 !min-w-auto !-right-3.5 !text-[#61656e]'
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <FaRegEyeSlash className='text-[2rem]' /> : <FaRegEye className='text-[2rem]' />}
                </Button>
              </Tooltip>
            )}
          </InputAdornment>
        )
      }}
      fullWidth
      autoComplete='off'
      sx={{
        '& .MuiInputLabel-root': {
          fontSize: '1.5rem',
          fontWeight: 450,
          color: '#6a7282',
          left: '1rem',
          transition: 'all 0.2s ease-in-out',
        },
        '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
          top: '50%',
          transform: 'translateY(-50%)'
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'var(--primary-color)',
        },
        '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
          fontSize: '1.5rem',
          top: 0,
          background: 'white',
          padding: '0 5px 0 0',
          left: '0',
          fontWeight: '500'
        },
        '& .MuiInputBase-input': {
          fontSize: '1.5rem',
          fontWeight: 500,
          color: '#3e3e3e',
          padding: '1rem',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          border: '1px solid var(--primary-color)',
        },
        '& .Mui-disabled': {
          userSelect: 'none',
          cursor: 'not-allowed',
        },
        ...sx,
      }}
      inputRef={ref}
      {...props}
    />
  )
})

export default CustomTextField
