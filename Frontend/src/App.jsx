import { BrowserRouter, Route, Routes } from "react-router-dom"

import Navbar from "./components/UI/Navbar"
import Home from "./components/pages/Home"
import Login from "./components/pages/Login"
import Signup from "./components/pages/Signup"
import Cart from "./components/pages/Cart"
import Profile from "./components/pages/Profile"
import Dashboard from "./components/pages/Dashboard"
function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/cart" element={<Cart/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
