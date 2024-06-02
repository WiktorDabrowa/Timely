import Activity from "./Activity";
const DAY_IN_MILISECONDS = 24*60*60*1000;


export default function Weekday({data, day, is_today})  {

    const days = {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        0: 'Sunday',
    };
    
    const hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]

    function calculateHeight(activity): string {
        const start = new Date(activity.activity.start_time).getTime();
        const end = new Date(activity.activity.end_time).getTime();
        const duration = end - start;
        const height = (duration/DAY_IN_MILISECONDS) * 100;
        return `${height}%`
    }
    
    function calculateAbsolutePosition(activity): string {
        const start = new Date(activity.activity.start_time).getTime();
        const top = ((start - day.getTime())/DAY_IN_MILISECONDS) * 100;
        return `${top}%`
    }
    
    function getActivityStyle(activity) {
        const top = calculateAbsolutePosition(activity);
        const height = calculateHeight(activity);
        const style = {
            top: top,
            height: height
        }
        return style
    }

    function getNowPointerStyles() {
        const now = new Date();
        const top = ((now.getTime() - day.getTime())/DAY_IN_MILISECONDS) * 100;
        return {top: `${top}%`}
    }

    const weekdayActivities = data.map((activity, i) => (
        <Activity
            key={i}
            activity={activity}
            style={getActivityStyle(activity)}/>
    ))

    const pointers = hours.map((hour) => {
        const top = hour/24 * 100 + '%';
        const is_main = hour % 3 === 0
        const classes = is_main ? "hour-pointer main" : "hour-pointer"
        return (
            <div className={classes} style={{top:top}} key={hour}>
                <span>{hour}:00</span>
            </div>
        )
    })

    return (
        <div className={is_today ? 'weekday today' : 'weekday'}>
            <div className='weekday-title'>
                <h3>{days[day.getDay()]}</h3>
                <small>{day.getDate()}/{day.getMonth()+1}/{day.getFullYear()}</small>
            </div>
            <div className='weekday-activities'>
                {pointers}
                {weekdayActivities}
                {is_today && <div style={getNowPointerStyles()} className="now-pointer"></div>}
            </div>
        </div>
    )
}