import {get} from "../../helpers/fetchHelper";

export default async function handler(req, res) {
    const { appid, user } = req.query;

    if (!appid)
        return res.status(400).json({data: null, error: "Required parameter 'appid' is missing"});

    const [game, gameError] =
        await get(`https://store.steampowered.com/api/appdetails?appids=${appid}`);

    if (!game[appid].success) return res.status(500).json({data: null, error: "There was an error fetching the game data"});
    if (gameError) return res.status(500).json({data: null, error: gameError});

    //TODO get playtime, filter appids not working atm
    if (user) {
        const [playtime, playtimeError] =
            await get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${user}&input_json={appids_filter: [ ${appid} ]}`);
        console.log(playtime);
        console.log(playtimeError);
    }

    res.status(200).json(game[appid].data);
}