import { useContext } from 'react'
import { Button } from '@mui/material'
import ProductsTable from '../../components/productsTable'
import OrdersTable from '../../components/ordersTable'
import PieChart from '../../components/apexCharts/pieChart'
import UserRangeChart from '../../components/apexCharts/userRangeChart'
import LineColumnChart from '../../components/apexCharts/lineColumnChart'
import { context } from '../../App'

import { LuShoppingBag } from "react-icons/lu"
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { userData } = useContext(context)
  const navigate = useNavigate()
  return (
    <div className="dashboard">
      <div className="wrapper">
        <div className="welcomeBanner dark-color grid grid-cols-[max-content_300px] justify-between items-center bg-[#f1faff] rounded-xl px-10 shadow-lg">
          <div className="bannerText">
            <h2 className='text-[3.5rem] font-bold leading-none'>Welcome <span className='primary-color capitalize'>{userData.name}</span></h2>
            <p className='text-[1.6rem] font-medium my-5'>Check here what's happening on your store today. See the statistics at once.</p>
            <Button
            onClick={() => navigate('/orders')}
            className='!min-w-auto !py-4 !px-7 !text-white !text-[1.5rem] !font-medium !leading-none primary-bg !w-max !justify-center !items-center !gap-2 !capitalize'
            >
              <LuShoppingBag className='text-[2rem]' />
              <p>Check Orders</p>
            </Button>
          </div>
          <div className="bannerImg">
            <img src="/img/welcomeBanner.png" alt="" className='w-full' />
          </div>
        </div>

        <div className="apexCharts grid grid-cols-[55%_42%] justify-between items-center my-10">
          <div className="userRangeChart shadow-[0_0_10px_rgba(0,0,0,0.15)] sm:rounded-lg bg-white py-5 px-6 overflow-hidden">
            <h2 className='text-[1.8rem] font-[600] dark-color mb-3'>Total Users & Subscriptions</h2>
            <UserRangeChart />
          </div>

          <div className="pieChart shadow-[0_0_10px_rgba(0,0,0,0.15)] sm:rounded-lg bg-white py-5 px-6 overflow-hidden">
            <h2 className='text-[1.8rem] font-[600] dark-color mb-3'>Sales Distribution by Category</h2>
            <PieChart />
          </div>
        </div>

        <div className="productsTable pt-10">
          <ProductsTable />
        </div>

        <div className="oredrsTable pt-10">
          <OrdersTable />
        </div>

        <div className="lineColumnChart px-6 pt-5 mt-10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] sm:rounded-lg overflow-hidden">
          <h2 className='text-[1.8rem] font-[600] dark-color mb-3'>Sales, Expenses & Revenue</h2>
          <LineColumnChart />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
