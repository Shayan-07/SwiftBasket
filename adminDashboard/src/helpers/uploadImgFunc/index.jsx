const UploadImagesFunc = async (e, reqURI, setImgArr, setIsLoading, setIsError, appURI, append) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setIsLoading(true)

    const formData = new FormData()
    files.forEach(img => {
        formData.append('img', img)
    })

    try {
        const res = await fetch(`${appURI}/${reqURI}/upload/img`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })

        const data = await res.json()

        if (data.success) {
            setImgArr(prev => append ? [...prev, ...data.imgArr] : data.imgArr)
        } else {
            setIsError(data.message)
        }
    } catch (err) {
        setIsError('Something Went Wrong!')
    } finally {
        setIsLoading(false)
    }
}

export default UploadImagesFunc
