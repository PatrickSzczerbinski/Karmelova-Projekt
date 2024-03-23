export const errorHandler = (statusCode, message) => { // Deklaracja errorHandler
	
	const error = new Error() // Tworzenie nowego obiektu błędu
	error.statusCode = statusCode // Ustawienie kodu stanu błędu
	error.message = message // Ustawienie wiadomości błędu

	return error
}
