import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './redux/store.jsx'
import { Provider } from 'react-redux'
import { AuthProvider } from './auth/JwtContext'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </AuthProvider>
    </BrowserRouter>
)
