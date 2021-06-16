import useSWR from 'swr';
import axios from 'axios';
import { parseCookies } from '../helpers';

IndexPage.getInitialProps = async ({req}) => {
    const data = parseCookies(req);
    console.log(data);
    return {props: {}}
}

export default function IndexPage() {
    const fetcher = url => axios.get(url).then(res => res.data)
    const { data, error } = useSWR('/api/achievements', fetcher)

    if (error) return <div>error</div>
    if (!data) return <div>loading...</div>

    return (
        <div>
            meow
        </div>
    )
}