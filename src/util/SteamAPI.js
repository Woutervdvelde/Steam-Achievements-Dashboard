import axios from "axios";
import Cookies from 'universal-cookie';

/**
 * This is a server doing a request to the steam api
 * Because react doesn't like to do CORS requests in the browser I use my own server
 * How to use:
 * You just add the entire url you would normally use to fetch the steam api
 * except you change the `&` to `%26` because this is the HTML hex value for &
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
            if (user_id.match(/[a-zA-Z]/gm)) {
                let vanity_id = await this.getUserId(user_id);
                if (!vanity_id)
                    resolve(false);
                this.user_id = vanity_id;
            } else
                this.user_id = user_id;

            let info = await this.getUserInfo(this.user_id);
            if (!info) {
                this.errors.user_id = "Invalid user ID";
                resolve(false);
            }

        })
    }

    getUserId(name) {
        //https://wiki.teamfortress.com/wiki/WebAPI/ResolveVanityURL#URL
        return new Promise(async resolve => {
            let url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${this.api_key}&vanityurl=${name}`;
            url = url.replace('&', '%26');

            let res = await axios.get(baseUrl + url);
            if (res.response.success !== 1) {
                resolve(false);
            }
        });
    }

    getUserInfo(id) {

    }
}