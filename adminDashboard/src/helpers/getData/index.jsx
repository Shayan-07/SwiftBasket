const GetData = async (appURI, reqURI) => {
  try {
    const res = await fetch(`${appURI}/${reqURI}/`, {
      method: 'GET',
      credentials: 'include'
    })

    const resData = await res.json()

    if (resData.success) {
      return { data: resData.data, error: null }
    } else {
      return { data: null, error: resData.message }
    }
  } catch (err) {
    return { data: null, error: 'Something Went Wrong!' }
  }
}

export default GetData
