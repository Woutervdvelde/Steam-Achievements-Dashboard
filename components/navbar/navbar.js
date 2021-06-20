import Image from "next/image";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import Link from "next/link";
import {get} from "../../helpers";
import styles from "../../styles/components/navbar.module.css";
import LogoutIcon from "../logout";

export default function Navbar() {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);

    const getUserGames = async () => {
        const [fetchedGames, gamesError] = await get(`/api/games?user=${cookies.user.steamid}`)
        if (gamesError)
            return console.error(gamesError)

        if (fetchedGames.response.games.length !== games.length) {
            setGames(fetchedGames.response.games)
            filterGames(fetchedGames.response.games, '');
        }
    }

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

        let sortedGames = sortGames(gamesFiltered);
        setFilteredGames(sortedGames)
    }

    const sortGames = (games) => {
        return games.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();

            if (aName < bName) return -1;
            if (aName > bName) return 1;
            return 0
        });
    }

    const handleInput = async (e) => {
        filterGames(games, e.target.value.toLowerCase())
    }

    useEffect(() => {
        getUserGames()
    })

    return (
        <div className={styles.container}>
            <div className={styles.userData}>
                <Image className={styles.userImage} src={cookies.user.avatarfull} width={50} height={50}/>
                <h3 className={styles.userText}>{cookies.user.personaname}</h3>
                <LogoutIcon/>
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