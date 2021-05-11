import {useEffect } from "react";
import axios from "axios";

export default function useSteamAPI(params, page) {
    useEffect(async () => {
        const res = await fetch("https://api.github.com/users/hacktivist123");

        return () => {

        };
    }, [params, page]);

    return state;
}
