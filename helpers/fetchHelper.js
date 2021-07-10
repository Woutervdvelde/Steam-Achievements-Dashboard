export const fetcher = url => fetch(url).then(r => r.json())

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