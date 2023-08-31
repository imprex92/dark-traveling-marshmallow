import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styles from 'styles/settingsPage.module.css'
import { updateAddress } from './utility/authOperations'

const AddressForm = props => {
	const { M, userData } = props
	const { addressLineOne = null, addressLineTwo = null, cityName = null, country = null, zipCode = null } = userData
	const refs = {
		address_1: useRef(null),
		address_2: useRef(null),
		city: useRef(null),
		zip: useRef(null),
		country: useRef(null)
	}
	const addressStatusMsg = useRef(null)

	const handleSaveAddress = async (e) => {
		e.preventDefault()
		
		const addressData = {
			addressLineOne: refs.address_1.current.value,
			addressLineTwo: refs.address_2.current.value,
			cityName: refs.city.current.value,
			zipCode: refs.zip.current.value,
			country: refs.country.current.value,
		}
		if (
			!addressData.addressLineOne ||
			!addressData.cityName ||
			!addressData.zipCode ||
			!addressData.country
		) {
			M.toast({html:`Missing required address information.`})
		} else {
			try {
				const address = await updateAddress(addressData)
				if(address.status === 200){
					M.toast({html:`Status: ${address.status}, ${address.message}`})
					addressStatusMsg.current.style.color = 'lightgreen'
					addressStatusMsg.current.textContent = 'Update success!'
					addressStatusMsg.current.style.display = 'inline'
					setTimeout(()=>{addressStatusMsg.current.style.display = 'none'},2000);
				} else {
					M.toast({html:`Error: ${address.status}, ${address.message}`})
					addressStatusMsg.current.style.color = 'red'
					addressStatusMsg.current.textContent = 'Update failed!'
					addressStatusMsg.current.style.display = 'inline'
					setTimeout(()=>{addressStatusMsg.current.style.display = 'none'},2000);
				}
			} catch (error) {
				M.toast({html:`Error: ${error.status}, ${error.message}`})
				addressStatusMsg.current.style.color = 'red'
				addressStatusMsg.current.textContent = 'Update failed!'
				addressStatusMsg.current.style.display = 'inline'
				setTimeout(()=>{addressStatusMsg.current.style.display = 'none'},2000);
			}
		}
	}

  return (
	<div className={`row`}>
		<h6 className={styles.addressForm_header}>My home address</h6>
		<form className={`col s12`}>
			<div className={`row ${styles.addressForm_row}`}>
				<div className="input-field col s12">
					<i className="material-icons prefix">apartment</i>
					<input defaultValue={addressLineOne} autoCapitalize='sentences' autoComplete='address-line1' ref={refs.address_1} required={true} type="text" id="address_line_1" className="validate" />
					<label className={addressLineOne ? 'active' : ''} htmlFor="address_line_1">Address</label>
				</div>
			</div>
			<div className={`row ${styles.addressForm_row}`}>
				<div className="input-field col s12">
					<i className="material-icons prefix">abc</i>
					<input defaultValue={addressLineTwo} autoCapitalize='sentences' autoComplete='address-line2' ref={refs.address_2} required={false} type="text" id="address_line_2" className="validate" />
					<label className={addressLineTwo ? 'active' : ''} htmlFor="address_line_2">Address 2</label>
				</div>
			</div>
			<div className={`row ${styles.addressForm_row}`}>
				<div className="input-field col s6">
					<i className="material-icons prefix">location_city</i>
					<input defaultValue={cityName} autoCapitalize='sentences' autoComplete='address-level2' ref={refs.city} required={true} type="text" id="city" className="validate" />
					<label className={cityName ? 'active' : ''} htmlFor="city">City</label>
				</div>
				<div className="input-field col s6">
					<i className="material-icons prefix">123</i>
					<input defaultValue={zipCode} autoComplete='postal-code' ref={refs.zip} required={true} type="text" id="zipCode" className="validate" />
					<label className={zipCode ? 'active' : ''} htmlFor="zipCode">Zip code</label>
				</div>
			</div>
			<div className={`row ${styles.addressForm_row}`}>
				<div className="input-field col s12">
					<i className="material-icons prefix">public</i>
					<input defaultValue={country} autoCapitalize='sentences' autoComplete='country' ref={refs.country} required={true} type="text" id="country" className="validate" />
					<label className={country ? 'active' : ''} htmlFor="country">Country</label>
				</div>
			</div>
			<button onClick={(e) => handleSaveAddress(e)} className="btn-small waves-effect waves-light" >
				Save
				<i className="material-icons right">save</i>
			</button>
			<span ref={addressStatusMsg} className={styles.status_operation}></span>
		</form>
	</div>
  )
}

AddressForm.propTypes = {}

export default AddressForm