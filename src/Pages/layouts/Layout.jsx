import Navbar from '../../components/Navbar/Navbar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <div className="App">
            <Navbar />
            <Outlet />
            <footer>

                
            </footer>
        </div>
    )
}
