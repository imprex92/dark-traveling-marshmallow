import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

let siteSettings = (set) => ({
	data: {
		name: '',
		theme: 'dark',
		units: 'celcius',
		language: 'en',
		timeFormat: 24,
		dateFormat: 'dd/mm/yyyy',
		previouslyViewedPost: '',
		latestLocation: null,
		weatherInitial: null,
		showWeaterWidget: true,
	},
	setPreviouslyViewedPost: (value) => set((state) => ({data : {...state.data, previouslyViewedPost : value}})),
	setLatestLocation: (value) => set((state) => ({data : {...state.data, latestLocation : value}})),
	setInitialWeather: (value) => set((state) => ({data : {...state.data, weatherInitial : value}})),
})

siteSettings = devtools(siteSettings)
siteSettings = persist(siteSettings, {name: 'site_settings'})

const useSiteSettings = create(siteSettings)

export default useSiteSettings
