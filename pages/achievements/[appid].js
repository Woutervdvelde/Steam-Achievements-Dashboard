import { useRouter } from "next/router";
import Image from "next/image";
import Navbar from "../../components/navbar/navbar";
import { get } from "../../helpers";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import styles from "../../styles/achievements.module.css";
import Achievement from "../../components/achievement";
import useSWR from "swr";

export default function achievements() {
    const router = useRouter();
    const [cookies, setCookie] = useCookies();
    // const [gameData, setGameData] = useState({});
    const [missedAchievements, setMissedAchievements] = useState([]);
    const [achievedAchievements, setAchievedAchievements] = useState([]);
    const { appid } = router.query;

    const SortyBy = Object.freeze({
        "NAME": 1,
        "DATE": 2,
        "PERCENTAGE": 3,
    });

    const [gameData, gameDataError] = useSWR(`/api/game?appid=${appid}`)

    const getGameData = async () => {
        if (!appid) return
        const [fetchedGameData, error] = await get(`/api/game?appid=${appid}`)
        if (error)
            return console.error(error)

        if (!gameData)
            setGameData(fetchedGameData)
    }

    const getAchievements = async () => {
        if (!cookies.user.steamid || !appid) return

        const [userAchievements, error] = await get(`/api/achievements?user=${cookies.user.steamid}&appid=${appid}`)
        if (error)
            return console.error(error)

        const missed = userAchievements.filter(a => a.achieved === 0)
        const achieved = userAchievements.filter(a => a.achieved === 1)

        if (missed.length !== missedAchievements.length)
            setMissedAchievements(missed)

        if (achieved.length !== achievedAchievements.length)
            setAchievedAchievements(achieved)
    }

    useEffect(() => {
        // getGameData()
        getAchievements()
    })

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.content}>
                {gameData && (
                    <div>
                        <h1>{gameData.name}</h1>
                        <h2>{achievedAchievements.length}/{gameData.achievements.total} achievements</h2>
                    </div>
                )}
                <div>
                    <h2>Not achieved Achievements</h2>
                    <div className={styles.achievementsContainer}>
                        {missedAchievements.map(a => {
                            return (
                                <Achievement key={a.appid} a={a} />
                            )
                        })}
                    </div>
                </div>
                <div>
                    <h2>Achieved Achievements</h2>
                    <div className={styles.achievementsContainer}>
                        {achievedAchievements.map(a => {
                            return (
                                <Achievement key={a.appid} a={a} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}