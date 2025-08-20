const FilterData = async (appURI, payload, setIsFiltering, setData, setIsError) => {
    try {
        setIsFiltering(true)

        const res = await fetch(`${appURI}/product/filter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        })
        
        const resData = await res.json()

        if (resData.success) {
            setData(resData.data)
        } else {
            setIsError(resData.message)
        }
    } catch (err) {
        setIsError(err.message || 'Something Went Wrong!')
    } finally {
        setIsFiltering(false)
    }
}

export default FilterData
