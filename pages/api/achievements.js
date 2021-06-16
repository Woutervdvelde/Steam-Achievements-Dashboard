import {URL} from 'url';

export default async function handler(req, res) {
    const url = new URL(req.headers.host + req.url);
    const user = url.searchParams.get('user');
    const appid = url.searchParams.get('appid');

    if (!user)
        return res.status(400).json({data: null, error: "Required parameter 'user' is missing"});

    if (!appid)
        return res.status(400).json({data: null, error: "Required parameter 'appid' is missing"});

    const [allAchievementsFetch, allError] =
        await get(`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2?key=${process.env.STEAM_API_KEY}&steamid=${user}&appid=${appid}`);
    if (allError) return res.status(500).json({data: null, error: "allAchievements | " + allError});
    const allAchievements = allAchievementsFetch.game.availableGameStats.achievements;

    const [playerAchievementsFetch, playerError] =
        await get(`https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1?key=${process.env.STEAM_API_KEY}&steamid=${user}&appid=${appid}`);
    if (playerError) return res.status(500).json({data: null, error: "playerAchievements | " + playerError});
    const playerAchievements = playerAchievementsFetch.playerstats.achievements;

    const achievements = allAchievements.map(a => ({...a, ...playerAchievements.find(a2 => a2.apiname === a.name)}));
    res.status(200).json(achievements);
}

async function get(url) {
    try {
        const data = await fetch(url);
        if (data.status !== 200)
            throw data.statusText
        const response = await data.json();
        return [response, null]
    } catch (e) {
        return [null, e]
    }
}