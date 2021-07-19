import Loading from "./loading";
import styles from "../styles/components/gameData.module.css";
import GameInfo from "./game/gameInfo";
import TimePlayed from "./game/timePlayed";
import AchievementCount from "./game/achievementCount";

export default function GameData({game}) {
    if (!game) return <Loading/>
    if (game) return (
        <div className={styles.gameContainer}>
            <GameInfo game={game}/>
            <TimePlayed/>
            <AchievementCount value={15} total={20}/>
        </div>
    )
}