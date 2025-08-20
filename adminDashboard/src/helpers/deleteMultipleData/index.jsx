const DeleteMultipleData = async (setData, setIsDeleting, setIsError, setIsSuccess, appURI, reqURI, body, setSelectedItems, setIsItemSelected) => {
    setIsDeleting(true)
    try {
        const res = await fetch(`${appURI}/${reqURI}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        })
        
        const resData = await res.json()

        if (resData.success) {
            setIsSuccess(resData.message)
            setData(resData.data)
        } else {
            setIsError(resData.message)
        }
    } catch (err) {
        setIsError('Something Went Wrong!')
    } finally {
        setIsDeleting(false)
        setSelectedItems([])
        setIsItemSelected(false)
    }
}

export default DeleteMultipleData
