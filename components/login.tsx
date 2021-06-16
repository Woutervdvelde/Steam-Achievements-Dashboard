import { useCookies } from "react-cookie";

export default function Login() {
    const [cookies, setCookie, removeCookie] = useCookies();

    return (
        <div>
            <h1>login</h1>
            <button onClick={() => {setCookie('user', "meow");}}>Set cookie</button>
        </div>
    )
}