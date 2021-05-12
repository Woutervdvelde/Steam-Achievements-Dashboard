import axios from "axios";
import Cookies from 'universal-cookie';

/**
 * This is a server doing a request to the steam api
 * Because react doesn't like to do CORS requests in the browser I use my own server
 * How to use:
 * You just add the entire url you would normally use to fetch the steam api
 * except you change the `&` to `%26` because this is the HTML hex value for &
 *
 * Response of the server:
 * {
 *     status: [status code] INT
 *     error: [error message] STRING
 *     response: [response from the steam api] JSON object
 * }
 */
const baseUrl = "https://woutervandervelde.com/public/index.php/api/steam?url=";
const cookies = new Cookies();

export class SteamAPI {

    user_id;
    api_key;
    errors = {
        user_id: '',
        api_key: ''
    }

    constructor() {
        if (cookies.get('api_key') !== undefined && cookies.get('user_id') !== undefined) {

        }
    }

    async checkApiKey(api_key) {
        return new Promise(async resolve => {
            try {
                //trying to fetch a user profile to test the given api key
                let url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${api_key}&steamids=76561197960434622&format=JSON`;
                url = url.replace('&', '%26');

                let res = await axios.get(baseUrl + url);
                switch (res.data.status) {
                    case 403:
                        this.errors.api_key = "API key invalid";
                        resolve(false);
                        break;
                    case 500:
                        this.errors.api_key = "Unknown API key error, try again";
                        resolve(false);
                        break;
                    case 200:
                        this.api_key = api_key;
                        resolve(true);
                        break;
                    default:
                        this.errors.api_key = "Unknown API key error, try again";
                        resolve(false);
                        break;
                }
            } catch (e) {
                this.errors.api_key = "Unknown API key error, try again";
            }
        })
    }

    async checkUserId(user_id) {
        return new Promise(async resolve => {
            if (user_id.endsWith('/')) user_id = user_id.slice(0, -1);
            let urlMatch = /.*\.com\/id\/(?<id>.*)/gm.exec(user_id);
            console.log(urlMatch);
            if (urlMatch) {
                user_id = urlMatch.groups.id;
            }

            if (user_id.match(/[a-zA-Z]/gm)) {
                let vanity_id = await this.getUserId(user_id);
                console.log(vanity_id);
                if (!vanity_id)
                    resolve(false);
                this.user_id = vanity_id;
            } else
                this.user_id = user_id;

            let info = await this.getUserInfo(this.user_id);
            if (!info) {
                this.errors.user_id = "Invalid user ID or url";
                resolve(false);
            }
            //TODO also save info (avatar, name etc)
            resolve(this.user_id);
        })
    }

    getUserId(name) {
        //https://wiki.teamfortress.com/wiki/WebAPI/ResolveVanityURL#URL
        return new Promise(async resolve => {
            let url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${this.api_key}&vanityurl=${name}`;
            url = url.replace('&', '%26');

            let res = await axios.get(baseUrl + url);
            console.log(res);
            if (res.data.response.success !== 1) {
                resolve(false);
            }
            resolve(res.data.response.steamid);
        });
    }

    getUserInfo(id) {
        return new Promise(async resolve => {
            let url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.api_key}&steamids=${id}`;
            url = url.replace('&', '%26');

            let res = await axios.get(baseUrl + url);
            if (res.data.status !== 200)
                resolve(false);
            resolve(true);
        })
    }
}