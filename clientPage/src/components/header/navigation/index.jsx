import { useContext } from 'react'
import { Link } from 'react-router-dom'
import Divider from '@mui/material/Divider'
import { context } from '../../../App'

const Navigation = () => {

    const { categories, subCategories, nestedSubCategories } = useContext(context)

    return (
        <>
            <nav className="navbar shadow-[0_5px_7px_4px_rgba(0,0,0,0.1)] bg-white">
                <div className="wrapper">
                    <div className="flex justify-center items-center py-6">
                        <ul className="navigation flex gap-14">
                            {categories.map((cat) => (
                                <li key={cat._id} className='navMenu relative flex group'>
                                    <Link to={`/products?category=${cat._id}`} className='text-[#3e3e3e] text-[1.6rem] primary-hov font-[600] capitalize py-2 flex items-center gap-2'>
                                        <img src={cat.imgUrl} alt="" className='w-[4rem]' />
                                        <span>{cat.category}</span>
                                    </Link>

                                    <ul className='navSubMenu bg-white shadow-[0_5px_7px_5px_rgba(0,0,0,0.2)] rounded-lg py-4 flex flex-col absolute top-[200%] left-[30%] opacity-0 -z-7 transition-all duration-600 group-hover:opacity-100 group-hover:top-full group-hover:z-10'>
                                        {subCategories.filter(subCat => subCat.category._id === cat._id).map((subCat) => (
                                            <li key={subCat._id} className='subMenu min-w-max group/nested'>
                                                <Link to={`/products?subcategory=${subCat._id}`}
                                                    className='text-[#3e3e3e] text-[1.5rem] primary-hov font-[600] capitalize pl-4 pr-20 m-3 inline-block'>
                                                    {subCat.subCategory}
                                                </Link>
                                                <Divider />

                                                <ul className='nestedSubMenu absolute top-0 left-[125%] transition-all duration-300 min-w-max bg-white shadow ml-2 rounded-lg py-4 flex flex-col  opacity-0 -z-10 group-hover/nested:left-full group-hover/nested:opacity-100 group-hover/nested:z-10'>
                                                    {nestedSubCategories
                                                        .filter(nested => nested.subCategory._id === subCat._id)
                                                        .map(nested => (
                                                            <li key={nested._id} className='nestedSubMenuItem'>
                                                                <Link
                                                                    to={`/products?nestedsubcategory=${nested._id}`}
                                                                    className='text-[#3e3e3e] text-[1.4rem] primary-hov font-[600] capitalize pl-6 pr-10 m-3 block'
                                                                >
                                                                    {nested.nestedSubCategory}
                                                                </Link>
                                                                <Divider />
                                                            </li>
                                                        ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div >
            </nav >
        </>
    )
}

export default Navigation

