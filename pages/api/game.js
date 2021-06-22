import {URL} from 'url';
import {get} from '../../helpers';

export default async function handler(req, res) {
    const url = new URL(req.headers.host + req.url);
    const appid = url.searchParams.get('appid');

    if (!appid)
        return res.status(400).json({data: null, error: "Required parameter 'appid' is missing"});

    const [game, gameError] =
        await get(`https://store.steampowered.com/api/appdetails?appids=${appid}`);
    if (gameError) return res.status(500).json({data: null, error: gameError});

    res.status(200).json(game[appid].data);
}