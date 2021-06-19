import React, {useState} from "react";
import Image from "next/image";
import {useCookies} from "react-cookie";
import {get} from "../../helpers"
import Spinner from "../spinner";
import styles from "../../styles/login.module.css";
import classNames from 'classnames';

export default function Login() {
    const [cookies, setCookie] = useCookies();
    const [inputError, setInputError] = useState("");
    const [userData, setUserData] = useState({});
    const [userDataLoading, setUserDataLoading] = useState(false);
    const [user, setUser] = useState("");

    const setError = (message) => {
        setInputError(message)
        setUserDataLoading(false)
    }

    const requestUser = async () => {
        event.preventDefault()
        setUserDataLoading(true)
        setUserData({})

        if (user === "")
            return setError("Please fill in a valid user name/id")

        let steamid = user
        if (steamid.endsWith('/')) steamid = steamid.slice(0, -1)
        let urlMatch = /.*\.com\/id\/(?<id>.*)/gm.exec(steamid)
        if (urlMatch) {
            steamid = urlMatch.groups.id
        }

        if (steamid.match(/[a-zA-Z]/gm)) {
            const [data, error] = await get(`/api/userid?user=${user}`)
            if (error || data.response.success !== 1)
                return setError("There was an error converting your url/name into a steam id")
            steamid = data.response.steamid
        }

        const [data, error] = await get(`/api/userdata?user=${steamid}`)
        if (error || data.response.players.length === 0)
            return setError("There was an error fetching your data")

        setUserData(data.response.players[0])
        setError("")
    }

    const confirmUser = async () => {
        setCookie('user', userData, {expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))});
    }

    const denyUser = async () => {
        setUserData({});
    }

    return (
        <div className={styles.container}>
            <h1>login</h1>
            <p className={styles.header}>To be able to analyse your achievements, I need a bit of information from you. <br/>
            Please fill in your steam id, steam name or your entire profile url. <br/>
            If I show the correct profile you can proceed by clicking on 'Yup'</p>
            <div>
                <form onSubmit={requestUser} className={styles.formContainer}>
                    <div>
                        <input id="userInput" onChange={e => setUser(e.target.value)} className={styles.formInput}/>
                        <button type="button" onClick={requestUser} className={styles.formButton}>Search
                        </button>
                    </div>
                    <label htmlFor="userInput" className={styles.formError}>{inputError}</label>
                </form>
                {userDataLoading && (
                    <div className={styles.spinner}>
                        <Spinner/>
                    </div>
                )}
                {Object.keys(userData).length === 0 ? <div/> : (
                    <div className={styles.userContainer}>
                        <h1 className={styles.userHeader}>{userData.personaname} | {userData.steamid}</h1>
                        <div className={styles.userDetailsContainer}>
                            <div className={styles.userDetails}>
                                <Image className={styles.userAvatar} src={userData.avatarmedium}
                                       alt="Steam profile picture" width={64} height={64}/>
                            </div>
                            <div className={styles.userDetails}>
                                <p className={styles.userDetailsText}>{userData.realname}</p>
                                <a href={userData.profileurl} target="_blank">{userData.profileurl}</a>
                            </div>
                        </div>
                        <div className={styles.userConfirmContainer}>
                            <div>
                                <p>Is this you?</p>
                            </div>
                            <div>
                                <button className={classNames(styles.userButton, styles.userConfirm)} onClick={confirmUser}>Yup</button>
                                <button className={classNames(styles.userButton, styles.userDeny)} onClick={denyUser}>What? no!</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}