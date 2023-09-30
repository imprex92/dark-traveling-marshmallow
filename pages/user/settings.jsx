import React, { useState, useRef } from 'react'
import withPrivateRoute from 'components/HOC/withPrivateRoute'
import { projectFirebase, projectFirestore } from 'firebase/config'
import styles from 'styles/settingsPage.module.css'
import SideNav from 'components/nav/Sidenav'
import Googleicon from 'public/assets/icons8-google.svg'
import { accountRemoval, updateEmail, updatePassword, verifyUserEmail, updateAccountData, reAuthenticate } from 'components/utility/authOperations'
import AddressForm from 'components/AddressForm'
import CircularLoader from 'components/loaders/preloaders/CircularLoader'
import { useRouter } from 'next/router'
import { verifyEmail } from 'components/utility/verifyEmail'

const settings = ({userAuth, userData}) => {
	const { displayName, email, emailVerified, phoneNumber, photoURL = null, providerId} = userData
	const fileTypeImage = ['image/jpeg', 'image/gif', 'image/png', 'image/raw', 'image/heif', 'image/webp', 'image/heic']
	const maxSize = 2097152;
	const router = useRouter()
	
	const [currentMenuItem, setCurrentMenuItem] = useState('about_me')
	const [open, setOpen] = useState(false);
	const [showReAuthDialog, setShowReAuthDialog] = useState(false)

	const phoneInput = useRef(phoneNumber)
	const nameInput = useRef(displayName)
	const fileInput = useRef()
	const profileStatusMsg = useRef(null)
	const emailStatusMsg = useRef(null)
	const passwordStatusMsg = useRef(null)
	const removeAccMsg = useRef(null)
	const verificationEmailMsg = useRef(null)
	const verificationEmailLoader = useRef(false)
	const profileStatusLoader = useRef(false)
	const emailStatusLoader = useRef(false)
	const passwordStatusLoader = useRef(false)

	const handleReauthCallback = () => {
		setShowReAuthDialog(true)
		M.toast({text:'Re-authentication needed!'})
	}
	const handleAccountRemoval = async() => {
		removeAccMsg.current = false
		const deletion = await accountRemoval(handleReauthCallback)
		if(deletion.code === 200){
			M.toast({text: `${deletion.message}! Redirecting...`})
			router.replace('/login')
		}
	}
	const handleVerifyEmail = async() => {
		verificationEmailLoader.current = true
		const verification = await verifyUserEmail()
		if (verification.code === 200) {
			profileStatusLoader.current = false
			verificationEmailMsg.current.style.color = 'lightgreen'
			verificationEmailMsg.current.textContent = verification.message
			verificationEmailMsg.current.style.display = 'inline'
			setTimeout(()=>{verificationEmailMsg.current.style.display = 'none'},2000);
		}
		M.toast({text: verification.message})
		verificationEmailLoader.current = false
	}
	const handlePassEmailUpdate = async(type, data) => {
		if(type === 'email'){
			if(verifyEmail(data)){
				emailStatusLoader.current = true
				document.getElementById('email').classList.add('valid')
				document.getElementById('email').classList.remove('invalid')
				const emailUpdate = await updateEmail(data)
				if (emailUpdate.status === 200) {
					emailStatusLoader.current = false
					emailStatusMsg.current.style.color = 'lightgreen'
					emailStatusMsg.current.textContent = 'Update success!'
					emailStatusMsg.current.style.display = 'inline'
					setTimeout(()=>{emailStatusMsg.current.style.display = 'none'},2000);
				}else{
					emailStatusLoader.current = false
					emailStatusMsg.current.style.color = 'red'
					emailStatusMsg.current.textContent = 'Update failed!'
					emailStatusMsg.current.style.display = 'inline'
					setTimeout(()=>{emailStatusMsg.current.style.display = 'none'},2000);
				}
			}
			else{
				emailStatusLoader.current = false
				document.getElementById('email').classList.add('invalid')
				document.getElementById('email').classList.remove('valid')
				M.toast({text:'Password requirements: \n Between 6 - 20 characters. \n Contain at least: \n 1 number \n 1 uppercase and 1 lowercase.'})
			}
		}
		else if(type === 'password'){
			passwordStatusLoader.current = true
			const passwordUpdate = updatePassword(data)
			if (passwordUpdate.status === 200) {
					passwordStatusLoader.current = false
					passwordStatusMsg.current.style.color = 'lightgreen'
					passwordStatusMsg.current.textContent = 'Update success!'
					passwordStatusMsg.current.style.display = 'inline'
					setTimeout(()=>{passwordStatusMsg.current.style.display = 'none'},2000);
				}else{
					passwordStatusLoader.current = false
					passwordStatusMsg.current.style.color = 'red'
					passwordStatusMsg.current.textContent = 'Update failed!'
					passwordStatusMsg.current.style.display = 'inline'
					setTimeout(()=>{passwordStatusMsg.current.style.display = 'none'},2000);
				}
		}
		else{
			passwordStatusLoader.current = false
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
			M.toast({text:'Please select a valid image with size less than 2mb'})
		}
	}
	const handleUpdateAccountInfo = async (e) => {
		e.preventDefault()
		profileStatusLoader.current = true
		let update = await updateAccountData({
			name: nameInput.current,
			number: phoneInput.current,
			file: fileInput.current
		})
		if (update.status === 200) {
			M.toast({text:`${update.message}`})
			profileStatusLoader.current = false
			profileStatusMsg.current.style.color = 'lightgreen'
			profileStatusMsg.current.textContent = 'Update success!'
			profileStatusMsg.current.style.display = 'inline'
			setTimeout(()=>{profileStatusMsg.current.style.display = 'none'},2000);
			console.log(fileInput.current);
		} else{
			M.toast({text:`Status: ${update.status}, ${update.message}`})
			profileStatusLoader.current = false
			profileStatusMsg.current.style.color = 'red'
			profileStatusMsg.current.textContent = 'Update failed!'
			profileStatusMsg.current.style.display = 'inline'
			setTimeout(()=>{profileStatusMsg.current.style.display = 'none'},2000);
		}
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
	const ReAuthDialogComp = () => {
		const providerId = userAuth?.providerData[0]?.providerId || null
		const [reauthEmail, setReauthEmail] = useState(null)
		const [reauthPassword, setReauthPassword] = useState(null)

		const handleReauth = () => {
			const credentials = projectFirebase.auth.EmailAuthProvider.credential(reauthEmail, reauthPassword)

			reAuthenticate(credentials)
			.then(user => {
				const result = user.providerId && accountRemoval()
				console.log('deletion result',result);
			})
			.catch(err => console.error('my error',err))
		}

		return(
			<div className={styles.reAuthOverlay}>
				<div className={styles.reAuthWrapper}>
					<span onClick={ () => setShowReAuthDialog(false) } className={`material-icons ${styles.closeDialog}`}>
						close
					</span>
					<div className={styles.reAuthContainer}>
						<div className="text">
							<h5>Please re-authenticate</h5>
							<span>There has been some time since you logged in to your account.</span><br/>
							<span>In order to keep your account safe, we need to reauthenticate you.</span><br/>
						</div>
						{providerId === 'password' ? 
						<div className="row">
							<div className="col s12 m6">
								<div className="input-field outlined" style={{margin: '0 4px'}}>
									<input 
									onChange={(e) => setReauthEmail(e.target.value)} 
									autoComplete='email' 
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
								<div className="input-field outlined" style={{margin: '0 4px'}}>
								<input onChange={(e) => setReauthPassword(e.target.value)} autoComplete='current-password' id="reauthPassword" 
								type="password" className="validate" 
								required={true}
								aria-required="true" 
								/>
								<label htmlFor="reauthPassword">Password</label>
								</div>
							</div>
						</div> : null}
						<div className="row">
							{providerId === 'password' ? 
								<a aria-disabled={!verifyEmail(reauthEmail) || !reauthPassword} onClick={() => handleReauth()} className={`${styles.reAuthBtn} ${!verifyEmail(reauthEmail) || !reauthPassword ? 'disabled' : ''} waves-effect waves-light btn-small`}>Authenticate</a> : 
								<button onClick={handleAccountRemoval} className='btn'>
									Authenticate with Google
								</button>
							}
						</div>
					</div>
				</div>
			</div>
		)
	}
	const AboutMeComp = () => {

		return(
			<>
				<form className='col s12'>
					<h6 style={{marginBottom: '1rem'}}>About me</h6>
					<div className="row">
						<div className="input-field col s12 m6">
							<input autoComplete='name' ref={nameInput} type="text" id="full_name" defaultValue={displayName} className="validate" />
							<label className={nameInput.current ? 'active' : ''} htmlFor="full_name">Full name</label>
						</div>
						<div className="input-field col s12 m6">
							<input autoComplete='tel' ref={phoneInput} type="tel" id="tel" defaultValue={phoneNumber} className="validate" />
							<label className={phoneInput.current ? 'active' : ''} htmlFor="tel">Mobile number</label>
						</div>
					</div>
					<h6>Profile picture</h6>
					<div className="row" style={{marginBottom: '10px'}}>
						<div className={`file-field input-field`}>
							<div className={`btn-small ${styles.fileBtn}`}>
								<span>File</span>
								<input autoComplete='off' ref={fileInput} className='validate' type="file" accept='image/*' onChange={(file) => {handlePictureUpload(file)}} />
							</div>
							<div className="file-path-wrapper">
								<input id="change-profilePic" placeholder='Upload picture' type="text" className="file-path validate" />
							</div>
						</div>
					</div>
					<button disabled={profileStatusLoader.current} onClick={(e) => handleUpdateAccountInfo(e)} className="btn-small waves-effect waves-light" >Save
						<i className="material-icons right">save</i>
					</button>
					<span ref={profileStatusMsg} className={styles.status_operation}></span>
					{profileStatusLoader.current ? <CircularLoader loaderColor='default' loaderSize='small' /> : null}
				</form>
				<AddressForm userData={userData} M={M} />
			</>
		)
	}
	const AccountSettingsComp = () => {
		const [emailNewValue, setEmailNewValue] = useState(email)
		const emailPrevValue = email;
		let isSame = emailPrevValue === emailNewValue;

		return(
			<div className={styles.accountSettingsComp}>
				<h6>Account Settings</h6>
				<p>Change email or password</p>
				<form className="col s12">
					{providerId === 'password' 
					? (
					<>
						<div style={{position: 'relative'}} className={`row ${styles.fieldRow}`}>
							<div className="input-field col s12 m10">
								<input autoComplete='email' required="" aria-required="true" onChange={x => setEmailNewValue(x.target.value)} type="email" id="email" className="validate" defaultValue={email} />
								<label className='active' htmlFor="email">Change email</label>
								<span className="helper-text" data-error="Doesn't look correct" data-success="Looks good"></span>
									{ !isSame ? (
										<>
											<i className={`material-icons suffix red-text ${styles.inputCancel}`} onClick={() => {setEmailNewValue(emailPrevValue), document.getElementById('email').value = emailPrevValue}}>
												cancel
											</i>
											<i className={`material-icons suffix ${styles.inputUpdate}`} onClick={() => {handlePassEmailUpdate('email', emailNewValue)}}>
												edit
											</i>
										</>
									) : null }
							</div>
							{emailStatusLoader.current ? <CircularLoader loaderColor='default' loaderSize='small' wrapperMargins='1.25rem 0 0 0.25rem' /> : null} 
							<span ref={emailStatusMsg} style={{position: 'absolute', left: '-5px', bottom: '-5px'}} className={styles.status_operation}></span>
						</div>
						<div style={{position: 'relative'}} className={`row ${styles.fieldRow}`}>
							<div className="input-field col s12 m10">
								<i style={{position: 'absolute', top: '15px', right: '15px', float: 'right', cursor: 'pointer'}} className="material-icons" id='passwordToggleBtn' onClick={(e) => {changeVisibility(e)}}>visibility_off</i>
								<input autoComplete='new-password' type={'password'} name="" id="password" className="validate" />
								<label htmlFor="password">Change password</label>
							</div>
							<span ref={passwordStatusMsg} style={{position: 'absolute', left: '-5px', bottom: '-10px'}} className={styles.status_operation}></span>
						</div>
					</>
					) 
					: 
					(
						<p>Email and password cannot be changed when logged in with Google.</p>
					)}
				</form>
				<h6>Verify account</h6>
				<button onClick={handleVerifyEmail} disabled={emailVerified} className={`btn waves-effect waves-light btn-small ${emailVerified && 'disabled'} ${styles.verifyEmailBtn}`} type="submit" name="action">
					{emailVerified ? 'Already verified' : 'Verify email'}
					<i className="material-icons right">{emailVerified ? 'done' : 'warning_amber'}</i>
				</button>
				<span ref={passwordStatusMsg} className={styles.status_operation}></span>
				<span ref={verificationEmailMsg} className={styles.status_operation}></span>
				{passwordStatusLoader.current || verificationEmailLoader.current ? <CircularLoader loaderColor='default' loaderSize='small' wrapperMargins='0.25rem 0 0 1rem' /> : null}
			</div>
		)
	}
	const RemoveAccountComp = () => {
		
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
					<a style={{marginTop: "1rem"}} className={`${styles.removeForeverBtn} waves-effect waves-light btn-small red darken-1 ${isChecked ? '' : 'disabled'}`} onClick={() => {handleAccountRemoval(), setOpen(false)} }>
					<i className="material-icons right">delete_forever</i>
					I am completely sure!
					</a>
					<p>
						<small>*Takes up to 3 days <br/>*You will lose access directly</small>
					</p>
				</div>
			)
		}

		return(
			<>
				{open ? <div onClick={ () => setOpen(false) } className={styles.overlay}></div> : null}
				<h6>Remove Account</h6>
				<a className={`${styles.removeForeverBtn} waves-effect waves-light btn-small red darken-1`} onClick={ () => setOpen(true) }>
					<i className="material-icons right">delete_forever</i>
					I want to remove my account!
				</a>
				{removeAccMsg.current ? <p className={styles.removeAccMsg} ref={removeAccMsg}>Something went wrong</p> : null}
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
			{showReAuthDialog ? <ReAuthDialogComp /> : null}
			<div className={styles.settingsWrapper}>
				<aside className={styles.sidePanel}>
					<img loading='eager' style={{objectFit: 'cover'}} className='circle' src={photoURL || "/assets/icons8-test-account.png"} width={120} height={120} />
					<div className={styles.sidePanelItems}>
						<div className={styles.userInfo}>
							<h4>{displayName ? displayName : 'No name yet.'}</h4>
							<span className={`${styles.tooltip} ${emailVerified ? 'green-text' : 'red-text'}`}>
								{email}
								<span className={styles.tooltipText}>{emailVerified ? 'Email verified.' : 'Not verified.'}</span>
							</span><br />
							{ providerId === 'google.com' ? 
							<span className={`${styles.tooltip} ${styles.googleIconWrap}`}>
								<Googleicon />
								<span className={styles.tooltipText}>Logged in with google.</span>
							</span> : 
								<span className={styles.tooltip}>
									<span className={`material-icons`}>vpn_key</span>
									<span className={styles.tooltipText}>Logged in with password.</span>
								</span>
							}
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
