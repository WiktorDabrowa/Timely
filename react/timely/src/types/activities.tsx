import { Key } from "react"

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