import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { context } from "../../App"

const GuestRoute = ({ children }) => {
  const { resetFlow, isAuthenticated } = useContext(context)
  const location = useLocation()

  if (isAuthenticated === undefined) return null

  if (isAuthenticated === true) {
    const stateMail = location.state?.email
    if (stateMail !== '' && stateMail !== undefined && resetFlow === true) {
      return children
    }

    return <Navigate to="/" replace />
  }

  return children
}

export default GuestRoute
