const LogoutFunc = async (appURI, setIsAuthenticated, setIsError, setIsSuccess, navigate) => {
    try {
        const res = await fetch(`${appURI}/logout`, {
            method: 'GET',
            credentials: 'include'
        })

        const resData = await res.json()

        if (resData.success) {
            setIsAuthenticated(false)
            setIsSuccess(resData.message)
            navigate('/login')
        } else {
            setIsError(res.message)
        }
    } catch (err) {
        setIsError(err.message || 'Something Went Wrong!')
    }
}

export default LogoutFunc
