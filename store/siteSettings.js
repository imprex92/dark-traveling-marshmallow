import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

let siteSettings = (set) => ({
	data: {
		name: null,
		theme: 'dark',
		units: 'celsius',
		language: 'en',
		timeFormat: 24,
		dateFormat: 'dd/mm/yyyy',
		previouslyViewedPost: '',
		latestLocation: null,
		latestWeather: null,
		showWeatherWidget: true,
	},
	setPreviouslyViewedPost: (value) => set((state) => ({data : {...state.data, previouslyViewedPost : value}})),
	setLatestLocation: (value) => set((state) => ({data : {...state.data, latestLocation : value}})),
	setLatestWeather: (value) => set((state) => ({data : {...state.data, latestWeather : value}})),
})

siteSettings = devtools(siteSettings)
siteSettings = persist(siteSettings, {name: 'site_settings'})

const useSiteSettings = create(siteSettings)

export default useSiteSettings
