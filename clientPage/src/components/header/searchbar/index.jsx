import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoSearch } from "react-icons/io5"
import { Button, Tooltip } from "@mui/material"

const SearchBar = () => {
    const [searchValue, setSearchValue] = useState("")
    const navigate = useNavigate()

    const handleFocus = () =>
        document.querySelector(".searchBar")?.classList.add("border", "border-gray-400")
    const handleBlur = () =>
        document.querySelector(".searchBar")?.classList.remove("border", "border-gray-400")

    const handleSearch = () => {
        if (searchValue.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <div className="searchBar bg-gray-200 rounded-lg px-6 flex items-center gap-3">
            <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Search Your Needs..."
                className="w-full text-[1.5rem] placeholder:text-gray-600 h-full py-4"
            />
            <Tooltip title={"Search"}>
                <Button className="!rounded-full p-2 !min-w-auto" onClick={handleSearch}>
                    <IoSearch className="text-gray-600 text-[1.9rem]" />
                </Button>
            </Tooltip>
        </div>
    )
}

export default SearchBar
