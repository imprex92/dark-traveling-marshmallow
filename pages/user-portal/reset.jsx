import { confirmResetPassword, handleResetPassword } from 'components/utility/authOperations'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useRef } from 'react'
import styles from 'styles/useGateway.module.css'

const ResetPortal = () => {
  const router = useRouter()
  const { oobCode, mode, continueUrl } = router.query
  const [isVisible, setIsVisible] = useState(false)
  const [resultOfReset, setResultOfReset] = useState(null)
  const input = useRef(null)
  let header, text, placeholder, icon, button
  const lastPartOfUrl = continueUrl.slice(continueUrl.lastIndexOf("/") + 1)

  switch (mode) {
    case 'resetPassword':
      header = 'Reset your password';
      text = `Please enter a new password for your account`;
      placeholder = 'Enter password';
      button = 'Reset'
      break;
    case 'recoverEmail':
      header = 'Recover your email';
      text = `Some text`;
      placeholder = 'Enter Some text';
      icon = 'alternate_email'
      button = 'Recover'
      break;
    case 'verifyEmail':
      header = 'Verify your email';
      text = `Some text`;
      placeholder = 'Enter Some text';
      icon = 'alternate_email'
      button = 'Verify'
      break;
    default:
      break;
  }

  const handleReset = async () => {
    setResultOfReset(null)
    if(input.current.value.trim()){
      input.current.classList.remove('input-error')
      try {
        const codeVerification = await handleResetPassword(oobCode)

        if (codeVerification.code === 202) {
          const resetResult = await confirmResetPassword(oobCode, input.current.value)
          setResultOfReset(resetResult.message)
          setTimeout(() => {
            router.replace(`/${lastPartOfUrl}?email=${codeVerification?.email}`)
          }, 1000);
        } else {
          if (codeVerification.code === 'auth/expired-action-code') {
            setResultOfReset({success: false, code: codeVerification.code, message: 'Reset code invalid or expired. \nPlease try to reset the password again.'})
          } else {
            setResultOfReset(codeVerification)
          }
        }
      } catch (error) {
        setResultOfReset({success: false, message: error.message, code: error.code})
        console.error(error);
      }
    }
    else{
      input.current.classList.add('input-error')
      M.toast({ text: 'Field required!' })
    }
  }

  return (
	<div className={`${styles.container}`}>
    <div className={`${styles.myForm} z-depth-5`}>
      <section>
        <div className={styles.texts}>
          <h1 className={styles.header}>{header}</h1>
          <p>{text}</p>
        </div>
        <div className={`input-field ${styles.input}`}>
          {
            mode === 'resetPassword' ? 
            <i className="material-icons suffix" onClick={() => setIsVisible(!isVisible)}>{isVisible ? 'visibility' : 'visibility_off'}</i>
            : 
            <i className="material-icons suffix">{icon}</i>
          }
          <input required={true} ref={input} id="icon_suffix" type={isVisible ? 'text' : 'password'} placeholder=' ' className="validate" />
          <label htmlFor="icon_suffix">{placeholder}</label>
        </div>
        <div className={styles.button}>
          <a onClick={handleReset} className={`waves-effect waves-light btn-small`}>{button}</a>
        {resultOfReset ? <span className={styles.resetMessage}>{resultOfReset.message}</span> : null}
        </div>
      </section>
      <Link className={styles.goBack} href="/login" replace>
        <span className="material-icons">
          arrow_back
        </span>
        <span>Back to login</span>
      </Link>
    </div>
  </div>
  )
}

export default ResetPortal

