import React, {useState} from "react";
import Image from "next/image";
import {useCookies} from "react-cookie";
import { get } from "../../helpers"
import Spinner from "../spinner";
import styles from "../../styles/login.module.css";

export default function Login() {
    const [cookies, setCookie] = useCookies();
    const [inputError, setInputError] = useState("");
    const [userData, setUserData] = useState({});
    const [user, setUser] = useState("");

    const requestUser = async () => {
        if (user === "")
            return setInputError("Please fill in a valid user name/id")

        let steamid = user
        if (steamid.endsWith('/')) steamid = steamid.slice(0, -1)
        let urlMatch = /.*\.com\/id\/(?<id>.*)/gm.exec(steamid)
        if (urlMatch) {
            steamid = urlMatch.groups.id
        }

        if (steamid.match(/[a-zA-Z]/gm)) {
            const [data, error] = await get(`/api/userid?user=${user}`)
            if (error || data.response.success !== 1)
                return setInputError("There was an error converting your url/name into a steam id")
            console.log(`setting user: ${data.response.steamid}`)
            steamid = data.response.steamid
        }

        const [data, error] = await get(`/api/userdata?user=${steamid}`)
        if (error || data.response.players.length === 0)
            return setInputError("There was an error fetching your data")

        setUserData(data.response.players[0])
    }

    const confirmUser = async () => {
        // setCookie('user', user, {expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))});
    }

    return (
        <div className={styles.container}>
            <h1>login</h1>
            <div>
                <label htmlFor="userInput">{inputError}</label>
                <input id="userInput" onChange={e => setUser(e.target.value)}/>
                <button onClick={requestUser}>Search
                </button>
                {Object.keys(userData).length === 0 ? <Spinner/> : (
                    <div>
                         <Image src={userData.avatarmedium} alt="Steam profile picture" layout="fill"/>
                    </div>
                )}
            </div>
        </div>
    )
}