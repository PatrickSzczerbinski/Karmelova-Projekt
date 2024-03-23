import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StronaGlowna from './pages/StronaGlowna'
import About from './pages/About'
import Logowanie from './pages/Logowanie'
import Rejestracja from './pages/Rejestracja'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminPrivateRoute from './components/AdminPrivateRoute'
import AddPost from './pages/AddPost'
import Kontakt from './pages/Kontakt'
import EditPost from './pages/EditPost'
import Kalendarz from './pages/Kalendarz'
import StronaPostow from './pages/StronaPostow'
import ScrollTop from './components/ScrollTop'
import Galeria from './pages/Galeria'
import Menu from './pages/Menu'
import Offer from './pages/Offer'
import Regulamin from './pages/Regulamin'

export default function App() {
  return (
    <BrowserRouter>
    <ScrollTop />
      <Header />
      <Routes>
        <Route path='/' element={<StronaGlowna />}></Route>
        <Route path='/onas' element={<About />}></Route>
        <Route path='/logowanie' element={<Logowanie />}></Route>
        <Route path='/rejestracja' element={<Rejestracja />}></Route>
        <Route path='/kalendarz' element={<Kalendarz />}></Route>
        <Route path='/menu' element={<Menu />}></Route>
        <Route path='/oferta' element={<Offer />}></Route>
        <Route path='/regulamin' element={<Regulamin />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />}></Route>
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path='/addpost' element={<AddPost />} />
          <Route path='/update-post/:postId' element={<EditPost />} />
        </Route>
        <Route path='/galeria' element={<Galeria />}></Route>
        <Route path='/kontakt' element={<Kontakt />}></Route>
        <Route path='/post/:postSlug' element={<StronaPostow />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}