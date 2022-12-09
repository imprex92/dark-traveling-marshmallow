import create from 'zustand'
import { devtools, persist } from 'zustand/middleware';

let bearStore = (set) => ({
	bears: 0,
	increasePopulation: () => set((state) => ({ bears: state.bears + 1})),
	decreasePopulation: () => set((state) => ({ bears: state.bears - 1})),
	exterminatePopulation: () => set({ bears: 0 })
})

bearStore = devtools(bearStore)
bearStore = persist(bearStore, {name: 'test_store_data'})

const useBearStore = create(bearStore)

export default useBearStore