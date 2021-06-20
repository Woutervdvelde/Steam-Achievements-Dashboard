import { useRouter } from "next/router";
import Navbar from "../../components/navbar/navbar";

export default function achievements() {
    const router = useRouter()
    const {appid} = router.query;

    return (
        <div>
            <Navbar/>
            <h1>{appid}</h1>
        </div>
    )
}