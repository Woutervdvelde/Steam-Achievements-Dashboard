import {useEffect, useLayoutEffect} from "react";
import {Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement} from "chart.js";

export default function Timeline({achievements}) {

    useLayoutEffect(() => {
        // if (typeof window !== 'object' && !achievements) return
        console.log(achievements.map(a => new Date(a.unlocktime * 1000).toLocaleDateString()));

        Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement)
        const ctx = document.getElementById('timelineChart')
        new Chart(ctx, {
            type: "line",
            data: {
                labels: achievements.map(a => new Date(a.unlocktime * 1000).toLocaleDateString()),
                datasets: [{
                    label: '# achieved',
                    data: achievements.map(a => new Date(a.unlocktime * 1000).toLocaleDateString())
                }]
            }
        })
    }, [])


    return (
        <div>
            <canvas id="timelineChart"/>
        </div>
    )
}