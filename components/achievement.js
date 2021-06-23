import Image from "next/image";
import styles from "../styles/components/achievement.module.css";

export default function Achievement({ a, key }) {
    return (
        <div key={key} className={styles.container}>
            <div className={styles.dataContainer}>
                <div className={styles.imageContainer}>
                    <Image src={a.icon} width={50} height={50} />
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