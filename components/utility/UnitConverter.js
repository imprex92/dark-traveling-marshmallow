import moment from "moment";

export function unixConverter (timestamp){
	return(
		<>
			{
				moment.unix(timestamp).format('dddd, DD/MMM/YYYY')
			}
		</>
	)
}

export function mToKm(value){
	return Math.round(value / 1000) ?? null
}

export function toImperial(value, unit){
	const milesFactor = 0.621371
	const speedFactor = 3.281
	if(unit === 'length'){
		let convertedMetric = Math.round(value / 1000)
		let metricToImperial = convertedMetric * milesFactor
		return metricToImperial.toFixed(1)
	}
	else if(unit === 'degrees'){
  		let cToFahr = value * 9 / 5 + 32
		  console.log(cToFahr, 'degrees');
		return cToFahr.toFixed(1)
	}
	else if(unit === 'speed'){
		let converted = value * speedFactor
		return converted.toFixed(1)
	}
}