import '../styles/globals.css'
import {CookiesProvider} from "react-cookie";
import Navbar from "../components/navbar/navbar";
import Header from "../components/header";
import React from "react";

function SafeHydrate({children}) {
    return (
        <div suppressHydrationWarning>
            {typeof window === 'undefined' ? null : children}
        </div>
    )
}

function MyApp({Component, pageProps}) {
    return (
        <SafeHydrate>
            <CookiesProvider>
                <Header/>
                <Component {...pageProps} />
            </CookiesProvider>
        </SafeHydrate>
    )
}

export default MyApp