import { get } from "../../helpers/fetchHelper";
import absoluteUrl from "next-absolute-url/index";

export default async function handler(req, res) {
    const { origin } = absoluteUrl(req)
    let { user } = req.query;

    if (!user)
        return res.status(400).json({data: null, error: "Required parameter 'user' is missing"});

    if (user.endsWith('/')) user = user.slice(0, -1);

    let urlMatch = /.*\.com\/id\/(?<id>.*)/gm.exec(user);
    if (urlMatch) {
        user = urlMatch.groups.id;
    }

    if (user.match(/[a-zA-Z]/gm)) {
        const [data, error] = await get(`${origin}/api/userid?user=${user}`);
        if (error || data.response.success !== 1)
            return res.status(500).json({data: null, error: "There was an error converting your url/name into a steam id"});

        user = data.response.steamid;
    }

    const [userData, userError] =
        await get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${user}`);
    if (userError) return res.status(500).json({data: null, error: userError});

    res.status(200).json(userData);
}