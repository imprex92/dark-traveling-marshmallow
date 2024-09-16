import React, { useState, useRef } from 'react'
import withPrivateRoute from 'components/HOC/withPrivateRoute'
import { projectFirebase } from 'firebase/config'
import styles from 'styles/settingsPage.module.css'
import Googleicon from 'public/assets/icons8-google.svg'
import {
  accountRemoval,
  updateEmail,
  updatePassword,
  verifyUserEmail,
  updateAccountData,
  reAuthenticate,
} from 'components/utility/authOperations'
import AddressForm from 'components/AddressForm'
import CircularLoader from 'components/loaders/preloaders/CircularLoader'
import { useRouter } from 'next/router'
import { verifyEmail } from 'components/utility/verifyEmail'
import { getFirestore } from 'firebase-admin/firestore'
import nookies from 'nookies'
import { firebaseAdminVerifyToken } from 'firebase/firebaseAdmin'
import {
  FILE_TYPE_IMAGES,
  PROFILE_IMG_MAX_SIZE,
} from 'components/utility/constants'
import SidebarNavigation from 'components/nav/SidebarNavigation'

const settings = ({ userAuth, token, userAddress }) => {
  const {
    uid,
    name,
    picture,
    email,
    email_verified,
    phoneNumber = null,
    firebase,
  } = token
  const router = useRouter()

  const [currentMenuItem, setCurrentMenuItem] = useState('about_me')
  const [open, setOpen] = useState(false)
  const [showReAuthDialog, setShowReAuthDialog] = useState(false)
  const [loaders, setLoaders] = useState({
    verificationEmail: false,
    profileStatus: false,
    emailStatus: false,
    passwordStatus: false,
  })

  const phoneInput = useRef(phoneNumber)
  const nameInput = useRef(name)
  const fileInput = useRef()
  const profileStatusMsg = useRef(null)
  const emailStatusMsg = useRef(null)
  const passwordStatusMsg = useRef(null)
  const removeAccMsg = useRef(null)
  const verificationEmailMsg = useRef(null)

  const handleReauthCallback = () => {
    setShowReAuthDialog(true)
    M.toast({ text: 'Re-authentication needed!' })
  }
  const handleAccountRemoval = async () => {
    removeAccMsg.current = false
    const deletion = await accountRemoval(handleReauthCallback)
    if (deletion.code === 200) {
      M.toast({ text: `${deletion.message}! Redirecting...` })
      router.replace('/login')
    }
  }
  const handleVerifyEmail = async () => {
    setLoaders((prevLoaders) => ({ ...prevLoaders, verificationEmail: true }))

    try {
      const verification = await verifyUserEmail()
      if (verification.code === 200) {
        setLoaders((prevLoaders) => ({ ...prevLoaders, profileStatus: false }))
        verificationEmailMsg.current.style.color = 'lightgreen'
        verificationEmailMsg.current.textContent = verification.message
        verificationEmailMsg.current.style.display = 'inline'
        setTimeout(() => {
          verificationEmailMsg.current.style.display = 'none'
        }, 2000)
      }
      M.toast({ text: verification.message })
    } catch (error) {
      console.error('Error verifying email:', error)
      M.toast({ text: 'Error verifying email' })
    } finally {
      setLoaders((prevLoaders) => ({
        ...prevLoaders,
        verificationEmail: false,
      }))
    }
  }
  const handlePassEmailUpdate = async (type, data) => {
    if (type === 'email') {
      if (verifyEmail(data)) {
        setLoaders((prevLoaders) => ({ ...prevLoaders, emailStatus: true }))
        document.getElementById('email').classList.add('valid')
        document.getElementById('email').classList.remove('invalid')

        try {
          const emailUpdate = await updateEmail(data)
          if (emailUpdate.status === 200) {
            emailStatusMsg.current.style.color = 'lightgreen'
            emailStatusMsg.current.textContent = 'Update success!'
            emailStatusMsg.current.style.display = 'inline'
            setTimeout(() => {
              emailStatusMsg.current.style.display = 'none'
            }, 2000)
          } else {
            emailStatusMsg.current.style.color = 'red'
            emailStatusMsg.current.textContent = 'Update failed!'
            emailStatusMsg.current.style.display = 'inline'
            setTimeout(() => {
              emailStatusMsg.current.style.display = 'none'
            }, 2000)
          }
        } catch (error) {
          console.error('Error updating email:', error)
          emailStatusMsg.current.style.color = 'red'
          emailStatusMsg.current.textContent = 'Update failed!'
          emailStatusMsg.current.style.display = 'inline'
          setTimeout(() => {
            emailStatusMsg.current.style.display = 'none'
          }, 2000)
        } finally {
          setLoaders((prevLoaders) => ({ ...prevLoaders, emailStatus: false }))
        }
      } else {
        setLoaders((prevLoaders) => ({ ...prevLoaders, emailStatus: false }))
        document.getElementById('email').classList.add('invalid')
        document.getElementById('email').classList.remove('valid')
        M.toast({
          text: 'Password requirements: \n Between 6 - 20 characters. \n Contain at least: \n 1 number \n 1 uppercase and 1 lowercase.',
        })
      }
    } else if (type === 'password') {
      setLoaders((prevLoaders) => ({ ...prevLoaders, passwordStatus: true }))

      try {
        const passwordUpdate = await updatePassword(data)
        if (passwordUpdate.status === 200) {
          passwordStatusMsg.current.style.color = 'lightgreen'
          passwordStatusMsg.current.textContent = 'Update success!'
          passwordStatusMsg.current.style.display = 'inline'
          setTimeout(() => {
            passwordStatusMsg.current.style.display = 'none'
          }, 2000)
        } else {
          passwordStatusMsg.current.style.color = 'red'
          passwordStatusMsg.current.textContent = 'Update failed!'
          passwordStatusMsg.current.style.display = 'inline'
          setTimeout(() => {
            passwordStatusMsg.current.style.display = 'none'
          }, 2000)
        }
      } catch (error) {
        console.error('Error updating password:', error)
        passwordStatusMsg.current.style.color = 'red'
        passwordStatusMsg.current.textContent = 'Update failed!'
        passwordStatusMsg.current.style.display = 'inline'
        setTimeout(() => {
          passwordStatusMsg.current.style.display = 'none'
        }, 2000)
      } finally {
        setLoaders((prevLoaders) => ({ ...prevLoaders, passwordStatus: false }))
      }
    } else {
      setLoaders((prevLoaders) => ({ ...prevLoaders, passwordStatus: false }))
      M.toast({ text: 'Something went wrong processing your request!' })
    }
  }
  const handlePictureUpload = (file) => {
    const inputEl = document.getElementById('change-profilePic')
    const imgToUpload = file.target.files[0]
    if (
      imgToUpload &&
      FILE_TYPE_IMAGES.includes(imgToUpload.type) &&
      imgToUpload.size <= PROFILE_IMG_MAX_SIZE
    ) {
      inputEl.classList.remove('invalid')
      inputEl.classList.add('valid')
      fileInput.current = imgToUpload
      document.querySelector('.file-path').value = imgToUpload.name
    } else {
      inputEl.classList.remove('valid')
      inputEl.classList.add('invalid')
      fileInput.current = null
      document.querySelector('.file-path').value = ''
      M.toast({ text: 'Please select a valid image with size less than 2mb' })
    }
  }
  const handleUpdateAccountInfo = async (e) => {
    e.preventDefault()
    setLoaders((prevLoaders) => ({ ...prevLoaders, profileStatus: true }))

    try {
      let update = await updateAccountData({
        name: nameInput.current,
        number: phoneInput.current,
        ...(fileInput.current &&
          fileInput.current.lastModified && { file: fileInput.current }),
        uid: uid,
      })

      if (update.status === 200) {
        M.toast({ text: `${update.message}` })
        profileStatusMsg.current.style.color = 'lightgreen'
        profileStatusMsg.current.textContent = 'Update success!'
        profileStatusMsg.current.style.display = 'inline'
        setTimeout(() => {
          profileStatusMsg.current.style.display = 'none'
        }, 2000)
      } else {
        M.toast({ text: `Status: ${update.status}, ${update.message}` })
        profileStatusMsg.current.style.color = 'red'
        profileStatusMsg.current.textContent = 'Update failed!'
        profileStatusMsg.current.style.display = 'inline'
        setTimeout(() => {
          profileStatusMsg.current.style.display = 'none'
        }, 2000)
      }
    } catch (error) {
      console.log('Error updating account info', error)
      M.toast({ text: `Error: ${error.message}` })
      profileStatusMsg.current.style.color = 'red'
      profileStatusMsg.current.textContent = 'Update failed!'
      profileStatusMsg.current.style.display = 'inline'
      setTimeout(() => {
        profileStatusMsg.current.style.display = 'none'
      }, 2000)
    } finally {
      setLoaders((prevLoaders) => ({ ...prevLoaders, profileStatus: false }))
    }
  }

  const changeVisibility = (e) => {
    e.preventDefault()

    const passwordEl = document.getElementById('password')
    const toggleBtn = document.getElementById('passwordToggleBtn')
    if (passwordEl !== undefined && passwordEl.type == 'password') {
      passwordEl.type = 'text'
      toggleBtn.innerText = 'visibility'
    } else if (passwordEl !== undefined && passwordEl.type == 'text') {
      passwordEl.type = 'password'
      toggleBtn.innerText = 'visibility_off'
    }
  }
  const ReAuthDialogComp = () => {
    const [reauthEmail, setReauthEmail] = useState(null)
    const [reauthPassword, setReauthPassword] = useState(null)

    const handleReauth = () => {
      const credentials = projectFirebase.auth.EmailAuthProvider.credential(
        reauthEmail,
        reauthPassword,
      )

      reAuthenticate(credentials)
        .then((user) => {
          const result = user.providerId && accountRemoval()
          console.log('deletion result', result)
        })
        .catch((err) => console.error('my error', err))
    }

    return (
      <div className={styles.reAuthOverlay}>
        <div className={styles.reAuthWrapper}>
          <span
            onClick={() => setShowReAuthDialog(false)}
            className={`material-icons ${styles.closeDialog}`}
          >
            close
          </span>
          <div className={styles.reAuthContainer}>
            <div className="text">
              <h5>Please re-authenticate</h5>
              <span>
                There has been some time since you logged in to your account.
              </span>
              <br />
              <span>
                In order to keep your account safe, we need to reauthenticate
                you.
              </span>
              <br />
            </div>
            {firebase.sign_in_provider === 'password' ? (
              <div className="row">
                <div className="col s12 m6">
                  <div
                    className="input-field outlined"
                    style={{ margin: '0 4px' }}
                  >
                    <input
                      placeholder=" "
                      onChange={(e) => setReauthEmail(e.target.value)}
                      autoComplete="email"
                      id="reauthEmail"
                      type="email"
                      className="validate"
                      required={true}
                      aria-required="true"
                    />
                    <label htmlFor="reauthEmail">Email</label>
                  </div>
                </div>
                <div className="col s12 m6">
                  <div
                    className="input-field outlined"
                    style={{ margin: '0 4px' }}
                  >
                    <input
                      placeholder=" "
                      onChange={(e) => setReauthPassword(e.target.value)}
                      autoComplete="current-password"
                      id="reauthPassword"
                      type="password"
                      className="validate"
                      required={true}
                      aria-required="true"
                    />
                    <label htmlFor="reauthPassword">Password</label>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="row">
              {firebase.sign_in_provider === 'password' ? (
                <a
                  aria-disabled={!verifyEmail(reauthEmail) || !reauthPassword}
                  onClick={() => handleReauth()}
                  className={`${styles.reAuthBtn} ${!verifyEmail(reauthEmail) || !reauthPassword ? 'disabled' : ''} waves-effect waves-light btn-small`}
                >
                  Authenticate
                </a>
              ) : (
                <button onClick={handleAccountRemoval} className="btn">
                  Authenticate with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
  const AboutMeComp = () => {
    return (
      <>
        <form className="col s12">
          <h6 style={{ marginBottom: '1rem' }}>About me</h6>
          <div style={{ gap: '1rem' }} className="row">
            <div className="input-field col s12 m6">
              <input
                placeholder=" "
                autoComplete="name"
                ref={nameInput}
                type="text"
                id="full_name"
                defaultValue={name}
                className="validate"
              />
              <label
                className={nameInput.current ? 'active' : ''}
                htmlFor="full_name"
              >
                Full name
              </label>
            </div>
            <div className="input-field col s12 m6">
              <input
                placeholder=" "
                autoComplete="tel"
                disabled
                ref={phoneInput}
                type="text"
                id="tel"
                defaultValue={phoneNumber}
                className="validate"
              />
              <label
                className={phoneInput.current ? 'active' : ''}
                htmlFor="tel"
              >
                Mobile number - Not yet Implemented
              </label>
            </div>
          </div>
          <h6>Profile picture</h6>
          <div className="row" style={{ marginBottom: '15px' }}>
            <div className={`s12 file-field input-field ${styles.fileField}`}>
              <div className={`btn-small ${styles.fileBtn}`}>
                <span>File</span>
                <input
                  autoComplete="off"
                  ref={fileInput}
                  className="validate"
                  type="file"
                  accept="image/*"
                  onChange={(file) => {
                    handlePictureUpload(file)
                  }}
                />
              </div>
              <div className="file-path-wrapper">
                <input
                  id="change-profilePic"
                  placeholder="Upload picture"
                  type="text"
                  className="file-path validate"
                />
              </div>
            </div>
          </div>
          <button
            disabled={loaders.profileStatus}
            onClick={(e) => handleUpdateAccountInfo(e)}
            className="btn-small waves-effect waves-light"
          >
            Save
            <i className="material-icons right">save</i>
          </button>
          <span
            ref={profileStatusMsg}
            className={styles.status_operation}
          ></span>
          {loaders.profileStatus ? (
            <CircularLoader loaderColor="default" loaderSize="small" />
          ) : null}
        </form>
        <AddressForm address={userAddress} M={M} />
      </>
    )
  }
  const AccountSettingsComp = () => {
    const [emailNewValue, setEmailNewValue] = useState(email)
    const emailPrevValue = email
    let isSame = emailPrevValue === emailNewValue

    return (
      <div className={styles.accountSettingsComp}>
        <h6>Account Settings</h6>
        <p>Change email or password</p>
        <form className="col s12">
          {firebase.sign_in_provider === 'password' ? (
            <>
              <div
                style={{ position: 'relative' }}
                className={`row ${styles.fieldRow}`}
              >
                <div className="input-field col s12 m10">
                  <input
                    autoComplete="email"
                    required=""
                    aria-required="true"
                    onChange={(x) => setEmailNewValue(x.target.value)}
                    type="email"
                    id="email"
                    className="validate"
                    defaultValue={email}
                  />
                  <label className="active" htmlFor="email">
                    Change email
                  </label>
                  <span
                    className="helper-text"
                    data-error="Doesn't look correct"
                    data-success="Looks good"
                  ></span>
                  {!isSame ? (
                    <>
                      <i
                        className={`material-icons suffix red-text ${styles.inputCancel}`}
                        onClick={() => {
                          setEmailNewValue(emailPrevValue),
                            (document.getElementById('email').value =
                              emailPrevValue)
                        }}
                      >
                        cancel
                      </i>
                      <i
                        className={`material-icons suffix ${styles.inputUpdate}`}
                        onClick={() => {
                          handlePassEmailUpdate('email', emailNewValue)
                        }}
                      >
                        edit
                      </i>
                    </>
                  ) : null}
                </div>
                {loaders.emailStatus ? (
                  <CircularLoader
                    loaderColor="default"
                    loaderSize="small"
                    wrapperMargins="1.25rem 0 0 0.25rem"
                  />
                ) : null}
                <span
                  ref={emailStatusMsg}
                  style={{ position: 'absolute', left: '-5px', bottom: '-5px' }}
                  className={styles.status_operation}
                ></span>
              </div>
              <div
                style={{ position: 'relative' }}
                className={`row ${styles.fieldRow}`}
              >
                <div className="input-field col s12 m10">
                  <i
                    style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      float: 'right',
                      cursor: 'pointer',
                    }}
                    className="material-icons"
                    id="passwordToggleBtn"
                    onClick={(e) => {
                      changeVisibility(e)
                    }}
                  >
                    visibility_off
                  </i>
                  <input
                    placeholder=" "
                    autoComplete="new-password"
                    type={'password'}
                    name=""
                    id="password"
                    className="validate"
                  />
                  <label htmlFor="password">Change password</label>
                </div>
                <span
                  ref={passwordStatusMsg}
                  style={{
                    position: 'absolute',
                    left: '-5px',
                    bottom: '-10px',
                  }}
                  className={styles.status_operation}
                ></span>
              </div>
            </>
          ) : (
            <p>
              Email and password cannot be changed when logged in with Google.
            </p>
          )}
        </form>
        <h6>Verify account</h6>
        <button
          onClick={handleVerifyEmail}
          disabled={email_verified}
          className={`btn waves-effect waves-light btn-small ${email_verified && 'disabled'} ${styles.verifyEmailBtn}`}
          type="submit"
          name="action"
        >
          {email_verified ? 'Already verified' : 'Verify email'}
          <i className="material-icons right">
            {email_verified ? 'done' : 'warning_amber'}
          </i>
        </button>
        <span
          ref={passwordStatusMsg}
          className={styles.status_operation}
        ></span>
        <span
          ref={verificationEmailMsg}
          className={styles.status_operation}
        ></span>
        {loaders.passwordStatus || loaders.emailStatus ? (
          <CircularLoader
            loaderColor="default"
            loaderSize="small"
            wrapperMargins="0.25rem 0 0 1rem"
          />
        ) : null}
      </div>
    )
  }
  const RemoveAccountComp = () => {
    const AccountRemovalDialog = () => {
      const [isChecked, setIsChecked] = useState(false)
      const checkHandler = () => setIsChecked(!isChecked)

      return (
        <div className={styles.accountRemovalDialog}>
          <span
            onClick={() => setOpen(false)}
            className={`material-icons ${styles.closeDialog}`}
          >
            close
          </span>
          <h5 style={{ marginTop: '1rem' }}>Are you sure about this?</h5>
          <p>
            This will remove your account and all data associated with it from
            our servers. *
          </p>
          <label htmlFor="remove_acc">
            <input
              checked={isChecked}
              onChange={checkHandler}
              id="remove_acc"
              type="checkbox"
            />
            <span>
              I am completely sure and I understand that this cannot be undone!
            </span>
          </label>
          <a
            style={{ marginTop: '1rem' }}
            className={`${styles.removeForeverBtn} waves-effect waves-light btn-small red darken-1 ${isChecked ? '' : 'disabled'}`}
            onClick={() => {
              handleAccountRemoval(), setOpen(false)
            }}
          >
            <i className="material-icons right">delete_forever</i>I am
            completely sure!
          </a>
          <p>
            <small>
              *Takes up to 3 days <br />
              *You will lose access directly
            </small>
          </p>
        </div>
      )
    }

    return (
      <>
        {open ? (
          <div onClick={() => setOpen(false)} className={styles.overlay}></div>
        ) : null}
        <h6>Remove Account</h6>
        <a
          className={`${styles.removeForeverBtn} waves-effect waves-light btn-small red darken-1`}
          onClick={() => setOpen(true)}
        >
          <i className="material-icons right">delete_forever</i>I want to remove
          my account!
        </a>
        {removeAccMsg.current ? (
          <p className={styles.removeAccMsg} ref={removeAccMsg}>
            Something went wrong
          </p>
        ) : null}
        {open ? <AccountRemovalDialog /> : null}
      </>
    )
  }
  if (!userAuth) {
    return <span>You need to be logged in to view this page</span>
  }
  return (
    <div id="mainContainer" className={styles.main}>
      <SidebarNavigation />
      {showReAuthDialog ? <ReAuthDialogComp /> : null}
      <div id="mainContent" className={styles.settingsWrapper}>
        <aside className={styles.sidePanel}>
          <img
            loading="eager"
            style={{ objectFit: 'cover' }}
            className="circle"
            src={picture || '/assets/icons8-test-account.png'}
            width={120}
            height={120}
          />
          <div className={styles.sidePanelItems}>
            <div className={styles.userInfo}>
              <h4>{name ? name : 'No name yet.'}</h4>
              <span
                className={`${styles.tooltip} ${email_verified ? 'green-text' : 'red-text'}`}
              >
                {email}
                <span className={styles.tooltipText}>
                  {email_verified ? 'Email verified.' : 'Not verified.'}
                </span>
              </span>
              <br />
              {firebase.sign_in_provider === 'google.com' ? (
                <span className={`${styles.tooltip} ${styles.googleIconWrap}`}>
                  <Googleicon />
                  <span className={styles.tooltipText}>
                    Logged in with google.
                  </span>
                </span>
              ) : (
                <span className={styles.tooltip}>
                  <span className={`material-icons`}>vpn_key</span>
                  <span className={styles.tooltipText}>
                    Logged in with password.
                  </span>
                </span>
              )}
              <br />
              {phoneNumber && <span>{phoneNumber}</span>}
            </div>
            <hr />
            <div className={styles.menuItems}>
              <p
                className={`${styles.item} ${currentMenuItem === 'about_me' && styles.item_active}`}
                onClick={() => setCurrentMenuItem('about_me')}
              >
                About me
              </p>
              <p
                className={`${styles.item} ${currentMenuItem === 'account_settings' && styles.item_active}`}
                onClick={() => setCurrentMenuItem('account_settings')}
              >
                Account settings
              </p>
              <p
                className={`${styles.item} ${currentMenuItem === 'remove_account' && styles.item_active}`}
                onClick={() => setCurrentMenuItem('remove_account')}
              >
                Remove account
              </p>
            </div>
          </div>
        </aside>
        <section className={styles.mainPanel}>
          {currentMenuItem === 'about_me' ? <AboutMeComp /> : null}
          {currentMenuItem === 'account_settings' ? (
            <AccountSettingsComp />
          ) : null}
          {currentMenuItem === 'remove_account' ? <RemoveAccountComp /> : null}
        </section>
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx)
    const token = await firebaseAdminVerifyToken(cookies.token)
    const adminFirestore = getFirestore()
    const { uid, email, email_verified, firebase, name, picture } = token
    const userDbRef = adminFirestore.collection('testUserCollection').doc(uid)
    const userData = await userDbRef.get()

    await userDbRef.set(
      {
        displayName: name,
        pictureURL: picture,
        email: email,
        emailVerified: email_verified,
        uid: uid,
        providerId: firebase.sign_in_provider,
      },
      { merge: true },
    )

    const userAddress = {
      ...userData.data()?.userAddress,
      uid: uid,
    }

    return {
      props: {
        token,
        userAddress,
      },
    }
  } catch (err) {
    console.error(err)
    ctx.res.writeHead(302, {
      Location:
        err.code === 'auth/id-token-expired' ? '/login#tokenExpired' : '/login',
    })
    ctx.res.end()

    return { props: {} }
  }
}

export default withPrivateRoute(settings)
