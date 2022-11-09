import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/App.css';
import App from "./app/App";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./context/AuthProvider";
import {DashboardFilterProvider} from "./context/DashboardFilterProvider";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <DashboardFilterProvider>
                    <Routes>
                        <Route path="/*" element={<App />} />
                    </Routes>
                </DashboardFilterProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);

