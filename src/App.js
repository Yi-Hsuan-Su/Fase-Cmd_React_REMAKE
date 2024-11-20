import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Basic from './base/Basic'; // 確保這裡的導入路徑正確
import Advanced from './advanced/Advanced'; // 確保這裡的導入路徑正確
import 'bootstrap/dist/css/bootstrap.min.css'; // 確保引入 Bootstrap 样式
import './App.css'; // 確保這行存在

const App = () => {
    return (
        <>
            <nav className="nav nav-tabs">
                <NavLink
                    to="/"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                    Basic
                </NavLink>
                <NavLink
                    to="/advanced"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                    Advanced
                </NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<Basic />} />
                <Route path="/advanced" element={<Advanced />} />
            </Routes>
        </>
    );
};

export default App;