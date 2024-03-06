import React, {useEffect} from 'react'
import usePlacesAutocomplete, {	getGeocode,	getLatLng, getDetails } from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import styles from 'styles/googlePlacesAutocomplete.module.css'

	const PlacesAutocomplete = ({dataFromChild, countryCode, inputValue, isDisabled = false}) => {
		let script;

		useEffect(() => {
			const existingScript = document.querySelector(
			`script[src*="https://maps.googleapis.com/maps/api/js"]`
			);

			const checkExistingScript = () => {
			if (!existingScript) {
				script = document.createElement('script');
				script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places&callback=initMap&loading=async`;
				script.async = true;
				script.defer = true;
				document.head.appendChild(script);
			}
			};

			// Delay the check for the existing script
			const timeoutId = setTimeout(checkExistingScript, 500);

			return () => {
				clearTimeout(timeoutId);
				document.head.removeChild(script);
			};
		}, [countryCode]);

		const getMyPosition = (() => {
			const success = (pos) => {
				const { latitude, longitude } = pos.coords;
		  
				getGeocode({
				  location: new google.maps.LatLng(latitude, longitude),
				}).then((results) => {
				  setValue(results[0].formatted_address);
				});
			  };
		  
			  const error = () => {
				console.error("> Unable to retrieve your location");
			  };
		  
			  if (!navigator.geolocation) {
				console.info("> Geolocation is not supported by your browser");
			  } else {
				navigator.geolocation.getCurrentPosition(success, error);
			  }
			})

		const {
		  ready,
		  value,
		  suggestions: { status, data, structured_formatting },
		  setValue,
		  clearSuggestions,
		} = usePlacesAutocomplete({
		  requestOptions: {
			componentRestrictions: {
				country: countryCode
			}
		},
			callbackName: "initMap",
		  	debounce: 300,
			cache: 24 * 60 * 60,
		});
		
		const ref = useOnclickOutside(() => {
		  // When user clicks outside of the component, we can dismiss
		  // the searched suggestions by calling this method
		  clearSuggestions();
		});
	  
		const handleInput = (e) => { setValue(e.target.value); inputValue(e.target.value); };
	  
		const handleSelect = ({ description, place_id, structured_formatting }) => () => {
			// When user selects a place, we can replace the keyword without request data from API
			// by setting the second parameter to "false"
			let additionalData = [];
			let coordinates = [];
			let locationData = [];
			
			setValue(description, false);
			additionalData.push({description, place_id, structured_formatting})
			clearSuggestions();
		  
		  	// Get latitude and longitude via utility functions
			getGeocode({ address: description})
			.then((results) => getLatLng(results[0]))
			.then(({ lat, lng }) => {
				console.info("📍 Coordinates: ", { lat, lng });
				coordinates.push({ lat, lng })
			})
			.catch((error) => {
				console.error("😱 Error: ", error);
				toSend.push(error)
			});
			
			const parameter = {
				// Use the "place_id" of suggestion from the dropdown (object), here just taking first suggestion for brevity
				placeId: place_id,
				
				// Specify the return data that you want (optional)
				fields: ["name", "rating", 'address_component', 'formatted_phone_number',  "adr_address", "plus_code", "vicinity"],
			};
			getDetails(parameter)
			.then((details) => {
			console.log("Details: ", details);
			locationData.push(details)
			})
			.catch((error) => {
			console.error("Error: ", error);
			});
			dataFromChild({coordinates, locationData, additionalData})
		};

		const renderSuggestions = () =>
		  data.map((suggestion) => {
			const {
			  place_id,
			  structured_formatting: { main_text, secondary_text, terms },
			} = suggestion;

			return (
			  <li key={place_id} onClick={handleSelect(suggestion)} className={styles.suggestionItem}>
				<strong>{main_text}</strong> <small>{secondary_text}</small>	
			  </li>
			);
		  });
	  
		return (
			<div className={`input-field s11 col l5 places-autocomplete ${styles.placesAutocomplete}`} ref={ref}>
				<i className="material-icons prefix white-text">location_city</i>
				<input
					className={styles.locationInput}
					id="post_location"
					value={value}
					onChange={handleInput}
					disabled={!ready || isDisabled}
					type="text"
					placeholder=" "
				/>
				<label className={isDisabled ? styles.label_disabled : ''} htmlFor="post_location">Address</label>
				<i onClick={getMyPosition} className={`material-icons suffix ${isDisabled ? styles.pinIcon_disabled : styles.pinIcon}`}>person_pin_circle</i>
				{status === "OK" && 
					<ul className={styles.autocompleteSuggestionsWrapper}>
						{renderSuggestions()}
					</ul>
				}
		  </div>
		);
	  };



export default PlacesAutocomplete
