import {useRouter} from "next/router";

export default function Achievements() {
    const router = useRouter();
    const { appid } = router.query;

    return (
        <div>
            <h1>{appid}</h1>
        </div>
    )
}