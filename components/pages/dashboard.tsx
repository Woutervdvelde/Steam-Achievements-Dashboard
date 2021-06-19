import { useCookies } from "react-cookie";
import styles from "../../styles/dashboard.module.css";

export default function Dashboard() {
    const [cookies, setCookie, removeCookie] = useCookies();
    return (
        <div className={styles.container}>
            <h1>Dashboard</h1>
            <h2>Welcome back {cookies.user.personaname}</h2>
            <button onClick={() => {removeCookie('user')}}>Remove cookie</button>
        </div>
    )
}