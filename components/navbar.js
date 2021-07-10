import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { useState } from "react";
import { fetcher } from "../helpers/fetchHelper";
import styles from "../styles/components/navbar.module.css";

export default function Navbar(props) {
    const [filteredGames, setFilteredGames] = useState([]);
    const [games, setGames] = useState([]);

    const onDataReceive = (data) => {
        setGames(data)
        setFilteredGames(data)
    }
    const { data, error } = useSWR(`/api/games?user=${props.user.steamid}`, fetcher, {onSuccess: onDataReceive})

    const filterGames = (games, filter) => {
        let gamesFiltered
        if (filter !== null || filter !== '') {
            gamesFiltered = games.filter(g => {
                if (g.name.toLowerCase().startsWith(filter))
                    return g;
                return false;
            });
        } else
            gamesFiltered = games;

        setFilteredGames(gamesFiltered)
    }

    const handleInput = async (e) => {
        filterGames(games, e.target.value.toLowerCase())
    }

    return (
        <div className={styles.container}>
            <div className={styles.userData}>
                <Image className={styles.userImage} src={props.user.avatarfull} width={50} height={50}/>
                <h3 className={styles.userText}>{props.user.personaname}</h3>
            </div>
            <div className={styles.dashboard}>
                <Link href="/dashboard">
                    <h3>Dashboard</h3>
                </Link>
            </div>
            <input onChange={handleInput} className={styles.input}/>
            <div>
                {filteredGames.map(({appid, name, img_icon_url}) => {
                    return (<Link href={`/achievements/${appid}`} key={appid}>
                        <div className={styles.gameItem}>
                            <div className={styles.gameItemImage}>
                                <Image width={20} height={20}
                                       src={`http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${img_icon_url}.jpg`}/>
                            </div>
                            {/*TODO make text overflow and overlayed when hovered (just like steam library)*/}
                            <p className={styles.gameItemText}>{name}</p>
                        </div>
                    </Link>)
                })}
            </div>
        </div>
    )
}