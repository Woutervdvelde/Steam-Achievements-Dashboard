import Image from "next/image";
import Loading from "../loading";
import styles from "../../styles/components/game/info.module.css";

export default function GameInfo({game}) {

    if (Object.keys(game).length === 0) return (<div><Loading/></div>)
    else return (
        <div className={styles.container}>
            <div className={styles.item}>
                <div className={styles.banner}>
                    <Image src={game.header_image} width={230} height={107.5} alt={`header image for the game ${game.name}`}/>
                </div>
            </div>
            <div>
                <h1>{game.name}</h1>
                <p>{game.short_description}</p>
            </div>
        </div>
    )
}