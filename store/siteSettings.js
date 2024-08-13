import create from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'

let siteSettings = (set, get) => ({
	data: {
		name: null,
		theme: 'dark',
		units: 'metric',
		language: 'en',
		timeFormat: 24,
		dateFormat: 'dd/mm/yyyy',
		previouslyViewedPost: '',
		latestLocation: null,
		latestWeather: null,
		showWeatherWidget: true,
		weatherChips: [],
		weatherSearchHistory: [],
	},

	// Setters
	setName: (value) => set((state) => ({ data: { ...state.data, name: value } })),
	setTheme: (value) => set((state) => ({ data: { ...state.data, theme: value } })),
	setUnits: (value) => set((state) => ({ data: { ...state.data, units: value } })),
	setLanguage: (value) => set((state) => ({ data: { ...state.data, language: value } })),
	setTimeFormat: (value) => set((state) => ({ data: { ...state.data, timeFormat: value } })),
	setDateFormat: (value) => set((state) => ({ data: { ...state.data, dateFormat: value } })),
	setShowWeatherWidget: (value) => set((state) => ({ data: { ...state.data, showWeatherWidget: value } })),
	setPreviouslyViewedPost: (value) => set((state) => ({ data: { ...state.data, previouslyViewedPost: value } })),
	setLatestLocation: (value) => set((state) => ({ data: { ...state.data, latestLocation: value } })),
	setLatestWeather: (value) => set((state) => ({ data: { ...state.data, latestWeather: value } })),
	setWeatherChips: (value) => set((state) => ({ data: { ...state.data, weatherChips: value } })),
	setWeatherSearchHistory: (value) => set((state) => ({ data: { ...state.data, weatherSearchHistory: value } })),

	// Getters
	getName: () => get().data.name,
	getTheme: () => get().data.theme,
	getUnits: () => get().data.units,
	getLanguage: () => get().data.language,
	getTimeFormat: () => get().data.timeFormat,
	getDateFormat: () => get().data.dateFormat,
	getShowWeatherWidget: () => get().data.showWeatherWidget,
	getPreviouslyViewedPost: () => get().data.previouslyViewedPost,
	getLatestLocation: () => get().data.latestLocation,
	getLatestWeather: () => get().data.latestWeather,
	getWeatherChips: () => get().data.weatherChips,
	getWeatherSearchHistory: () => get().data.weatherSearchHistory,
})

siteSettings = devtools(siteSettings)
siteSettings = persist(siteSettings, { name: 'site_settings' })

const useSiteSettings = create(subscribeWithSelector(siteSettings))

export default useSiteSettings
