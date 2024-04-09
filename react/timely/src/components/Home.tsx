import { useState, useEffect} from "react";
import { makeRequest } from "./utils";


export default function Home() {
    const [data, setData] = useState({
        username: '',
        activities: [],
        organizes: [],
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () => {
            const response = await makeRequest({
                method: 'GET',
                url: 'api/users/me'
            }, setIsLoading)
            console.log(response)
            if (response.status === 'ok') {
                setData(response.data)
            }
        }
        fetchData();
    }, [])
    
    const activities = data.activities.map(act => 
        <div key={act.id}>{act.activity.name}</div>
    )

    return (
        <>
        <div>{data.username}</div>
        {activities}
        {isLoading && <div className="loading"><div className='loader'/></div>}
        </>
    )
}