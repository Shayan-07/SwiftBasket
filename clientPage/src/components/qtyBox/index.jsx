import { Button } from '@mui/material'
import { FaAngleUp } from "react-icons/fa6"

const QtyBox = ({ inputValue, setInputValue, onChange = () => {} }) => {
    const handleBlur = () => {
        const numericValue = parseInt(inputValue)
        if (isNaN(numericValue) || numericValue < 1) {
            setInputValue(1)
            onChange(1)
        } else {
            setInputValue(numericValue)
            onChange(numericValue)
        }
    }

    return (
        <div className="qtyBox w-[70px] flex justify-between gap-1 rounded-lg border border-[rgba(0,0,0,0.2)] px-2">
            <input
                type="text"
                className="w-full font-medium text-[1.5rem] text-center"
                value={inputValue}
                onBlur={handleBlur}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setInputValue(val)
                }}
            />
            <div className="inputAction flex flex-col justify-center">
                <Button
                    className='!rounded-lg !text-[1.3rem] !leading-none !min-w-auto !p-1 !text-[#3e3e3e]'
                    onClick={() => {
                        const newVal = parseInt(inputValue) || 0
                        const updated = newVal + 1
                        setInputValue(updated)
                        onChange(updated)
                    }}
                >
                    <FaAngleUp />
                </Button>
                <Button
                    className='!rounded-lg !text-[1.3rem] !leading-none !min-w-auto !p-1 !text-[#3e3e3e]'
                    onClick={() => {
                        const newVal = parseInt(inputValue) || 0
                        if (newVal > 1) {
                            const updated = newVal - 1
                            setInputValue(updated)
                            onChange(updated)
                        }
                    }}
                >
                    <FaAngleUp className='rotate-180' />
                </Button>
            </div>
        </div>
    )
}

export default QtyBox