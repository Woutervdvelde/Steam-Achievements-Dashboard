import styles from "../../styles/components/game/time.module.css";

export default function TimePlayed() {
    return (
        <div className={styles.container}>
            <div className={styles.time}>
                <h1>15h</h1>
                <h5>on record</h5>
            </div>
        </div>
    )
}