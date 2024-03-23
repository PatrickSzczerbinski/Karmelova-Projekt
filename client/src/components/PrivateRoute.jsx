// Jeśli istnieje zalogowany użytkownik (currentUser jest prawdziwy), pozwala na dostep do pulpitu nawigacji; w przeciwnym razie przekierowuje użytkownika do  "/logowanie".
import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

export default function PrivateRoute() {
    // Pobranie 'currentUser' ze stanu magazynu Redux
    const { currentUser} = useSelector((state) => state.user)
  return currentUser ? <Outlet /> : <Navigate to ='/logowanie' />    
}
