import {Doughnut} from 'react-chartjs-2';
import styles from "../../styles/components/game/count.module.css";

export default function AchievementCount({value, total}) {
    const data = {
        datasets: [{
            data: [value ? value : 0, total? total - value : 100],
            backgroundColor: [
                'rgba(255,255,255,0.2)',
                'rgba(0,0,0,0.2)',
            ]
        }],
        options: {
            maintainAspectRatio: true,
            animation: false,
            legend: {
                display: false,
            },
            plugins: {
                tooltip: {
                    enabled: false,
                }
            }
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles.chartContainer}>
                <h4 className={styles.score}>
                    {value && total ? value + "/" + total : "N/A"}
                </h4>
                <Doughnut
                    data={data}
                    width={400}
                    height={200}
                    options={data.options}
                />
            </div>
            <h5>Achievements</h5>
        </div>
    )
}