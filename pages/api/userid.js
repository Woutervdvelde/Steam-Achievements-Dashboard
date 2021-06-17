import {URL} from 'url';
import {get} from '../../helpers';

export default async function handler(req, res) {
    const url = new URL(req.headers.host + req.url);
    const user = url.searchParams.get('user');

    if (!user)
        return res.status(400).json({data: null, error: "Required parameter 'user' is missing"});

    const [id, idError] =
        await get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY}&vanityurl=${user}`);
    if (idError) return res.status(500).json({data: null, error: idError});

    res.status(200).json(id);
}