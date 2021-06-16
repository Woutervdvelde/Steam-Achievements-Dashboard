import useSWR from 'swr';
import axios from 'axios';
import { parseCookies } from '../helpers';

IndexPage.getInitialProps = async ({req}) => {
    const cookies = parseCookies(req);
    return {props: {cookies: cookies}}
}

export default function IndexPage({props}) {
    const fetcher = url => axios.get(url).then(res => res.data)
    const { data, error } = useSWR('/api/achievements', fetcher)

    console.log(props);

    if (error) return <div>error</div>
    if (!data) return <div>loading...</div>

    return (
        <div>
            meow
        </div>
    )
}