import { useCookies } from "react-cookie";

export default function Dashboard() {
    const [cookies, setCookie, removeCookie] = useCookies();

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={() => {removeCookie('user')}}>Remove cookie</button>
        </div>
    )
}