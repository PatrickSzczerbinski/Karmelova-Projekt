import express from 'express' 
import { deleteUser, getUser, pobierzUzytkownikow, signout, test, updateUser } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js' // Import funkcji middleware "verifyToken" do weryfikacji tokena
const router = express.Router()

router.get('/test', test) //Test połączenia
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/signout', signout)
router.get('/getusers', verifyToken, pobierzUzytkownikow)
router.get('/:userId', getUser) //Pobieranie danych usera

export default router
