import { useRouter } from "next/router";
import Navbar from "../../components/navbar/navbar";
import {get} from "../../helpers";
import {useCookies} from "react-cookie";
import {useEffect} from "react";

export default function achievements() {
    const router = useRouter()
    const [cookies, setCookie] = useCookies();
    const { appid } = router.query;

    const getAchievements = async () => {
        if (!cookies.user.steamid || !appid) return

        const [userAchievements, error] = await get(`/api/achievements?user=${cookies.user.steamid}&appid=${appid}`);
        console.log(userAchievements);
    }

    useEffect(() => {
        getAchievements();
    })

    return (
        <div>
            <Navbar/>
            <h1>{appid}</h1>
        </div>
    )
}