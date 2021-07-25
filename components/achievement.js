import Image from "next/image";
import styles from "../styles/components/achievement.module.css";

export default function Achievement({ a }) {
    return (
        <div className={styles.container}>
            <div className={styles.dataContainer}>
                <div className={styles.imageContainer}>
                    <img src={a.icon} width={50} height={50} alt={`Steam achievement: ${a.name}`}/>
                </div>
                <div className={styles.textContainer}>
                    <h3 className={styles.name}>{a.displayName}</h3>
                    <h5 className={styles.description}>{a.description}</h5>
                </div>
            </div>
            {a.achieved === 1 && (
                <p className={styles.percentage}>Achieved on: {new Date(a.unlocktime * 1000).toLocaleDateString()}</p>
            )}
            <p className={styles.percentage}>
                {Math.round((a.percent + Number.EPSILON) * 100) / 100}% of players have this achievement
            </p>
        </div>
    )
}