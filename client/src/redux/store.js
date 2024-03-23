// Import funkcji i modułów z Redux Toolkit oraz redux-persist
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'
import themeReducer from './theme/themeSlice'
// Kombinacja reducerów związanych z użytkownikiem i motywem
const rootReducer = combineReducers({
	user: userReducer, // Reducer związany z użytkownikiem
	theme: themeReducer, // Reducer związany z motywem
})
// Konfiguracja persistConfig dla redux-persist, definicja kluczowego magazynu (storage) i wersji
const persistConfig = {
	key: 'root',
	storage,
	version: 1,
}
// Utworzenie persistedReducer z użyciem persistReducer i wcześniej zdefiniowanego rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer)
// Konfiguracja głównego magazynu za pomocą configureStore z Redux Toolkit
export const store = configureStore({
	reducer: persistedReducer, // Użycie persistedReducer jako głównego reducera
	middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }), // Wyłączenie sprawdzania serializowalności dla redux-persist
})
// Utworzenie i eksport persistora za pomocą persistStore z redux-persist
export const persistor = persistStore(store)
