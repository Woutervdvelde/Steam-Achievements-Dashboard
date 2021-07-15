import styles from "../styles/dashboard.module.css";
import {checkUserCookies, parseCookies} from "../helpers/cookieHelper";
import Gamebar from "../components/gamebar";
import useSWR from "swr";
import { fetcher } from "../helpers/fetchHelper";

export async function getServerSideProps(ctx) {
    const cookies = parseCookies(ctx);
    checkUserCookies(ctx, cookies);

    return {props: { cookies }}
}

export default function Dashboard(props) {
    const user = JSON.parse(props.cookies.user)

    return (
        <div className={styles.container}>
            <Gamebar user={user}/>
            <div className={styles.content}>
                <h1>Dashboard</h1>
            </div>
        </div>
    )
}