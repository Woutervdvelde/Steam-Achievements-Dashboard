import './App.css';
import React from "react";
import Cookies from 'universal-cookie';


import SetupPopup from "./components/SetupPopup";

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
                <h1>Cookies set</h1>
            </div>
        );
    }
}

export default App;
