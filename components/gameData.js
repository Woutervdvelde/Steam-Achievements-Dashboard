import Loading from "./loading";
import styles from "../styles/components/gameData.module.css";
import GameInfo from "./game/gameInfo";
import TimePlayed from "./game/timePlayed";
import AchievementCount from "./game/achievementCount";

export default function GameData({game, achievements}) {
    console.log(game)
    if (!Object.keys(game).length) return <Loading/>
    if (game) return (
        <div className={styles.gameContainer}>
            <GameInfo game={game}/>
            <TimePlayed/>
            {achievements.length ?
                <AchievementCount
                    value={achievements.filter(a => a.achieved).length}
                    total={achievements.length}/> :
                <AchievementCount/>
            }
        </div>
    )
}