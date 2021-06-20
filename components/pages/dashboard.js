import {useCookies} from "react-cookie";
import Navbar from "../navbar/navbar";
import styles from "../../styles/dashboard.module.css";

export default function Dashboard() {
    const [cookies, setCookie, removeCookie] = useCookies();

    if (cookies.user)
        return (
            <div className={styles.container}>
                <Navbar/>
                <div className={styles.content}>
                    <h1>Dashboard</h1>
                    <h2>Welcome back {cookies.user.personaname}</h2>
                </div>
            </div>
        )

    return <h1>loading...</h1>
}