import {useRouter} from "next/router";
import Gamebar from "../../components/gamebar";
import {checkUserCookies, parseCookies} from "../../helpers/cookieHelper";
import styles from "../../styles/achievements.module.css";
import Loading from "../../components/loading";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {fetcher, get} from "../../helpers/fetchHelper";
import ErrorMessage from "../../components/errorMessage";

export async function getServerSideProps(ctx) {
    const cookies = parseCookies(ctx);
    checkUserCookies(ctx, cookies);

    return {props: {cookies}}
}

export default function Achievements(props) {
    const router = useRouter();
    const { appid } = router.query;
    const user = JSON.parse(props.cookies.user)
    const [achievements, setAchievements] = useState([]);
    const [errorMessage, setErrorMessage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [gameData, setGameData] = useState([]);

    const handleAchievements = (data) => {
        setLoading(false);
        setAchievements(data);
    }

    const handleError = (data) => {
        setLoading(false);
        console.log(data);
    }

    const compareAchievements = (a, b) => {
        console.log({a, b});
    }

    const handleGameData = (data) => {
        console.log(data)
        if (!data.hasOwnProperty('achievements'))
            setErrorMessage("There are no achievements for this game")

        setGameData(data);
    }

    const handleGameError = (data) => {
        console.log(data);
    }

    const {g, gError} = useSWR(`/api/game?appid=${appid}`, fetcher, {
        onSuccess: handleGameData,
        onError: handleGameError
    })

    const {a, aError} = useSWR(`/api/achievements?user=${user.steamid}&appid=${appid}`, fetcher, {
        refreshInterval: 10000,
        revalidateOnFocus: false,
        errorRetryCount: 2,
        onSuccess: handleAchievements,
        onError: handleError,
        compare: compareAchievements
    })

    return (
        <div className={styles.container}>
            <Gamebar user={user}/>
            {loading ? <Loading/> :
                <div className={styles.content}>
                    <h1>{appid}</h1>
                    {!errorMessage && !achievements && <Loading/>}
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                    {achievements && (
                        <div>
                            {achievements.map(a => {
                                return (<p key={a.name}>{a.name}</p>)
                            })}
                        </div>
                    )}
                </div>
            }
        </div>
    )
}