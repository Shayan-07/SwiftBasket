const DestroyImagesFunc = async (publicIdArr, reqURI, setImgArr, setIsSubmitting, setIsError, appURI) => {
    try {
        setIsSubmitting(true)

        const response = await fetch(`${appURI}/${reqURI}/destroy/img`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ publicIds: publicIdArr})
        })

        const resData = await response.json()

        if (resData.success) {
            setImgArr(prev => prev.filter(img => !publicIdArr.includes(img.publicId)))
            return true
        } else {
            setIsError(resData.message)
        }
    } catch (err) {
        setIsError('Something Went Wrong!')
    } finally {
        setIsSubmitting(false)
    }
}

export default DestroyImagesFunc