import { useContext, useEffect, useState } from "react"
import { context } from "../../App"
import { useLocation, useNavigate } from "react-router-dom"
import { Box, Skeleton } from "@mui/material"

const Blog = () => {
    const { blogs, isBlogLoading, setIsBlogLoading, appURI, setIsError } = useContext(context)

    const location = useLocation()
    const navigate = useNavigate()
    const blogParam = location.pathname.split('/').pop()

    const [readingBlog, setReadingBlog] = useState({})

    useEffect(() => {
        setIsBlogLoading(true)
        fetch(`${appURI}/blog/${blogParam}`, {
            method: 'GET',
            credentials: 'include'
        }).then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setReadingBlog(resData.data)
                } else {
                    setIsError(resData.message)
                }
            }).catch(() => setIsError('Something went wrong!'))
            .finally(() => setIsBlogLoading(false))
    }, [blogParam])

    const handleReadingBlog = (id) => {
        navigate(`/blog/${id}`)
    }

    return (
        <div className="blog my-10">
            <div className="wrapper">
                <div className="blogsContainer grid grid-cols-[60%_37%] justify-between">
                    {isBlogLoading ?
                        <div className="flex flex-col">
                            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3, marginBottom: '0.5rem' }} />
                            <Skeleton variant="text" height={70} width="80%" />
                            <Skeleton variant="text" height={30} width="90%" />
                            <Skeleton variant="text" height={30} width="95%" />
                            <Skeleton variant="text" height={30} width="85%" />
                        </div>
                        :
                        <div className="readingBlog">
                            <img src={readingBlog.imgUrl} alt="" width={'100%'} className="max-h-[50rem] rounded-t-3xl" />
                            <h2 className="text-[2.5rem] capitalize font-bold text-[#333] my-2">{readingBlog.title}</h2>
                            <p dangerouslySetInnerHTML={{ __html: readingBlog.description }} style={{ fontSize: '1.4rem' }}></p>
                        </div>
                    }
                    <div className="otherBlogs flex flex-col gap-5">
                        {isBlogLoading
                            ? Array(3).fill(0).map((_, idx) => (
                                <Box key={idx} display="grid" gridTemplateColumns="1fr 1fr" gap={2} alignItems={'center'}>
                                    <Skeleton variant="rectangular" width="100%" height={150} />
                                    <Box>
                                        <Skeleton variant="text" width="90%" height={50} />
                                        <Skeleton variant="text" width="100%" height={25} />
                                        <Skeleton variant="text" width="95%" height={25} />
                                        <Skeleton variant="text" width="95%" height={25} />
                                    </Box>
                                </Box>
                            ))
                            :
                            blogs.map(blog => {
                                return (
                                    blog._id !== readingBlog._id &&
                                    <article
                                        className="blog grid grid-cols-2 items-center gap-3 rounded-2xl overflow-hidden cursor-pointer"
                                        key={blog._id}
                                        onClick={() => handleReadingBlog(blog._id)}>
                                        <img src={blog.imgUrl} alt="" className="w-full h-full" />
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-[1.7rem] font-[600] text-[#333] capitalize line-clamp-1">{blog.title}</h3>
                                            <p className="line-clamp-6 text-[1.2rem]">
                                                {blog.description.replace(/<[^>]+>/g, '')}
                                            </p>
                                        </div>
                                    </article>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Blog
