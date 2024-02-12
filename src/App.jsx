import Main from './mainpage/Main'
import Product from './productpage/Product'
import Cart from './cartpage/Cart'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './login/Login'
import Register from './register/Register'
import { useContext } from 'react'
import Context from './contexts/GlobalContext'
import { useCookieContext } from './contexts/CookieContext'
import NotFound from './common/components/NotFound'

function App() {
  const { cookies } = useCookieContext()
  const { isTokenExpired } = useContext(Context)
  const isAuthenticated = cookies.accessToken && !isTokenExpired(cookies.accessToken) ? true : false;
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />}></Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='*' element={<NotFound />} />
        <Route
          path="/main"
          element={isAuthenticated ? <Main /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/product/:id"
          element={isAuthenticated ? <Product /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/cart"
          element={isAuthenticated ? <Cart /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </>
  )
}

export default App