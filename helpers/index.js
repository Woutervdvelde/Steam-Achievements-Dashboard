import cookie from "cookie"

export const fetcher = url => fetch(url).then(r => r.json())

export function parseCookies(req) {
    return cookie.parse(req ? req.headers.cookie || "" : document.cookie)
}

export async function get(url) {
    try {
        const data = await fetch(url);
        if (data.status !== 200)
            throw data.statusText
        const response = await data.json();
        return [response, null]
    } catch (e) {
        return [null, e]
    }
}