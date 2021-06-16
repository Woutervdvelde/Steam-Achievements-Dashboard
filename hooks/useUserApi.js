import useSWR from "swr";
import fetch from "../libs/fetch";

export default function useUserApi() {
    return useSWR('/api/user', fetch)
}