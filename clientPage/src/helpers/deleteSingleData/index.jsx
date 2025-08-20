const DeleteSingleData = async (setData, setIsDeleting, setIsError, setIsSuccess, appURI, reqURI, param) => {
    setIsDeleting(true)

    try {
        const res = await fetch(`${appURI}/${reqURI}/delete/${param}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        const resData = await res.json()

        if (resData.success) {
            setIsSuccess(resData.message)
            setData(resData.data)
        } else {
            setIsError(resData.message)
        }
        return resData.success
    } catch (err) {
        setIsError('Something Went Wrong!')
    } finally {
        setIsDeleting(false)
    }
}

export default DeleteSingleData
