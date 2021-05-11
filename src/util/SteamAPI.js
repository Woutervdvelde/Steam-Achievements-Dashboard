import {Cookies} from "react-cookie";
import {useEffect, useState} from "react";
const axios = require('axios');


export class SteamAPI {

    user_id;
    api_key;
    errors = {
        user_id: '',
        api_key: ''
    }
    constructor(user_id, api_key) {
        this.checkApiKey(api_key);
        this.checkUserId(user_id);
    }

    checkUserId(user_id) {
        if (user_id.match(/[a-zA-Z]/gm)) {
            this.user_id = this.getUserId(user_id);
        } else {
            this.user_id = user_id;
        }
    }

    async checkApiKey(api_key) {
        //do fetch request to see if working
        try {
            // let res = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${api_key}&steamids=76561197960434622&format=JSON`, {
            const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.github.com/users/hacktivist123`, {
                crossDomain: true,
                mode: "cors",
                method: "GET",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type':'application/json'
                }
            });

            // let xhr = new XMLHttpRequest();
            // xhr.open('get', "https://woutervandervelde.com/public/index.php/reservation/get/11-05-2021");
            // xhr.send();

            // xhr.onload = () => {
            //     console.log(xhr.response);
            // }
        } catch (e) {
            console.error(e);
        }

        this.api_key = api_key;
    }

    getUserId(name) {
        //https://wiki.teamfortress.com/wiki/WebAPI/ResolveVanityURL#URL
        return 76561197960434622 //me
    }
}