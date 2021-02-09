import {useEffect} from 'react'
import usePlacesAutocomplete, {	getGeocode,	getLatLng } from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import countryList from 'country-list'

	const PlacesAutocomplete = ({dataFromChild, countryCodes}) => {
		// useEffect(() => {
		// 	const success = (pos) => {
		// 	  const { latitude, longitude } = pos.coords;
		
		// 	  getGeocode({
		// 		location: new google.maps.LatLng(latitude, longitude),
		// 	  }).then((results) => {
		// 		setValue(results[0].formatted_address);
		// 	  });
		// 	};
		
		// 	const error = () => {
		// 	  console.log("> Unable to retrieve your location");
		// 	};
		
		// 	if (!navigator.geolocation) {
		// 	  console.log("> Geolocation is not supported by your browser");
		// 	} else {
		// 	  navigator.geolocation.getCurrentPosition(success, error);
		// 	}
		//   }, [setValue]);

		const getMyPosition = (() => {
			const success = (pos) => {
				const { latitude, longitude } = pos.coords;
		  
				getGeocode({
				  location: new google.maps.LatLng(latitude, longitude),
				}).then((results) => {
					console.log(results);
				  setValue(results[0].formatted_address);
				});
			  };
		  
			  const error = () => {
				console.log("> Unable to retrieve your location");
			  };
		  
			  if (!navigator.geolocation) {
				console.log("> Geolocation is not supported by your browser");
			  } else {
				navigator.geolocation.getCurrentPosition(success, error);
			  }
		})

		const {
		  ready,
		  value,
		  suggestions: { status, data },
		  setValue,
		  clearSuggestions,
		} = usePlacesAutocomplete({
		  requestOptions: {
			/* Define search scope here */
			
			componentRestrictions: {
				country: countryCodes
			}
			
		},
		  debounce: 300,
		//   cache: 24 * 60 * 60,
		});
		
		const ref = useOnclickOutside(() => {
		  // When user clicks outside of the component, we can dismiss
		  // the searched suggestions by calling this method
		  clearSuggestions();
		});
	  
		const handleInput = (e) => {
		  // Update the keyword of the input element
		  setValue(e.target.value);
		};
	  
		const handleSelect = ({ description }) => () => {
		  // When user selects a place, we can replace the keyword without request data from API
		  // by setting the second parameter to "false"
		  let toSend = [];
		  setValue(description, false);
		  clearSuggestions();
		  toSend.push(description)
		  
		  // Get latitude and longitude via utility functions
		  getGeocode({ address: description })
		  .then(async(results) => {
				await getLatLng(results[0])
				console.log(results);
				toSend.push(results[0])
			})
		  .then(({ lat, lng }) => {
			  console.log("📍 Coordinates: ", { lat, lng });
			})
			.catch((error) => {
				console.log("😱 Error: ", error);
			});
			dataFromChild(toSend)
		};
	  
		const renderSuggestions = () =>
		  data.map((suggestion) => {
			const {
			  place_id,
			  structured_formatting: { main_text, secondary_text },
			} = suggestion;
	  
			return (
			  <li key={place_id} onClick={handleSelect(suggestion)}>
				<strong>{main_text}</strong> <small>{secondary_text}</small>
				
			  </li>
			);
		  });
	  
		return (
			<div className="input-field s11 col l5 push-l1 places-autocomplete" ref={ref}>
				<i className="material-icons prefix white-text">location_city</i>
				<input
					id="post_location"
					value={value}
					onChange={handleInput}
					disabled={!ready}
					type="text"
				/>
				<label htmlFor="post_location">Post location</label>
				<i onClick={getMyPosition} className="material-icons prefix">person_pin_circle</i>
				{/* We can use the "status" to decide whether we should display the dropdown or not */}
				{status === "OK" && <ul className="autocomplete-suggestions-wrapper">{renderSuggestions()}
				<img
				src="https://developers.google.com/maps/documentation/images/powered_by_google_on_white.png"
				alt="Powered by Google"
			/></ul>}
		  </div>
		);
	  };



export default PlacesAutocomplete
