import React from "react";
import { useCookies } from "react-cookie";
import Login from "../components/pages/login";
import Dashboard from "../components/pages/dashboard";
import {parseCookies} from "../helpers";

export default function IndexPage({props}) {
    const [cookies] = useCookies();
    return cookies.user ? <Dashboard/> : <Login/>
}