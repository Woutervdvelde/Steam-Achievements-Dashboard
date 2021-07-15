import React, {useState} from "react";
import {get} from "../helpers/fetchHelper";
import {useCookies} from "react-cookie";
import Image from "next/image";
import Spinner from "../components/spinner";
import styles from "../styles/login.module.css";
import classNames from 'classnames';
import {useRouter} from "next/router";

export default function LoginPage() {
    const router = useRouter();
    const [cookies, setCookie] = useCookies();
    const [inputError, setInputError] = useState("");
    const [userData, setUserData] = useState({});
    const [userDataLoading, setUserDataLoading] = useState(false);
    const [user, setUser] = useState("");

    const setError = (message) => {
        setInputError(message);
        setUserDataLoading(false);
    }

    const requestUser = async () => {
        event.preventDefault();
        setUserDataLoading(true);
        setUserData({});

        if (user === "")
            return setError("Please fill in a valid user name/id");

        const [data, error] = await get(`/api/userdata?user=${user}`);
        if (error || data.response.players.length === 0)
            return setError("There was an error fetching your data");

        setUserData(data.response.players[0]);
        setError("");
    }

    const confirmUser = async () => {
        setCookie('user', userData, {expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))});
        router.push("/dashboard");
    }

    const denyUser = async () => {
        setUser("");
        setUserData({});
    }

    return (
        <div className={styles.container}>
            <h1>login</h1>
            <p className={styles.header}>To be able to analyse your achievements, I need a bit of information from you. <br/>
                Please fill in your steam id, steam name or your entire profile url. <br/>
                If I show the correct profile you can proceed by clicking on &apos;Yup&apos;</p>
            <div>
                <form onSubmit={requestUser} className={styles.formContainer}>
                    <div>
                        <input id="userInput" onChange={e => setUser(e.target.value)} value={user} className={styles.formInput}/>
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
                                <a href={userData.profileurl} target="_blank" rel="noreferrer">{userData.profileurl}</a>
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