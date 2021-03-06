import styles from "../styles/components/logout.module.css";
import {useCookies} from "react-cookie";

export default function LogoutIcon() {
    const [cookies, setCookie, removeCookie] = useCookies();

    const logout = () => {
        removeCookie('user');
        if (window)
            window.location.href = location.protocol + '//' + location.host;
    }

    return (
        <h3 onClick={logout}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M16 13L16 11 7 11 7 8 2 12 7 16 7 13z"/>
                <path
                    d="M20,3h-9C9.897,3,9,3.897,9,5v4h2V5h9v14h-9v-4H9v4c0,1.103,0.897,2,2,2h9c1.103,0,2-0.897,2-2V5C22,3.897,21.103,3,20,3z"/>
            </svg>
        </h3>
    )
}