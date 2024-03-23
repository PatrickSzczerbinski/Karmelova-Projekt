//Motyw aplikacji - light / dark
// Import funkcji createSlice z Redux Toolkit
import { createSlice } from '@reduxjs/toolkit' 
// Początkowy stan dla slice
const initialState = {
	theme: 'dark',
}
// Utworzenie "slice"
const themeSlice = createSlice({
	name: 'theme', // Nazwa slice
	initialState, // Początkowy stan
	reducers: {
		// Akcja do przełączania między 'light' a 'dark'
		toggleTheme: state => {
			// Zmienia stan w zależności od obecnego stanu
			state.theme = state.theme === 'light' ? 'dark' : 'light'
		},
	},
})
// Eksport do użycia w komponentach
export const { toggleTheme } = themeSlice.actions
// Eksport reducera do zarządzania stanem
export default themeSlice.reducer
