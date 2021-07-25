import {useRouter} from "next/router";
import {useState} from "react";
import {fetcher, get} from "../../helpers/fetchHelper";
import {checkUserCookies, parseCookies} from "../../helpers/cookieHelper";
import useSWR from "swr";
import Gamebar from "../../components/gamebar";
import Loading from "../../components/loading";
import Achievement from "../../components/achievement";
import GameData from "../../components/gameData";
import ErrorMessage from "../../components/errorMessage";
import styles from "../../styles/achievements.module.css";
import {deepEqual} from "next/dist/build/webpack/plugins/webpack-conformance-plugin/utils/utils";

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
    const [achievementsInterval, setAchievementsInterval] = useState(60000);
    const [errorMessage, setErrorMessage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [gameData, setGameData] = useState({});
    const [showHidden, setShowHidden] = useState(false);

    const SortBy = Object.freeze({
        "NAME": "displayName",
        "DATE": "unlocktime",
        "PERCENTAGE": "percent",
    });

    const handleAchievements = (data) => {
        setLoading(false);
        if (data.error) {
            setAchievementsInterval(0);
            return handleError(data.error)
        }

        const achieved = data.filter(a => a.achieved);
        const locked = data.filter(a => !a.achieved);
        setAchievements({
            achieved: achieved,
            locked: locked
        });
    }

    const compareAchievements = (a, b) => {
        console.log("compare")
        if (!deepEqual(a, b)) {
            handleAchievements(b)
            if (!a) return;

            b.forEach(b => {
                const ac = a.find(a => a.name === b.name);
                if (ac.achieved !== b.achieved) {
                    console.log(`New achievement unlocked! ${ac.name}`);
                }
            });
        }
    }

    const handleError = (data) => {
        setLoading(false);
        setErrorMessage(data);
    }

    const handleGameData = (data) => {
        if (!data.hasOwnProperty('achievements')) {
            setAchievementsInterval(0);
            setErrorMessage("There are no achievements for this game");
        }

        if (data.error)
            setGameData({error: "No game data foun"});
        else
            setGameData(data);
    }

    const handleGameError = (data) => {
        console.log(data);
    }

    const {g, gError} = useSWR(`/api/game?appid=${appid}`, fetcher, {
        revalidateOnFocus: false,
        errorRetryCount: 2,
        onSuccess: handleGameData,
        onError: handleGameError
    })

    const {a, aError} = useSWR(`/api/achievements?user=${user.steamid}&appid=${appid}`, fetcher, {
        refreshInterval: achievementsInterval,
        revalidateOnFocus: false,
        errorRetryCount: 2,
        onError: handleError,
        compare: compareAchievements
    });

    const showHiddenState = (e) => {
        setShowHidden(e.target.checked);
    }

    const sortAchievements = async (a, sort) => {
        const sorted = a.sort((a, b) => {
            if (a[sort] < b[sort]) return -1;
            if (a[sort] > b[sort]) return 1;
            return 0
        });

        if (JSON.stringify(a) === JSON.stringify(achievements.achieved))
            setAchievements({achieved: sorted, locked: [...achievements.locked]});
        else
            setAchievements({achieved: [...achievements.achieved], locked: sorted});
    }

    return (
        <div className={styles.container}>
            <Gamebar user={user}/>
            <div className={styles.placeholder}></div>
            {loading ? <Loading/> :
                <div className={styles.content}>
                    {gameData && <GameData game={gameData} achievements={achievements}/>}
                    {!errorMessage && !achievements && <Loading/>}
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                    {Object.keys(achievements).length && (
                        <div>
                            <div className={styles.divider}></div>
                            <div className={styles.achievementsHeaderContainer}>
                                <h1 className={styles.achievementsHeader}>Locked achievements</h1>
                                <div className={styles.options}>
                                    <div className={styles.selection}>
                                        <select onChange={e => sortAchievements(achievements.locked, e.target.value)}>
                                            <option value={SortBy.NAME}>Name</option>
                                            <option value={SortBy.PERCENTAGE}>Percentage</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="hiddenAchievements">Show hidden achievements: </label>
                                        <input id="hiddenAchievements" type="checkbox" onChange={showHiddenState}/>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.achievementsContainer}>
                                {showHidden
                                    ? achievements.locked.map(a => {
                                        return (<Achievement key={a.name} a={a}/>)
                                    })
                                    : achievements.locked.filter(a => !a.hidden).map(a => {
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