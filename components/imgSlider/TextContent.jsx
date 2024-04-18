import React from 'react'
import PropTypes from 'prop-types'
import styles from 'styles/postSummary.module.css'
import { ISODateFormatter } from 'components/utility/DateFormatter'
import { useAuth } from 'contexts/AuthContext'

const TextContent = ({ formData }) => {

	const { currentUser } = useAuth();
	const { postMood, postContent, postTitle, postWeather, pickedDateForPost, postLocation, placesInputValue } = formData
	const { additionalData, locationData } = postLocation
	const haveLocationData = postLocation;

	const plusCode = locationData && locationData[0] && 
		(locationData[0].plus_code?.compound_code || locationData[0].plus_code?.global_code) || null;

		return (
		<div className={styles.textRoot}>
			<h3 className={styles.title}>{postTitle}</h3>
			<div className={styles.infoBox}>
				<div className={styles.location}>
					<span className="material-symbols-outlined white-text">location_on</span>
					{ 
						locationData && locationData[0]?.adr_address ? 
						<a 
						className={styles.link}
						dangerouslySetInnerHTML={{ __html: locationData[0].adr_address}} 
						target='_blank' 
						rel="noopener noreferrer" 
						href={
							`https://maps.google.com/?` + 
								(plusCode 
									? `q=${encodeURIComponent(plusCode.replace(/,/g, ''))}`
									: `q=${haveLocationData ? additionalData && encodeURIComponent(additionalData[0]?.description.replace(/,/g, '')) : placesInputValue}`
								)
							}
						></a>
						: 
						<a
						href={`https://maps.google.com/?q=${haveLocationData ? encodeURIComponent(additionalData[0]?.description.replace(/,/g, '')) : placesInputValue}`} 
						target='_blank'
						rel='noopener noreferrer'
						>
							<span>{additionalData ? additionalData[0]?.description : placesInputValue}</span>
						</a>
					}
				</div>
				<div className={styles.weatherMood}>
					<span className={styles.weather}>
						<span className="material-symbols-outlined white-text">routine</span>
						<span>{postWeather}</span>
					</span>
					<span className={styles.mood}>
						<span className="material-symbols-outlined white-text">mood</span>
						<span>{postMood}</span>
					</span>
				</div>
			</div>
			<div className={styles.description}>
				<p>{postContent}</p>
			</div>
			<div className={`divider ${styles.divider}`}></div>
			<div className={styles.authorDateContainer}>
				<small>
					Posted by <a className={styles.link} href="#">{currentUser.displayName}</a>
					<br />
					<ISODateFormatter timestamp={pickedDateForPost} timeFromNow={false} />
				</small>
			</div>
		</div>
	)
}

TextContent.propTypes = {
	formData: PropTypes.shape({
		mood: PropTypes.string,
		postContent: PropTypes.string.isRequired,
		postTitle: PropTypes.string.isRequired,
		weather: PropTypes.string,
		postLocation: PropTypes.shape({
			coordinates: PropTypes.arrayOf(
			PropTypes.shape({
				lat: PropTypes.number.isRequired,
				lng: PropTypes.number.isRequired
			})
			).isRequired,
			locationData: PropTypes.arrayOf(
			PropTypes.shape({
				address_components: PropTypes.arrayOf(
				PropTypes.shape({
					long_name: PropTypes.string.isRequired,
					short_name: PropTypes.string.isRequired,
					types: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
				})
				).isRequired,
				adr_address: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
				plus_code: PropTypes.shape({
				compound_code: PropTypes.string,
				global_code: PropTypes.string
				}),
				vicinity: PropTypes.string.isRequired,
				html_attributions: PropTypes.arrayOf(PropTypes.string).isRequired
			})
			).isRequired,
			additionalData: PropTypes.arrayOf(
			PropTypes.shape({
				description: PropTypes.string.isRequired,
				place_id: PropTypes.string.isRequired,
				structured_formatting: PropTypes.shape({
				main_text: PropTypes.string.isRequired,
				main_text_matched_substrings: PropTypes.arrayOf(
					PropTypes.shape({
					length: PropTypes.number.isRequired,
					offset: PropTypes.number.isRequired
					})
				).isRequired,
				secondary_text: PropTypes.string.isRequired
				}).isRequired
			})
			).isRequired
		}),
		countryCode: PropTypes.string.isRequired
		}).isRequired
  };

export default TextContent