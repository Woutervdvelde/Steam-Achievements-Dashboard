import useSWR from 'swr';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { parseCookies } from '../helpers';
import Login from '../components/login';
import Dashboard from '../components/dashboard';

IndexPage.getInitialProps = async ({req}) => {
    const cookies = parseCookies(req);

    return {props: {cookies: cookies}}
}

export default function IndexPage({props}) {
    const [cookies, setCookie, removeCookie] = useCookies();
    console.log(props.cookies)

    if (!cookies.user)
        return <Login/>
    else
        return <Dashboard/>
    
    // const fetcher = url => axios.get(url).then(res => res.data)
    // const { data, error } = useSWR('/api/achievements', fetcher)

    // if (error) return <div>error</div>
    // if (!data) return <div>loading...</div>
}