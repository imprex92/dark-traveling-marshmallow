import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

let postStorage = (set) => ({
	data: {},
	setPreviouslyViewedPost: (blog) => set({data: blog})
})

postStorage = devtools(postStorage)
postStorage = persist(postStorage, {name: 'post_storage'})

const usePostStorage = create(postStorage)

export default usePostStorage
