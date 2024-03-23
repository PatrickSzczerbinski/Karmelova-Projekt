import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store, persistor } from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Darkmode from './components/Darkmode.jsx'
//Render Provider i PersistGate do zarządzania stanem Redux
ReactDOM.createRoot(document.getElementById('root')).render(
	<PersistGate persistor={persistor}>
		<Provider store={store}>
			<Darkmode>
			<App />
			</Darkmode>
		</Provider>
	</PersistGate>
)
