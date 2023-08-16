import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styles from 'styles/settingsPage.module.css'
import { updateAddress } from './utility/authOperations'

const AddressForm = props => {
	const { M } = props
	const refs = {
		address_1: useRef(null),
		address_2: useRef(null),
		city: useRef(null),
		zip: useRef(null),
		country: useRef(null)
	}

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
				} else {
					M.toast({html:`Error: ${address.status}, ${address.message}`})
				}
			} catch (error) {
				M.toast({html:`Error: ${error.status}, ${error.message}`})
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
					<input autoCapitalize='sentences' autoComplete='address-line1' ref={refs.address_1} required={true} type="text" id="address_line_1" className="validate" />
					<label htmlFor="address_line_1">Address</label>
				</div>
			</div>
			<div className={`row ${styles.addressForm_row}`}>
				<div className="input-field col s12">
					<i className="material-icons prefix">abc</i>
					<input autoCapitalize='sentences' autoComplete='address-line2' ref={refs.address_2} required={false} type="text" id="address_line_2" className="validate" />
					<label htmlFor="address_line_2">Address 2</label>
				</div>
			</div>
			<div className={`row ${styles.addressForm_row}`}>
				<div className="input-field col s6">
					<i className="material-icons prefix">location_city</i>
					<input autoCapitalize='sentences' autoComplete='address-level2' ref={refs.city} required={true} type="text" id="city" className="validate" />
					<label htmlFor="city">City</label>
				</div>
				<div className="input-field col s6">
					<i className="material-icons prefix">123</i>
					<input autoComplete='postal-code' ref={refs.zip} required={true} type="text" id="zipCode" className="validate" />
					<label htmlFor="zipCode">Zip code</label>
				</div>
			</div>
			<div className={`row ${styles.addressForm_row}`}>
				<div className="input-field col s12">
					<i className="material-icons prefix">public</i>
					<input autoCapitalize='sentences' autoComplete='country' ref={refs.country} required={true} type="text" id="country" className="validate" />
					<label htmlFor="country">Country</label>
				</div>
			</div>
			<button onClick={(e) => handleSaveAddress(e)} className="btn-small waves-effect waves-light" >
				Save
				<i className="material-icons right">save</i>
			</button>
		</form>
	</div>
  )
}

AddressForm.propTypes = {}

export default AddressForm