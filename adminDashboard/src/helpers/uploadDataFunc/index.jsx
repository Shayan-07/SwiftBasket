const UploadData = async (
  setData,
  setIsSubmitting,
  setIsError,
  setIsSuccess,
  appURI,
  uploadUri,
  payload,
  reset
) => {
  setIsSubmitting(true)

  try {
    const res = await fetch(`${appURI}/${uploadUri}/add`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const resData = await res.json()

    if (resData.success) {
      setIsSuccess(resData.message)
      setData(resData.data)
      reset()
      return true
    } else {
      setIsError(resData.message)
      return false
    }
  } catch (err) {
    setIsError('Something Went Wrong!')
    return false
  } finally {
    setIsSubmitting(false)
  }
}

export default UploadData
