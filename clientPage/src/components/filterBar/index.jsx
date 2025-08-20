import { useState, useContext, useEffect } from 'react'
import { useLocation } from "react-router-dom"
import { Button, Checkbox, FormControlLabel } from '@mui/material'
import Slider from '@mui/material/Slider'
import Rating from '@mui/material/Rating'

import { FaAngleDown } from "react-icons/fa6"
import { context } from '../../App'

const FilterBar = ({ selectedCategories, setSelectedCategories, selectedRating, setSelectedRating, value, setValue }) => {

    const { categories } = useContext(context)

    const [categoryOpen, setCategoryOpen] = useState(false)
    const [ratingOpen, setRatingOpen] = useState(false)

    function valuetext(value) {
        return `${value}`
    }

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    
    const location = useLocation()

    const searchParams = new URLSearchParams(location.search)
    const categoryParam = searchParams.get('category')

    useEffect(() => {
        if (categories?.length > 0) {
            if (categoryParam) {
                setSelectedCategories([categoryParam])
            }
        }
    }, [categories, categoryParam])

    const handleCategoryToggle = (id) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter(prevId => prevId !== id) : [...prev, id]
        )
    }

    const handleRatingToggle = (ratingValue) => {
        setSelectedRating((prev) =>
            prev.includes(ratingValue)
                ? prev.filter(val => val !== ratingValue) : [...prev, ratingValue]
        )
    }

    return (
        <div className='filterBar text-[#3e3e3e]'>
            <div className="categoryFilter mb-10">
                <Button className='!p-2 !min-w-auto !text-[#3e3e3e] !w-full !justify-between' onClick={() => setCategoryOpen(!categoryOpen)}>
                    <span className='text-[1.8rem] font-[600] capitalize'>Shop By Category</span>
                    <FaAngleDown className={`text-[1.8rem] transition-all duration-150 ease-in-out ${categoryOpen ? 'rotate-180' : "rotate-0"}`} />
                </Button>
                <div className={`filter scrollable flex flex-col capitalize pl-10 overflow-y-scroll overflow-x-hidden transition-all duration-500 ${categoryOpen ? 'max-h-[200px]' : "max-h-0"}`}>
                    {categories?.map(cat => (
                        <FormControlLabel key={cat._id} label={cat.category} className='w-max'
                            control={
                                <Checkbox
                                    checked={selectedCategories.includes(cat._id)}
                                    onChange={() => handleCategoryToggle(cat._id)}
                                    sx={{ '&.Mui-checked': { color: '#ff5252' }, '& .MuiSvgIcon-root': { fontSize: '1.7rem' } }}
                                />
                            }
                        />
                    ))}
                </div>
            </div>
            <div className="ratingFilter mb-10">
                <Button className='!p-2 !min-w-auto !text-[#3e3e3e] !w-full !justify-between' onClick={() => setRatingOpen(!ratingOpen)}>
                    <span className='text-[1.8rem] font-[600] capitalize'>Filter By Rating</span>
                    <FaAngleDown className={`text-[1.8rem] transition-all duration-150 ease-in-out ${ratingOpen ? 'rotate-180' : "rotate-0"}`} />
                </Button>
                <div className={`filter flex flex-col capitalize pl-10 overflow-y-scroll overflow-x-hidden transition-all duration-500 ${ratingOpen ? 'max-h-[200px]' : "max-h-0"}`}>
                    {[5, 4, 3, 2, 1].map(rating => (
                        <FormControlLabel
                            key={rating}
                            label={<Rating name={`rating-${rating}`} value={rating} readOnly size="large" className='pt-[4.5px]' />}
                            className='w-max'
                            control={
                                <Checkbox
                                    checked={selectedRating.includes(rating)}
                                    onChange={() => handleRatingToggle(rating)}
                                    sx={{ '&.Mui-checked': { color: '#ff5252' }, '& .MuiSvgIcon-root': { fontSize: '2rem' } }}
                                />
                            }
                        />
                    ))}
                </div>
            </div>
            <div className="priceFilter">
                <h3 className='text-[1.8rem] font-[600] capitalize'>Filter By Price</h3>
                <Slider getAriaLabel={() => 'Price Range'} value={value} onChange={handleChange} getAriaValueText={valuetext} min={0} max={5000} />
                <div className="range text-[1.5rem] font-medium flex justify-between">
                    <span>From: <strong>{value[0]}$</strong></span>
                    <span>To: <strong>{value[1]}$</strong></span>
                </div>
            </div>
        </div>
    )
}

export default FilterBar
