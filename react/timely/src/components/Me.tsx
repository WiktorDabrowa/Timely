import { useState, useEffect, Key } from "react";
import { makeRequest } from "./utils";
import { useOutletContext } from "react-router-dom";
import Calendar from "./Calendar";
import MeBar from "./MeBar";

export type Activity = {
    id: Number,
    created: string,
    end_time: string,
    is_private: boolean,
    name: string,
    organizer: Number,
    start_time: string
}

export type UserActivity = {
    id: Key,
    is_visible: boolean,
    activity: Activity
}

export type Data = {
    username: string,
    activities: Array<UserActivity>,
    organizes: Array<Number>
}

export default function Me() {

    const setIsLoading: Function = useOutletContext();
    console.log(setIsLoading)
    const [data, setData] = useState({
        username: '',
        activities: [],
        organizes: [],
    })

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

    // console.log(data)

    return(
        <div className='me-container'>
            <MeBar data={data}/>
            <Calendar data={data}/>
        </div>
    )
}