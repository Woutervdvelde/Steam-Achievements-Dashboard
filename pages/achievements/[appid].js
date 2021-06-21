import {useRouter} from "next/router";
import Image from "next/image";
import Navbar from "../../components/navbar/navbar";
import {get} from "../../helpers";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import styles from "../../styles/achievements.module.css";
import Achievement from "../../components/achievement";

export default function achievements() {
    const router = useRouter();
    const [cookies, setCookie] = useCookies();
    const [missedAchievements, setMissedAchievements] = useState([]);
    const [achievedAchievements, setAchievedAchievements] = useState([]);
    const {appid} = router.query;

    const SortyBy = Object.freeze({
        "NAME": 1,
        "DATE": 2,
        "PERCENTAGE": 3,
    });


    const getAchievements = async () => {
        if (!cookies.user.steamid || !appid) return

        const [userAchievements, error] = await get(`/api/achievements?user=${cookies.user.steamid}&appid=${appid}`)
        if (error)
            return console.error(error)

        const missed = userAchievements.filter(a => a.achieved === 0)
        const achieved = userAchievements.filter(a => a.achieved === 1)

        if (missed.length !== missedAchievements.length)
            setMissedAchievements(missed);

        if (achieved.length !== achievedAchievements.length)
            setAchievedAchievements(achieved);

        console.log(missed)
        console.log(achieved)
    }

    useEffect(() => {
        getAchievements();
    })

    return (
        <div className={styles.container}>
            <Navbar/>
            <div className={styles.content}>
                <h1>{appid}</h1>
                <div>
                    <h2>Not achieved Achievements</h2>
                    <div className={styles.achievementsContainer}>
                        {missedAchievements.map(a => {
                            return (
                                <Achievement key={a.appid} a={a}/>
                            )
                        })}
                    </div>
                </div>
                <div>
                    <h2>Achieved Achievements</h2>
                    <div className={styles.achievementsContainer}>
                        {achievedAchievements.map(a => {
                            return (
                                <Achievement key={a.appid} a={a}/>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}