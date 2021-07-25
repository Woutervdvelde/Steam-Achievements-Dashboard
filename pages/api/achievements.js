import {get} from "../../helpers/fetchHelper";

export default async function handler(req, res) {
    const { user, appid } = req.query;

    if (!user)
        return res.status(400).json({data: null, error: "Required parameter 'user' is missing"});

    if (!appid)
        return res.status(400).json({data: null, error: "Required parameter 'appid' is missing"});

    //TESTING ACHIEVEMENT CHANGES
    if (appid === "test")
        return res.status(200).json([
            {
                "name": "tutorial.steamworksFTUX",
                "defaultvalue": 0,
                "displayName": "Driver's License",
                "hidden": 0,
                "description": "Complete the tutorial.",
                "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/1127500/a83da6eb79d9c8c16c9dfdfb848518f022234664.jpg",
                "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/1127500/1d50107ea2b8cb1dedc838f0421bd0710568fe7b.jpg",
                "apiname": "tutorial.steamworksFTUX",
                "achieved": 1,
                "unlocktime": 1626808778,
                "percent": 98.5
            },
            {
                "name": "losangeles_score200",
                "defaultvalue": 0,
                "displayName": "Los Angeles Tourist",
                "hidden": 0,
                "description": "Complete 200 trips in Los Angeles.",
                "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/1127500/296ded288697502c0514f2eedc5fa9ed0ffeef40.jpg",
                "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/1127500/9032ace77387c5f418cdd7e4efd06c9d0ccc0fc4.jpg",
                "apiname": "losangeles_score200",
                "achieved": 1,
                "unlocktime": 1626809194,
                "percent": 86.5999984741211
            },
            {
                "name": "beijing_score200",
                "defaultvalue": 0,
                "displayName": "Beijing Tourist",
                "hidden": 0,
                "description": "Complete 200 trips in Beijing.",
                "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/1127500/296ded288697502c0514f2eedc5fa9ed0ffeef40.jpg",
                "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/1127500/9032ace77387c5f418cdd7e4efd06c9d0ccc0fc4.jpg",
                "apiname": "beijing_score200",
                "achieved": 1,
                "unlocktime": 1626871754,
                "percent": 62.900001525878906
            }
        ])

    const [allAchievementsFetch, allError] =
        await get(`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2?key=${process.env.STEAM_API_KEY}&steamid=${user}&appid=${appid}`);
    if (allError) return res.status(500).json({data: null, error: "allAchievements | " + allError});
    if (Object.keys(allAchievementsFetch.game).length === 0) return res.status(409).json({data: null, error: "No achievements present for this game"});
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