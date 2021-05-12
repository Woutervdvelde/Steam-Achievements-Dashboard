import './App.css';
import React from "react";
import Cookies from 'universal-cookie';


import SetupPopup from "./components/SetupPopup";
import Dashboard from "./components/Dashboard";

function App() {
    const cookies = new Cookies();

    if (cookies.get('api_key') === undefined || cookies.get('user_id') === undefined) {
        return (
            <div className="App">
                <SetupPopup/>
            </div>
        )
    } else {
        return (
            <div className="App">
                <Dashboard/>
            </div>
        );
    }
}

export default App;
