import create from "zustand";
import { devtools, persist } from "zustand/middleware";

let messageCenter = (set) => ({
	message: '',
	setMessage: (value) => set({ message: value}),
	setWarning: (value) => set({ message: value}),
	setError: (value) => set({ message: value}),
	clearMessage: () => set({ message: '' })
})

messageCenter = devtools(messageCenter)
messageCenter = persist(messageCenter, {name: 'message_center'})

const useMessageCenter = create(messageCenter)

export default useMessageCenter