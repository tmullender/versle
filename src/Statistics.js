import './Statistics.css'

function Statistics(props) {
    const { played, distribution, currentStreak, longestStreak } = props.statistics;

    let total = 0, counts = 0, max = 0;
    distribution.forEach((count, index) => {
        total += count * (index + 1);
        counts += count;
        max = Math.max(max, count)
    });
    const average = counts > 0 ? total / counts : 0;
    const percentage = played > 0 ? distribution.reduce((total, count) => total + count) / played : 0;


    return (
        <div className={"Statistics"}>
            <div className={"numeric"}><span>Played</span><span>{ played }</span></div>
            <div className={"numeric"}><span>Completed</span><span>{ Math.round(percentage * 100) }%</span></div>
            <div className={"numeric"}><span>Current Streak</span><span>{ currentStreak }</span></div>
            <div className={"numeric"}><span>Longest Streak</span><span>{ longestStreak }</span></div>
            <div className={"distribution"}>
                {
                    distribution.map((count, index) =>
                        <div key={index} >
                            <span className={"label"}>{ index + 1 }</span>
                            <span className={"value"} style={{background: `linear-gradient(90deg, black 0% ${count * 100/max}%, white ${count * 100/max}% 100%)`}}>{ count }</span>
                        </div>
                    )
                }
            </div>
            <div><span>Average</span><span>{ average.toFixed(2) }</span></div>
        </div>
    )
}

export default Statistics;