import { useState, useEffect} from "react";
import { makeRequest } from "./utils";
import { useOutletContext } from "react-router-dom";
import Calendar from "./calendar/Calendar";
import MeBar from "./MeBar";

export default function Me() {

    const setIsLoading: Function = useOutletContext();
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
            if (response.status === 'ok') {
                setData(response.data)
            }
        }
        fetchData();
    }, []);
    return(
        <div className='me-container'>
            <MeBar data={data}/>
            <Calendar data={data}/>
        </div>
    )
}