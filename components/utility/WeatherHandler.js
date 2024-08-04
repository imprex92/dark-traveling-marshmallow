import axios from "axios";

export function fetchWeatherByCoords( data ) {
    return new Promise((resolve, reject) => {
        const units = localStorage.getItem('units') || 'metric'

        const { latitude, longitude } = data
        let config = {
            method: 'get',
            url: `${process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL}lat=${latitude ?? 38.897957}&lon=${longitude ?? -77.036560}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=${units}`
        }

        axios(config)
        .then((res) => resolve(res))
        .catch(err => reject('something went wrong', err))
        })
}
export function fetchWeatherByQuery (query){
    return new Promise((resolve, reject) => {
        const units = localStorage.getItem('units') || 'metric'

        let config = {
            method: 'get',
            url: `${process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL}q=${encodeURIComponent(query)}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=${units}`
        }
	
        axios(config)
            .then((res) => resolve(res))
            .catch(err => reject('Something went wrong. Please try again', err))
    })
}
export function fetchFallbackWeather(){
    const fallbackCity = encodeURIComponent('New York')
    const config = {
        method: 'get',
        url: `${process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL}q=${fallbackCity}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
    }
    return new Promise((resolve, reject) => {
        axios(config)
            .then((res) => resolve(res))
            .catch(err => reject('Something went wrong. Please try again', err));
    });
}