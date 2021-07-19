import Loading from "./loading";
import styles from "../styles/components/gameData.module.css";
import GameInfo from "./game/gameInfo";
import TimePlayed from "./game/timePlayed";
import AchievementCount from "./game/achievementCount";

export default function GameData({game, achievements}) {
    console.log(achievements)
    if (!Object.keys(game).length) return <Loading/>
    if (game) return (
        <div className={styles.gameContainer}>
            <GameInfo game={game}/>
            <TimePlayed/>
            {Object.keys(achievements).length ?
                <AchievementCount
                    value={achievements.achieved.length}
                    total={achievements.achieved.length + achievements.locked.all.length}/> :
                <AchievementCount/>
            }
        </div>
    )
}