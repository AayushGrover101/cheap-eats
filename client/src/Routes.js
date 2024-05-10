import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home"

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route exact path="/" element={
         <Home />
        } />

        <Route path="/login" element={
          <Login />
        } />

        <Route path="/signup" element={
          <Signup />
        } />
        
      </Routes>
    </BrowserRouter>
  )
}