import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {get} from "../helpers"
import styles from "../styles/dashboard.module.css";

export default function Dashboard(props) {
    console.log(props)
    const [cookies, setCookie, removeCookie] = useCookies();
    const [games, setGames] = useState(props.games);
    const [filteredGames, setFilteredGames] = useState(props.games);
    

    Dashboard.getInitialProps = async ({req}) => {
        console.log(req);
        return {props: {}}
    }

    const handleInput = async (e) => {
        let gamesFiltered = games.filter(g => {
            if (g.name.toLowerCase().startsWith(e.target.value.toLowerCase()))
                return g;
            return false;
        });
        setFilteredGames(gamesFiltered)
        console.log(gamesFiltered)
    }

    return (
        <div className={styles.container}>
            <h1>Dashboard</h1>
            {/* <h2>Welcome back {cookies.user.personaname}</h2> */}
            <input onChange={handleInput}/>
            {filteredGames !== undefined && (
                <div>
                    {filteredGames.map(game => {
                        return (<div> {game.name} </div>)
                    })}
                </div>
            )}
            <button onClick={() => {removeCookie('user')}}>Remove cookie</button>
        </div>
    )
}

// Dashboard.getInitialProps = async() => {
//     console.log("meow")
//     const [cookies, setCookie, removeCookie] = useCookies();
//     const [games, gamesError] = await get(`/api/games?user=${cookies.user.steamid}`)
//     console.log(games)
//     console.log(gamesError)
//     if (gamesError)
//         return alert(gamesError)

//     return {props: {games: games.response.games}}

// }