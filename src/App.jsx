import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import routes from './routes/AppRoutes'

function App() {

  function renderRoute(route) {
    if (route.index) {
      return (<Route key={"index"} index element={route.element} />);
    } else {
      return (
        <Route key={route.path || "fallback-key"} path={route.path} element={route.element}>
          {route.children?.map((child) => renderRoute(child))}
        </Route>
      );
    }
  }

  return (
    <Routes>
      {routes.map((r) => renderRoute(r))}
    </Routes>
  )
}

export default App
