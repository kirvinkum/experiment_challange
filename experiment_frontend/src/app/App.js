import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import RequireAuth from "../components/account/RequireAuth";
import PersistLogin from "../components/account/PersistLogin";
import Dashboard from "../components/Dashboard";
import NotFound from "../components/NotFound";
import Login from "../components/account/Login";
import Upload from "../components/Upload";

const App = () => {

    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route element={<PersistLogin/>}>
                <Route element={<RequireAuth/>}>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/upload" element={<Upload/>}/>
                </Route>
            </Route>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
};

export default App;