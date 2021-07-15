import {get} from "../../helpers/fetchHelper";

const sortGames = (games) => {
    return games.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (aName < bName) return -1;
        if (aName > bName) return 1;
        return 0
    });
}

export default async function handler(req, res) {
    const { user, filter } = req.query;

    if (!user)
        return res.status(400).json({data: null, error: "Required parameter 'user' is missing"});

    const [games, gamesError] =
        await get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${user}&include_appinfo=true&&include_played_free_games=true`);
    if (gamesError) return res.status(500).json({data: null, error: gamesError});

    const sortedGames = sortGames(games.response.games);

    res.status(200).json(sortedGames);
}