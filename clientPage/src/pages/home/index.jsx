import { useState, useContext, useEffect } from 'react'
import Hero from '../../components/hero'
import AdsBanner from '../../components/ads/adsBanner'
import AdSlider from '../../components/ads/adSlider'
import ProductSlider from '../../components/productSlider'
import { LiaShippingFastSolid } from "react-icons/lia"
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import AdsBannerV2 from '../../components/ads/adsBannerV2'
import 'swiper/css'
import 'swiper/css/navigation'
import { context } from '../../App'
import BlogSlider from '../../components/blogSlider'

const Home = () => {

  const { categories, isCatLoading } = useContext(context)

  const [value, setValue] = useState(null)
  
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  
  useEffect(() => {
    if (!isCatLoading && categories.length > 0 && value === null) {
      setValue(categories[0]._id)
    }
  }, [categories, isCatLoading, value])


  return (
    <>
      <Hero />

      <main className="main py-10">
        <div className="wrapper">
          <div className="productTabs flex flex-col gap-10 pb-10">
            <div className="flex justify-between">
              <div className='text-[#3e3e3e]'>
                <h3 className='text-[2rem] font-[600]'>Popular Products</h3>
                <p className='text-[1.4rem]'>Do not miss the current offers until the end of March.</p>
              </div>
              <div className='w-[70%]'>
                {!isCatLoading && value && (
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                  >
                    {categories.map((cat) => (
                      <Tab label={`${cat.category}`} sx={{ fontSize: '1.3rem', fontWeight: '600' }} key={cat._id} value={cat._id} />
                    ))}
                  </Tabs>
                )}
              </div>
            </div>
            <ProductSlider item={6} value={value}/>
          </div>
          <div className="adsBox flex flex-wrap justify-between pb-10">
            <div className="w-[74%]">
              <AdSlider />
            </div>
            <div className="flex flex-col justify-between gap-8 w-[25%]">
              <AdsBannerV2 src={'img/adBannerV2_1.jpg'} adPrName={`buy laptop bags for low prices`} price={`16.49`} />
              <AdsBannerV2 src={'img/adBannerV2_2.jpg'} adPrName={`buy apple iphone for low prices`} price={`69.99`} />
            </div>
          </div>
          <div className="freeShpping flex items-center justify-between bg-[rgba(255,82,82,0.2)] w-[80%] mx-auto p-10 my-4 rounded-2xl primary-color">
            <div className="flex gap-3">
              < LiaShippingFastSolid className='text-[5rem]' />
              <h3 className='text-[2rem] font-[600] py-5'>Free Shipping</h3>
            </div>
            <p className='text-[1.4rem] font-medium'>Free Delivery Now On Your First Order & Over $200</p>
            <h2 className='text-[2rem] font-bold'>- Only $200*</h2>
          </div>
          <AdsBanner item={3} />
          <div className="latestProduct flex flex-col gap-10 pt-10">
            <h3 className='text-[2rem] font-[600] text-[#3e3e3e]'>Latest Products</h3>
            <ProductSlider item={6} />
          </div>
          <div className="featuredProduct flex flex-col gap-10 pt-10">
            <h3 className='text-[2rem] font-[600] text-[#3e3e3e]'>Featured Products</h3>
            <ProductSlider item={6} />
          </div>
          <AdsBanner item={3} />
        </div>
      </main>

      <BlogSlider />
    </>
  )
}

export default Home
