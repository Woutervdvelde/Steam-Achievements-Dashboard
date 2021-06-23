import { useRouter } from "next/router";
import Image from "next/image";
import Navbar from "../../components/navbar/navbar";
import { get } from "../../helpers";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import styles from "../../styles/achievements.module.css";
import Achievement from "../../components/achievement";
import useSWR from "swr";
import Timeline from "../../components/timeline";

export default function achievements() {
    const router = useRouter();
    const [cookies, setCookie] = useCookies();
    const [gameData, setGameData] = useState([]);
    const [missedAchievements, setMissedAchievements] = useState([]);
    const [achievedAchievements, setAchievedAchievements] = useState([]);
    const { appid } = router.query;

    const SortBy = Object.freeze({
        "NAME": "displayName",
        "DATE": "unlocktime",
        "PERCENTAGE": "percent",
    });

    const getSortedAchievements = async (achievements, sort) => {
        if (achievements.length === missedAchievements.length) {
            const sorted = [...missedAchievements].sort((a, b) => {
                if (a[sort] < b[sort]) return -1;
                if (a[sort] > b[sort]) return 1;
                return 0
            });
            setMissedAchievements(sorted)
        } else {
            const sorted = [...achievedAchievements].sort((a, b) => {
                if (a[sort] < b[sort]) return -1;
                if (a[sort] > b[sort]) return 1;
                return 0
            });
            setAchievedAchievements(sorted)
        }
    }

    const getGameData = async () => {
        if (!appid) return
        const [fetchedGameData, error] = await get(`/api/game?appid=${appid}`)
        if (error)
            return console.error(error)

        if (fetchedGameData.length !== gameData.length)
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
        getGameData()
        getAchievements()
    })

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.content}>
                {gameData.achievements && (
                    <div>
                        <h1>{gameData.name}</h1>
                        <h2>{achievedAchievements.length}/{gameData.achievements.total} achievements</h2>
                    </div>
                )}
                {/*<Timeline achievements={achievedAchievements}/>*/}
                <div>
                    <h2>Not achieved Achievements</h2>
                    <select onChange={e => getSortedAchievements(missedAchievements, e.target.value)}>
                        <option value={SortBy.NAME}>Name</option>
                        <option value={SortBy.DATE}>Date</option>
                        <option value={SortBy.PERCENTAGE}>Percentage</option>
                    </select>
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