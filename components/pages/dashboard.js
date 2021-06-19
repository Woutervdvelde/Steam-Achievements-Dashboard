import { useState } from "react";
import { useCookies } from "react-cookie";
import {get} from "../../helpers"
import styles from "../../styles/dashboard.module.css";

export default function Dashboard() {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [games, setGames] = useState({});
    const [filteredGames, setFilteredGames] = useState({});
    
    const getUserGames = async () => {
        const [games, gamesError] = await get(`/api/games?user=${cookies.user.steamid}`)
        if (gamesError)
            return alert(gamesError)

        setGames(games.response.games)
    }

    getUserGames()

    const handleInput = async (e) => {
        let gamesMapped = games.filter(g => {
            if (g.name.toLowerCase().startsWith(e.target.value.toLowerCase()))
                return g;
            return false;
        });
        console.log(gamesMapped)
    }

    return (
        <div className={styles.container}>
            <h1>Dashboard</h1>
            <h2>Welcome back {cookies.user.personaname}</h2>
            <input onChange={handleInput}/>
            <button onClick={() => {removeCookie('user')}}>Remove cookie</button>
        </div>
    )
}