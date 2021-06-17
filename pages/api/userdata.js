import {URL} from 'url';
import {get} from "../../helpers"

export default async function handler(req, res) {
    const url = new URL(req.headers.host + req.url);
    const user = url.searchParams.get('user');

    if (!user)
        return res.status(400).json({data: null, error: "Required parameter 'user' is missing"});

    const [userData, userError] =
        await get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${user}`);
    if (userError) return res.status(500).json({data: null, error: userError});

    res.status(200).json(userData);
}