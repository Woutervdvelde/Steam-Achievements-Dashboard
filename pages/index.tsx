import React from "react";
import { useCookies } from "react-cookie";
import Login from "../components/pages/login";
import Dashboard from "../components/pages/dashboard";

export default function IndexPage({props}) {
    const [cookies] = useCookies();
    return cookies.user ? <Dashboard/> : <Login/>
    
    // const fetcher = url => axios.get(url).then(res => res.data)
    // const { data, error } = useSWR('/api/achievements', fetcher)
}