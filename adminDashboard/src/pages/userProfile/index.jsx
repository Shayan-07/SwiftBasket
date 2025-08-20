import { useState, useContext } from 'react'
import ProfileForm from '../../components/profileForm'
import ChangePasswordForm from '../../components/changePasswordForm'
import { context } from '../../App'

const UserProfile = () => {

  const { userData } = useContext(context)
  const [showPasswordBox, setShowPasswordBox] = useState(true)

  const handleShowPasswordBox = () => {
    setShowPasswordBox(false)
  }

  return (
    <div className='userProfile py-16'>
      <div className="wrapper">
        <div className="profileContainer text-[#3e3e3e]">
          <div className="updateOpt flex flex-col gap-10">
            <div className="profileForm">
              <ProfileForm handleShowPasswordBox={handleShowPasswordBox} />
            </div>
            {!userData?.isGoogleAuth &&
              <div className="changePasswordForm">
                <ChangePasswordForm showPasswordBox={showPasswordBox} setShowPasswordBox={setShowPasswordBox} />
              </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
