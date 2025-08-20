import { useState, useContext } from 'react'
import UserAccoutBoxModel from '../../components/userAccoutBoxModel'
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
    <>
      <div className='userProfile py-16 bg-[rgba(0,0,0,0.05)]'>
        <div className="wrapper">
          <div className="profileContainer grid grid-cols-[25%_73%] justify-between text-[#3e3e3e]">
            <div className="boxModel">
              <UserAccoutBoxModel />
            </div>
            <div className="updateOpt flex flex-col gap-10 w-[70%]">
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
    </>
  )
}

export default UserProfile
