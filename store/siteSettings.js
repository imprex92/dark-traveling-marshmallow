import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { projectAuth, projectFirestore } from 'firebase/config'

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

projectAuth.onAuthStateChanged((user) => {
	if (user) {
			const { uid } = user
			const userDbRef = projectFirestore.collection('testUserCollection').doc(uid)
			console.log('User logged in, fetching site settings')

			userDbRef.onSnapshot(snapshot => {
					if (snapshot.exists) {
							const settings = snapshot.data().settings
							if (settings) {
									console.log('Site settings snapshot', settings)
									useSiteSettings.setState((state) => ({
											data: {
												...state.data,
												...settings,
											}
									}))
							} else {
								const currentState = useSiteSettings.getState();
								const defaultSettings = {
								  name: currentState.data.name ?? '',
								  theme: currentState.data.theme ?? 'dark',
								  units: currentState.data.units ?? 'metric',
								  language: currentState.data.language ?? 'en',
								  timeFormat: currentState.data.timeFormat ?? 24,
								  dateFormat: currentState.data.dateFormat ?? 'dd/mm/yyyy',
								  showWeatherWidget: currentState.data.showWeatherWidget ?? true,
								};
								userDbRef.set({ settings: defaultSettings }, { merge: true });
								console.log('Initialized settings with default state', defaultSettings);
							  }
					}
			})

			useSiteSettings.subscribe(
				(state) => ({
					name: state.data.name,
					theme: state.data.theme,
					units: state.data.units,
					language: state.data.language,
					timeFormat: state.data.timeFormat,
					dateFormat: state.data.dateFormat,
					showWeatherWidget: state.data.showWeatherWidget,
				}),
				(data) => {
					const validData = {
						name: data.name ?? '',
						theme: data.theme ?? 'dark',
						units: data.units ?? 'metric',
						language: data.language ?? 'en',
						timeFormat: data.timeFormat ?? 24,
						dateFormat: data.dateFormat ?? 'dd/mm/yyyy',
						showWeatherWidget: data.showWeatherWidget ?? true,
					};
					userDbRef.set({ settings: validData }, { merge: true });
				}
			);
	}
})

export default useSiteSettings
