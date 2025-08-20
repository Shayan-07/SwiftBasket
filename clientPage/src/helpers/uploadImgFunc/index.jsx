const UploadImagesFunc = async (e, setData, setIsLoading, setIsError, setIsSuccess, appURI) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setIsLoading(true)

    const formData = new FormData()
    files.forEach(img => {
        formData.append('img', img)
    })

    try {
        const res = await fetch(`${appURI}/user/avatar`, {
            method: 'PUT',
            credentials: 'include',
            body: formData
        })

        const data = await res.json()

        if (data.success) {
            setData(data.data)
            setIsSuccess(data.message)
        } else {
            setIsError(data.message)
        }
    } catch (err) {
        setIsError(err.message || 'Something Went Wrong!')
    } finally {
        setIsLoading(false)
    }
}

export default UploadImagesFunc
