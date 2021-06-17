import '../styles/globals.css'
import {CookiesProvider} from "react-cookie";
import Navbar from "../components/navbar/navbar";
import Header from "../components/header";
import React from "react";

function MyApp({Component, pageProps}) {
    return (
        <CookiesProvider>
            <Header/>
            <Navbar/>
            <Component {...pageProps} />
        </CookiesProvider>
    )
}

export default MyApp