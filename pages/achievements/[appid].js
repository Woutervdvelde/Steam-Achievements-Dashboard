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
    const {appid} = router.query;
    const user = JSON.parse(props.cookies.user)
    const [achievements, setAchievements] = useState({});
    const [achievementsInterval, setAchievementsInterval] = useState(10000);
    const [errorMessage, setErrorMessage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [gameData, setGameData] = useState({});
    const [showHidden, setShowHidden] = useState(false);

    const handleAchievements = (data) => {
        setLoading(false);
        if (data.error)
            return handleError("There are no achievements for this game")

        const achievedAchievements = data.filter(a => a.achieved);
        const lockedAchievements = data.filter(a => !a.achieved)
        const lockedVisible = data.filter(a => !a.achieved && !a.hidden)
        setAchievements({achieved: achievedAchievements, locked: {visible: lockedVisible, all: lockedAchievements}});
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
    });

    const showHiddenState = (e) => {
        setShowHidden(e.target.checked);
    }

    return (
        <div className={styles.container}>
            <Gamebar user={user}/>
            {loading ? <Loading/> :
                <div className={styles.content}>
                    {gameData && <GameData game={gameData} achievements={achievements}/>}
                    {!errorMessage && !achievements && <Loading/>}
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                    {Object.keys(achievements).length && (
                        <div>
                            <div>
                                <h1>Locked achievements</h1>
                                <label for="hiddenAchievements">Show hidden achievements: </label>
                                <input id="hiddenAchievements" type="checkbox" onChange={showHiddenState}/>
                            </div>
                            <div className={styles.achievementsContainer}>
                                {showHidden
                                    ? achievements.locked.all.map(a => {
                                        return (<Achievement key={a.name} a={a}/>)
                                    })
                                    : achievements.locked.visible.map(a => {
                                        return (<Achievement key={a.name} a={a}/>)
                                    })
                                }
                            </div>
                            <div>
                                <h1>Achieved achievements</h1>
                            </div>
                            <div className={styles.achievementsContainer}>
                                {achievements.achieved.map(a => {
                                    return (<Achievement key={a.name} a={a}/>)
                                })}
                            </div>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}