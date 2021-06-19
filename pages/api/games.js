import {URL} from 'url';
import {get} from '../../helpers';

export default async function handler(req, res) {
    const url = new URL(req.headers.host + req.url);
    const user = url.searchParams.get('user');

    if (!user)
        return res.status(400).json({data: null, error: "Required parameter 'user' is missing"});

    const [games, gamesError] =
        await get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&include_appinfo=true&steamid=${user}`);
    if (gamesError) return res.status(500).json({data: null, error: gamesError});

    res.status(200).json(games);
}