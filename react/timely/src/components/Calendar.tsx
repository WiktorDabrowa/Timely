import { Data } from './Me';

export default function Calendar({data}: {data: Data}) {

    const activities = data.activities.map(act => 
        <div key={act.id}>{act.activity.name}</div>
    )

    return (
        <>
        {activities}
        </>
    )
}