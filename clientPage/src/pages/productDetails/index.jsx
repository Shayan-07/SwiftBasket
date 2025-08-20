import { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ImgZoom from '../../components/imgZoom'
import { useForm, Controller } from 'react-hook-form'
import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { AiOutlineAudit } from "react-icons/ai"
import ProductSlider from '../../components/productSlider'
import ProductDetailsContent from '../../components/productDetailsContent'
import { context } from '../../App'
import GetData from '../../helpers/getData'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const ProductDetails = () => {

  const { id } = useParams()
  const { appURI, setIsError, setIsSuccess } = useContext(context)
  const [product, setProduct] = useState({})
  const [productReviews, setProductReviews] = useState([])
  const [isProductLoading, setIsProductLoading] = useState(false)

  const fetchProduct = async () => {
    const productRes = await GetData(appURI, setIsProductLoading, `product/${id}`)

    if (productRes.data) {
      setProduct(productRes.data)
      setProductReviews(productRes.data.review)
    }
    if (productRes.error) setIsError(productRes.error)
  }

  useEffect(() => {
    fetchProduct()
  }, [id, appURI, setIsError, setIsSuccess])

  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const [focus, setFocus] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm();


  const onSubmit = (data) => {
    if (data) {
      setIsSubmitting(true)
      fetch(`${appURI}/product/review/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: data.comment,
          rating: data.rating
        })
      }).then(response => response.json())
        .then(resData => {
          if (resData.success) {
            setIsSuccess(resData.message)
            setProductReviews(resData.data)
            reset({
              comment: '',
              rating: 3
            })
            fetchProduct()
          } else {
            setIsError(resData.message)
          }
        }).catch(error => setIsError(error.message || 'Something Went Wrong!'))
        .finally(() => setIsSubmitting(false))
    }
  }

  const onError = (errors) => {
    const firstError = Object.values(errors)[0]
    if (firstError) {
      setIsError(firstError.message)
    }
  }

  const catType = product?.subCategory
    ? 'subCategory'
    : product?.category
      ? 'category'
      : null

  return (
    <section className="productDetails">
      <div className="wrapper">
        <div className="productDetailsBox grid grid-cols-[40%_60%] py-10">
          <ImgZoom mediaImgUrls={product.mediaImgUrls || []} isProductLoading={isProductLoading} />
          <ProductDetailsContent
            brandName={product.brandName}
            title={product.title}
            desc={product.description}
            rating={product.totalRating}
            price={product.price}
            discountedPrice={product.discountedPrice}
            totalReviews={product.totalReviews}
            stock={product.stock}
            isProductLoading={isProductLoading}
            id={product._id}
          />
        </div>
        <div className="productDeatailsTabs text-[#3e3e3e] pt-5">
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Description" {...a11yProps(0)} sx={{ fontSize: '1.5rem', fontWeight: '600', letterSpacing: '0.08rem' }} />
            <Tab label={`Reviews (${product.totalReviews})`} {...a11yProps(1)} sx={{ fontSize: '1.5rem', fontWeight: '600', letterSpacing: '0.08rem' }} />
          </Tabs>
          <CustomTabPanel value={value} index={0} className="p-8 shadow-[0px_3px_7px_rgba(0,0,0,0.2)] my-4 rounded-3xl">
            <div className="description">
              <h2 className="text-[2rem] font-[600] pb-8 flex items-center gap-3"><AiOutlineAudit className='text-[3.5rem]' /> Description</h2>
              <p className='productDesc text-[#777] text-[1.45rem] font-[500] leading-10' dangerouslySetInnerHTML={{ __html: product.description }}></p>
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1} className="p-8 shadow-[0px_3px_7px_rgba(0,0,0,0.4)] my-4 rounded-3xl">
            <div className="reviews">
              <div className="reviewsTop pb-8 flex justify-between items-center shadow-[0_6px_8px_-4px_rgba(0,0,0,0.1)] overflow-x-hidden">
                <h2 className="text-[2rem] font-[600]">Customer Reviews</h2>
                <div className="totalRatings flex gap-3 items-center">
                  <h2 className="text-[3.5rem] font-[600]">{product.totalRating}</h2>
                  <div className="rating flex flex-col gap-1">
                    <Rating name="read-only size-large half-rating" value={product.totalRating} precision={0.5} size='large' readOnly />
                    <p className='text-[#777] text-[1.2rem] font-medium'>{product.totalReviews} Reviews</p>
                  </div>
                </div>
              </div>
              <div className="productReviews scrollable max-h-[350px] pt-10 px-6 overflow-y-scroll overflow-x-hidden">
                {productReviews.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)).map(review => {
                  return (
                    <div className="userReview grid grid-cols-[1fr_max-content] gap-3 justify-between items-start py-10 px-6 border-b border-[rgba(0,0,0,0.1)]" key={review._id}>
                      <div className="review flex gap-3 items-start">
                        <img src={review.user.avatar} alt="" className='w-[6rem] h-[6rem] rounded-full border border-[rgba(0,0,0,0.3)] pt-1' />
                        <div className="flex flex-col gap-1">
                          <ul className='flex gap-6 items-center'>
                            <li>
                              <h3 className="userName text-[1.6rem] font-[600]">{review.user.name}</h3>
                            </li>
                            <li>
                              <Rating name="read-only size-large half-rating" value={review.rating} precision={0.5} size='large' readOnly />
                            </li>
                          </ul>
                          <p className="reviewDesc text-[1.3rem] font-[420]">{review.comment}</p>
                        </div>
                      </div>
                      <span className="reviewDate text-[1.4rem] font-medium text-[#777]">{new Date(review.reviewDate).toLocaleDateString()}</span>
                    </div>
                  )
                })}
              </div>
              <form className="addReview mt-12 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit, onError)}>
                <h2 className="text-[2rem] font-[600]">Add Your Reviews</h2>
                <div className={`reviewInput border-1 ${focus ? 'border-[rgba(0,0,0,0.5)]' : 'border-[rgba(0,0,0,0.2)]'} py-4 px-6 rounded-xl`}>
                  <textarea placeholder="Write Your Review..." rows={5}
                    className={`resize-none w-full text-[#3e3e3e] text-[1.5rem] font-[420] ${focus ? 'placeholder:text-gray-600' : 'placeholder:text-gray-400'} scrollable`}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    {...register("comment", { required: 'Kindly write a review before submitting' })}>
                  </textarea>
                </div>
                <Controller
                  name="rating"
                  control={control}
                  defaultValue={3}
                  render={({ field }) => (
                    <Rating
                      {...field}
                      precision={0.5}
                      value={field.value}
                      onChange={(_, value) => field.onChange(value)}
                    />
                  )}
                />
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className={`
                    !bg-[#FF5252] !text-white !py-5 !px-8 !leading-none !rounded-md !font-medium !text-[1.5rem] !min-w-auto !capitalize !w-max 
                    ${isSubmitting ? 'opacity-60 select-auto' : 'opacity-100 select-auto'}
                    `}
                >Submit Review
                </Button>
              </form>
            </div>
          </CustomTabPanel>
        </div>
        <div className="relatedProducts flex flex-col gap-10 py-10">
          <h3 className='text-[2rem] font-[600] text-[#3e3e3e]'>Related Products</h3>
          <ProductSlider
            item={6}
            isRelated={true}
            catType={catType}
            value={product?.subCategory?._id || product?.category?._id} />
        </div>
      </div >
    </section >
  )
}

export default ProductDetails