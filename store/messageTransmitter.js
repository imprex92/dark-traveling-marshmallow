import create from "zustand";
import { devtools, persist } from "zustand/middleware";

let messageCenter = (set) => ({
	message: '',
	setMessage: () => set((state) => ({ message: state.message})),
	setWarning: () => set((state) => ({ message: state.message})),
	setError: () => set((state) => ({ message: state.message})),
	clearMessage: () => set({ message: '' })
})

messageCenter = devtools(messageCenter)
messageCenter = persist(messageCenter, {name: 'message_center'})

const useMessageCenter = create(messageCenter)

export default useMessageCenter