import React, { useState, useRef } from 'react'
import withPrivateRoute from 'components/HOC/withPrivateRoute'
import { projectAuth, projectFirestore } from 'firebase/config'
import styles from 'styles/settingsPage.module.css'
import SideNav from 'components/nav/sidenav'
import Googleicon from 'public/assets/icons8-google.svg'
import { accountRemoval, updateEmail, updatePassword, verifyEmail, updateAccountData } from 'components/utility/authOperations'

if(typeof window !== 'undefined'){
	M = require( '@materializecss/materialize/dist/js/materialize.min.js')
}

const settings = ({userAuth, userData}) => {
	const { displayName, email, emailVerified, phoneNumber, photoURL = null, providerId} = userData
	const fileTypeImage = ['image/jpeg', 'image/gif', 'image/png', 'image/raw', 'image/heif', 'image/webp', 'image/heic']
	const maxSize = 2097152
	console.group('group1')
	console.log('setting userAuth', userAuth);
	console.log('setting userData', userData);
	console.log(photoURL);
	console.log('isEmail Verified?', emailVerified);
	console.groupEnd()

	const [currentMenuItem, setCurrentMenuItem] = useState('about_me')
	const [showPassword, setShowPassword] = useState(false)
	const [profilePicToUpload, setProfilePicToUpload] = useState(null)

	const phoneInput = useRef(phoneNumber)
	const nameInput = useRef(displayName)
	const fileInput = useRef()

	const handleAccountRemoval = () => {
		const deletion = accountRemoval(user)
	}
	const handleVerifyEmail = () => {
		const verification = verifyEmail()
	}
	const handlePassEmailUpdate = async(type, data) => {
		if(type === 'email'){
			if(verifyEmail(data)){
				document.getElementById('email').classList.add('valid')
				document.getElementById('email').classList.remove('invalid')
				const emailUpdate = await updateEmail(data)
				console.log(emailUpdate);
			}
			else{
				document.getElementById('email').classList.add('invalid')
				document.getElementById('email').classList.remove('valid')
				M.toast({html:'Password requirements: \n Between 6 - 20 characters. \n Contain at least: \n 1 number \n 1 uppercase and 1 lowercase.'})
			}
		}
		else if(type === 'password'){
			const passwordUpdate = updatePassword(data)
		}
		else{
			M.toast({text: 'Something went wrong processing your request!'})
		}
	}
	const handlePictureUpload = (file) => {

		const inputEl = document.getElementById('change-profilePic')
		const imgToUpload = file.target.files[0]
		if(imgToUpload && (fileTypeImage.includes(imgToUpload.type) && imgToUpload.size <= maxSize)){
			inputEl.classList.remove('invalid');
			inputEl.classList.add('valid')
			fileInput.current = imgToUpload
		}
		else{
			inputEl.classList.remove('valid');
			inputEl.classList.add('invalid');
			M.toast({html:'Please select a valid image with size less than 2mb'})
		}
	}
	const handleUpdateAccountInfo = async (e) => {
		e.preventDefault()
		let update = await updateAccountData({
			name: nameInput.current,
			number: phoneInput.current,
			file: fileInput.current
		})
	}

	const changeVisibility = (e) => {
		e.preventDefault()
		
		const passwordEl = document.getElementById('password')
		const toggleBtn = document.getElementById('passwordToggleBtn')
		if (passwordEl!== undefined && passwordEl.type == 'password'){
			passwordEl.type = 'text';
			toggleBtn.innerText = 'visibility'
		}
		else if(passwordEl !== undefined && passwordEl.type == 'text'){
			passwordEl.type = 'password';
			toggleBtn.innerText = 'visibility_off'
		}
	}
	const AboutMeComp = () => {

		return(
			<>
			<form  className='col s12'>
				<p>About me</p>
				<div className="row">
					<div className="input-field col s6">
						<input ref={nameInput} type="text" id="full_name" defaultValue={displayName} className="validate" />
						<label className='active' htmlFor="full_name">Full name</label>
					</div>
					<div className="input-field col s6">
						<input ref={phoneInput} type="tel" id="tel" defaultValue={phoneNumber} className="validate" />
						<label className='active' htmlFor="tel">Mobile number</label>
					</div>
				</div>
				<p>Profile picture</p>
				<div className="row">
					<div className="file-field input-field">
						<div className="btn-small">
							<span>File</span>
							<input ref={fileInput} className='validate' type="file" id="change-profilePic" accept='image/*' onChange={(file) => {handlePictureUpload(file)}} />
						</div>
						<div className="file-path-wrapper">
							<input placeholder='Upload picture' type="text" className="file-path validate" />
						</div>
					</div>
				</div>
				<button onClick={(e) => handleUpdateAccountInfo(e)} className="btn-small waves-effect waves-light" >Save
					<i className="material-icons right">save</i>
				</button>
			</form>
			</>
		)
	}
	const AccountSettingsComp = () => {
		const [emailNewValue, setEmailNewValue] = useState(email)
		const emailPrevValue = email;
		let isSame = emailPrevValue === emailNewValue
		return(
			<div className={styles.accountSettingsComp}>
				<p>Account Settings</p>
				<p>Change email or password</p>
				<form className="col s12">
					{providerId === 'password' 
					? (
					<>
						<div className="row">
							<div className="input-field col s10">
								<input required="" aria-required="true" onChange={x => setEmailNewValue(x.target.value)} type="email" id="email" className="validate" defaultValue={email} />
								<label className='active' htmlFor="email">Change email</label>
								<span className="helper-text" data-error="Doesn't look correct" data-success="Looks good"></span>
									{ !isSame ? (
										<>
											<i className={`material-icons suffix red-text ${styles.inputCancel}`} onClick={() => {setEmailNewValue(emailPrevValue)}}>
												cancel
											</i>
											<i className={`material-icons suffix ${styles.inputUpdate}`} onClick={() => {handlePassEmailUpdate('email', emailNewValue)}}>
												edit
											</i>
										</>
									) : null }
							</div>
						</div>
						<div className="row">
							<div className="input-field col s10">
								<i style={{position: 'absolute', top: '15px', right: '15px', float: 'right'}} className="material-icons" id='passwordToggleBtn' onClick={(e) => {changeVisibility(e)}}>visibility_off</i>
								<input type={'password'} name="" id="password" className="validate" />
								<label htmlFor="password">Change password</label>
							</div>
						</div>
					</>
					) 
					: 
					(
						<p>Email and password cannot be changed when logged in with Google.</p>
					)}
				</form>
				<p>Verify account</p>
				<button onClick={handleVerifyEmail} disabled={emailVerified} className={`btn waves-effect waves-light btn-small ${emailVerified && 'disabled'}`} type="submit" name="action">
					{emailVerified ? 'Already verified' : 'Verify email'}
					<i className="material-icons right">{emailVerified ? 'done' : 'warning_amber'}</i>
				</button>
			</div>
		)
	}
	const RemoveAccountComp = () => {
		const [open, setOpen] = useState(false);
		const AccountRemovalDialog = () => {
			const [isChecked, setIsChecked] = useState(false)
			const checkHandler = () => setIsChecked(!isChecked)

			return (
				<div className={styles.accountRemovalDialog}>
					<span onClick={ () => setOpen(false) } className={`material-icons ${styles.closeDialog}`}>
						close
					</span>
					<h5 style={{marginTop: "1rem"}} >Are you sure about this?</h5>
					<p>This will remove your account and all data associated with it from our servers. *</p>
					<label htmlFor='remove_acc'>
						<input checked={isChecked} onChange={checkHandler} id='remove_acc' type="checkbox" />
						<span>I am completely sure and I understand that this cannot be undone!</span>
					</label>
					<a style={{marginTop: "1rem"}} className={`waves-effect waves-light btn-small red darken-1 ${isChecked ? '' : 'disabled'}`} onClick={ handleAccountRemoval }>
					<i className="material-icons right">delete_forever</i>
					I am completely sure!
					</a>
					<p>
						<small>*Takes up to 3 days</small>
					</p>
				</div>
			)
		}

		return(
			<>
				{open ? <div onClick={ () => setOpen(false) } className={styles.overlay}></div> : null}
				<p>Remove Account</p>
				<a className="waves-effect waves-light btn-small red darken-1" onClick={ () => setOpen(true) }>
					<i className="material-icons right">delete_forever</i>
					I want to remove my account!
				</a>
				{open ? <AccountRemovalDialog /> : null}
			</>
		)
	}
	if(!userAuth){
		return(<span>You need to be logged in to view this page</span>)
	}
	return (
		<div className={styles.main}>
			<div className={styles.navigation}>
				<SideNav dbUserData={userData}/>
			</div>
			<div className={styles.settingsWrapper}>
				<aside className={styles.sidePanel}>
					<img loading='eager' className='circle' src={photoURL || "/assets/icons8-test-account.png"} width={120} height={120} />
					<div className={styles.sidePanelItems}>
						<div className={styles.userInfo}>
							<h4>{displayName ? displayName : 'No name yet.'}</h4>
							<span className={`${styles.tooltip} ${emailVerified ? 'green-text' : 'red-text'}`}>
								{email}
								<span className={styles.tooltipText}>{emailVerified ? 'Email verified.' : 'Not verified.'}</span>
							</span><br />
							{ providerId === 'google.com' ? <span className={`${styles.tooltip} ${styles.googleIconWrap}`}>
								<Googleicon />
								<span className={styles.tooltipText}>Logged in with google.</span>
							</span> : null }
							<br />
							{phoneNumber && <span>{phoneNumber}</span>}
						</div>
						<hr />
						<div className={styles.menuItems}>
							<p className={`${styles.item} ${currentMenuItem === 'about_me' && styles.item_active}`} onClick={() => setCurrentMenuItem('about_me')}>About me</p>
							<p className={`${styles.item} ${currentMenuItem === 'account_settings' && styles.item_active}`} onClick={() => setCurrentMenuItem('account_settings')}>Account settings</p>
							<p className={`${styles.item} ${currentMenuItem === 'remove_account' && styles.item_active}`} onClick={() => setCurrentMenuItem('remove_account')}>Remove account</p>
						</div>
					</div>
					
				</aside>
				<section className={styles.mainPanel}>
					{currentMenuItem === 'about_me' ? <AboutMeComp /> : null}
					{currentMenuItem === 'account_settings' ? <AccountSettingsComp /> : null}
					{currentMenuItem === 'remove_account' ? <RemoveAccountComp /> : null}
				</section>
			</div>
		</div>
	)
}

settings.getInitialProps = async props => {
	const userDataRef = projectFirestore.collection('testUserCollection').doc(props.auth.uid)
	
	const userData = await userDataRef.get()
	.then(docSet => {
		if (docSet.exists) {
			return docSet.data()
		} else{
			return null
		}
	})
	.catch(err => {
		console.error('Error getting document', err)
	})
	

	return {userData};
};

export default withPrivateRoute(settings)
