import {URL} from 'url';
import {get} from '../../helpers';

export default async function handler(req, res) {
    const { user, appid } = req.query;

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

    const [globalAchievementsFetch, globalError] =
        await get(`https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?${process.env.STEAM_API_KEY}&gameid=${appid}`);
    if (globalError) return res.status(500).json({data: null, error: "globalAchievements | " + globalError});
    const globalAchievements = globalAchievementsFetch.achievementpercentages.achievements;

    const achievements = allAchievements.map(a => ({
        ...a,
        ...playerAchievements.find(a2 => a2.apiname === a.name),
        ...globalAchievements.find(a3 => a3.name === a.name)
    }));
    res.status(200).json(achievements);
}