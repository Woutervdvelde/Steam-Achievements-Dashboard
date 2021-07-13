import {useRouter} from "next/router";
import Navbar from "../../components/navbar";
import {checkUserCookies, parseCookies} from "../../helpers/cookieHelper";
import styles from "../../styles/achievements.module.css";
import Loading from "../../components/loading";
import {useState} from "react";
import useSWR from "swr";
import {fetcher} from "../../helpers/fetchHelper";

export async function getServerSideProps(ctx) {
    const cookies = parseCookies(ctx);
    checkUserCookies(ctx, cookies);

    return {props: {cookies}}
}

export default function Achievements(props) {
    const router = useRouter();
    const {appid} = router.query;
    const user = JSON.parse(props.cookies.user)
    const [loading, setLoading] = useState(true);

    const handleAchievements = (data) => {
        setLoading(false);
        console.log(data)
    }

    const {achievements, error} = useSWR(`/api/achievements?user=${user.steamid}&appid=${appid}`, fetcher, {onSuccess: handleAchievements})

    return (
        <div className={styles.container}>
            <Navbar user={user}/>
            {loading ? <Loading/> :
                <div className={styles.content}>
                    <h1>{appid}</h1>
                </div>
            }

        </div>
    )
}