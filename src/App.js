import logo from './logo.svg';
import './App.css';
import React from "react";
import { useCookies } from 'react-cookie';


import SetupPopup from "./components/SetupPopup";

function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['api_key', 'user_id', 'api_key_valid', 'user_id_valid']);
    if (cookies.api_key_valid && cookies.user_id_valid) {
        return (
            <div className="App">
                <SetupPopup/>
            </div>
        )
    }
  return (
    <div className="App">
      <SetupPopup/>
    </div>
  );
}

export default App;
