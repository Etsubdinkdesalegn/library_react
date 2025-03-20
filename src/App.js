import { Route, Routes } from 'react-router-dom';
import './App.css';
// import Login from './pages/login/Login';
import ProtectedLayout from './pages/component/protected/ProtectedLayout';
import { useState } from 'react';
import NoMatch from './pages/component/noMatch/NoMatch';
import LoginForm from './pages/login/LoginForm';
import BookList from './pages/login/Guest';

const  App =()  => {
  const [auth, setAuth] = useState({ role: '', isAuthenticated: false });

  return (
    <>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<LoginForm setAuth={setAuth} />} />

        {/* Protected Routes */}
        <Route path="/*" element={<ProtectedLayout auth={auth} />} />
        <Route path="/guest" element={<BookList/>} />


        {/* Fallback NoMatch */}
        <Route path="*" element={<NoMatch/>} />
      </Routes>
    </>
  );
}

export default App;
