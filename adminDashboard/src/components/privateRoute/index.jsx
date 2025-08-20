import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { context } from "../../App"

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(context)

  if (isAuthenticated === undefined) return null
  if (isAuthenticated === false) return <Navigate to="/login" replace />

  return children
}

export default PrivateRoute