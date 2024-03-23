// Import funkcji createSlice z Redux Toolkit
import { createSlice } from '@reduxjs/toolkit';
// Początkowy stan dla slice związanego z użytkownikiem
const initialState = {
  currentUser: null, // Aktualnie zalogowany użytkownik
  error: null,
  loading: false,// Flaga informująca o trwającym procesie ładowania
};
//Utworzenie "slice" stanu dla użytkownika
const userSlice = createSlice({
  name: 'user',// Nazwa slice
  initialState,// Początkowy stan
  reducers: {
    // Akcja rozpoczynająca proces logowania
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Akcja po udanym zalogowaniu
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;// Ustawia zalogowanego użytkownika
      state.loading = false;
      state.error = null;
    },
    // Akcja po nieudanym zalogowaniu
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Akcja rozpoczynająca proces aktualizacji danych użytkownika
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Akcja po udanej aktualizacji danych użytkownika
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;// Ustawia zaktualizowanego użytkownika
      state.loading = false;
      state.error = null;
    },
    // Akcja po nieudanej aktualizacji danych użytkownika
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;// Ustawia błąd
    },
     // Akcja rozpoczynająca proces usuwania użytkownika
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Akcja po udanym usunięciu użytkownika
    deleteUserSuccess: (state) => {
      state.currentUser = null;// Ustawia zalogowanego użytkownika na null
      state.loading = false;
      state.error = null;
    },
    // Akcja po nieudanym usunięciu użytkownika
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;// Ustawia błąd
    },
    // Akcja po udanym wylogowaniu
    signoutSuccess: (state) => {
      state.currentUser = null;// Ustawia zalogowanego użytkownika na null
      state.error = null;
      state.loading = false;
    },
  },
});
// Eksport akcji do użycia w komponentach
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} = userSlice.actions;
// Eksport reducera do zarządzania stanem użytkownika
export default userSlice.reducer;