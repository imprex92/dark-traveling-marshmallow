import axios from 'axios';

export async function fetchWeatherByCoords(data) {
  try {
    if (!data.latitude || !data.longitude) {
      throw new Error('Invalid coordinates');
    }
    const units = localStorage.getItem('units') || 'metric';

    const { latitude, longitude } = data;
    let config = {
      method: 'get',
      url: `${process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL}lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=${units}`,
    };

    const response = await axios(config);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
export async function fetchWeatherByQuery(query) {
  const units = localStorage.getItem('units') || 'metric';

  let config = {
    method: 'get',
    url: `${process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL}q=${encodeURIComponent(query)}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=${units}`,
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
export async function fetchFallbackWeather() {
  const fallbackCity = encodeURIComponent('New York');
  const config = {
    method: 'get',
    url: `${process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL}q=${fallbackCity}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`,
  };
  try {
    const response = await axios(config);

    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
