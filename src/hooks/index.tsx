import { useState, useCallback } from 'react'

export const useLocalStorageState = (key: string, defaultState?: string) => {
	const [state, setState] = useState(() => {
		const storedState = localStorage.getItem(key)
		if (storedState) {
			return JSON.parse(storedState)
		}
		return defaultState
	})

	const setLocalStorageState = useCallback(
		newState => {
			const changed = state !== newState
			if (!changed) {
				return
			}
			setState(newState)
			if (newState === null) {
				localStorage.removeItem(key)
			} else {
				localStorage.setItem(key, JSON.stringify(newState))
			}
		},
		[state, key],
	)

	return [state, setLocalStorageState]
}
