import {useRouter} from "next/router";
import Gamebar from "../../components/gamebar";
import {checkUserCookies, parseCookies} from "../../helpers/cookieHelper";
import styles from "../../styles/achievements.module.css";
import Loading from "../../components/loading";
import {useEffect, useState} from "react";
import useSWR from "swr";
import {fetcher, get} from "../../helpers/fetchHelper";
import ErrorMessage from "../../components/errorMessage";
import GameInfo from "../../components/game/gameInfo";
import TimePlayed from "../../components/game/timePlayed";
import Achievement from "../../components/achievement";
import GameData from "../../components/gameData";

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
    const [achievementsInterval, setAchievementsInterval] = useState(10000);
    const [errorMessage, setErrorMessage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [gameData, setGameData] = useState({});

    const handleAchievements = (data) => {
        setLoading(false);
        if (data.error)
            handleError("There are no achievements for this game")
        else
            setAchievements(data);
    }

    const handleError = (data) => {
        setLoading(false);
        setErrorMessage(data);
    }

    const compareAchievements = (a, b) => {

    }

    const handleGameData = (data) => {
        if (!data.hasOwnProperty('achievements')) {
            setAchievementsInterval(0);
            setErrorMessage("There are no achievements for this game");
        }

        console.log(data)
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
        refreshInterval: achievementsInterval,
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
                    {gameData && <GameData game={gameData} achievements={achievements}/>}
                    {!errorMessage && !achievements && <Loading/>}
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                    {achievements && (
                        <div>
                            {achievements.map(a => {
                                return (<Achievement key={a.name} a={a}/>)
                            })}
                        </div>
                    )}
                </div>
            }
        </div>
    )
}