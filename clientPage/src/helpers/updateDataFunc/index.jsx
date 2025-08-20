const UpdateData = async (
  editUri,
  id,
  payload,
  setData,
  setIsEditing,
  setIsError,
  setIsSuccess,
  appURI,
  reset
) => {
  setIsEditing(true)

  try {
    const response = await fetch(`${appURI}/${editUri}/edit/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const resData = await response.json()

    if (resData.success) {
      setData(resData.data)
      setIsSuccess(resData.message)
      reset()
    } else {
      setIsError(resData.message)
    }
  } catch (error) {
    setIsError(error.message || 'Something Went Wrong!')
  } finally {
    setIsEditing(false)
  }
}

export default UpdateData
