import styles from "../styles/components/loading.module.css";
import Spinner from "./spinner";

export default function Loading() {
    return (
        <div className={styles.container}>
            <Spinner/>
        </div>
    )
}