import React, { useContext, useState } from 'react'
import ItemsTable from '../../components/itemsTable'
import UsersTableRow from '../../components/usersTableRow'
import { Button } from '@mui/material'
import { BiSearch } from 'react-icons/bi'
import { context } from '../../App'
import { MutatingDots } from 'react-loader-spinner'

const Users = () => {

    const { user, setUser, isLoading, setIsError, setIsSuccess, appURI } = useContext(context)
    const [isSearching, setIsSearching] = useState(false)
    const [searchedKeyword, setSearchedKeyword] = useState('')

    const searchUser = (searchedKeyword) => {
        setIsSearching(true)
        fetch(`${appURI}/user/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchedKeyword }),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setUser(resData.data)
                } else {
                    setIsError(resData.message)
                }
            })
            .catch(error => setIsError(error.message || 'Something went wrong!'))
            .finally(() => setIsSearching(false))
    }

    return (
        <section>
            <div className="wrapper">
                <div className="relative shadow-[0_0_10px_rgba(0,0,0,0.15)] px-2 sm:rounded-lg grid grid-rows-[max-content_1fr] overflow-hidden bg-white">
                    <div className="searchUser grid grid-cols-[max-content_1fr] items-center px-6 py-7">
                        <h2 className='text-[1.8rem] font-[600]'>Users List</h2>
                        <div className="searchBar flex items-center gap-5 justify-end">
                            <div className="userSearch h-max self-end mb-[0.15rem] flex items-center px-4 py-2 w-[30%] border rounded-[4px] border-[rgba(0,0,0,0.3)] justify-between dark-color gap-1.5 focus-within:border-[#ff5252]">
                                <input
                                    type="text"
                                    className='text-[1.5rem] font-medium w-full'
                                    placeholder='Search User'
                                    value={searchedKeyword}
                                    onKeyDown={(e) => e.key === 'Enter' && searchedKeyword && searchUser(searchedKeyword)}
                                    onChange={(e) => setSearchedKeyword(e.target.value)} />
                                <Button className='!min-w-auto !p-2 !rounded-full dark-color' onClick={() => searchedKeyword ? searchUser(searchedKeyword) : null}>
                                    <BiSearch className='text-[1.8rem]' />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="tableContainer">
                        {isLoading || isSearching ?
                            <div className='flex w-full justify-center items-center py-10'>
                                <MutatingDots
                                    visible={true}
                                    height="100"
                                    width="100"
                                    color='#ff5252'
                                    secondaryColor="#ff5252"
                                    radius="12.5"
                                    ariaLabel="mutating-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            </div>
                            :
                            <ItemsTable
                                tableHeading={['User Avatar', 'UserName', 'Email', 'Joined At']}
                                ItemsTableRow={UsersTableRow}
                                ITEMS={user || []}
                                selectable={false}
                            />}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Users
