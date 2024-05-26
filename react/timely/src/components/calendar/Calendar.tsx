import { Data, UserActivity } from '../../types/activities';
import Weekday from './Weekday';
import { useState } from 'react';

const WEEK_IN_MILISECONDS = 24 * 60 * 60 * 7 * 1000
const DAY_IN_MILISECONDS = WEEK_IN_MILISECONDS/7;


export default function Calendar({data}: {data: Data}) {
    
    const [thisMonday, setThisMonday] = useState(getClosestPreviousMonday());
    const today = new Date();
    today.setHours(0,0,0);

    let tasksForThisWeek = getTasksForThisWeek(thisMonday);
    const tasksOverflowwingWeekday = getTasksOverflowingWeekday(tasksForThisWeek);
    tasksForThisWeek = addOverflowingTasks(tasksForThisWeek, tasksOverflowwingWeekday);
    
    const newMonday = new Date();
    newMonday.setTime(thisMonday.getTime() + WEEK_IN_MILISECONDS);

    function getClosestPreviousMonday() {
        // Returns date of the closest previous monday
        let prevMonday = new Date()
        prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
        prevMonday.setHours(0,0,0);
        return prevMonday;
    }

    function getTasksForThisWeek(mondayDate) {
        // Returns all activities from the week which starts on a given monday's date
        const nextMonday = new Date()
        nextMonday.setTime(mondayDate.getTime() + WEEK_IN_MILISECONDS);
        let thisWeekTasks = data.activities.filter((activity) => {
            const activityStartDate = new Date(activity.activity.start_time)
            if (mondayDate <= activityStartDate && activityStartDate <= nextMonday) {
                return activity
            }
        });
        return sortActivitiesByDay(thisWeekTasks); 
    }

    function sortActivitiesByDay(activities: Array<UserActivity>) {
        let activitiesByDay = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
        };
        activities.forEach(activity => {
            const activityDay = new Date(activity.activity.start_time).getDay();
            activitiesByDay[activityDay].push(activity)
        });
        return activitiesByDay;
    }

    function changeWeek(mode:string) {
        const newMonday = new Date()
        if ( mode === 'next') {
            newMonday.setTime(thisMonday.getTime() + WEEK_IN_MILISECONDS)
        } else {
            newMonday.setTime(thisMonday.getTime() - WEEK_IN_MILISECONDS)
        }
        setThisMonday(newMonday)
    }

    function getTasksOverflowingWeekday(tasks) {
        let tasksOverflowingWeekday = []
        for (let i = 1; i<=7; i++) {
            const activities = tasks[i];
            activities.forEach((activity) => {
                const startDay = new Date(activity.activity.start_time).getDate();
                const endDay = new Date(activity.activity.end_time).getDate();
                startDay !== endDay && tasksOverflowingWeekday.push(activity);
            })
        }
        return tasksOverflowingWeekday;
    }

    function addOverflowingTasks(weekActivities, overflowingActivities) {
        overflowingActivities.forEach((activity) => {
            const startTime = new Date(activity.activity.start_time);
            const endTime = new Date(activity.activity.end_time);
            const duration = endTime.getTime() - startTime.getTime();
            const durationInDays = duration/DAY_IN_MILISECONDS;
            let numberOfDaysInSpan = Math.floor(durationInDays);
            const modulo = (durationInDays - numberOfDaysInSpan);
            moduloOverflowsDay(startTime, modulo) && numberOfDaysInSpan ++;
            numberOfDaysInSpan > 7 && (numberOfDaysInSpan = 7);
            const activityStartDay = startTime.getDay();
            for (let i = activityStartDay; i <= activityStartDay+numberOfDaysInSpan; i++) {
                weekActivities[i].push(activity);
            }
        });

        return weekActivities
    }

    function moduloOverflowsDay(startTime, modulo) {
        const date = new Date();
        date.setTime(startTime.getTime() + modulo*24*60*60*1000);
        const truthy = date.getDate() !== startTime.getDate() ? true : false
        return truthy
    }

    function areTheSameDay(date1: Date, date2: Date): boolean {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        )
    }

    const weekdays = Object.keys(tasksForThisWeek).map((item, i) => {
        const date = new Date();
        date.setTime(thisMonday.getTime() + i*DAY_IN_MILISECONDS)
        const is_today =  areTheSameDay(today, date)
        return (
            <Weekday 
                key={i}
                data={tasksForThisWeek[item]}
                day={date}
                is_today={is_today}/>
        )
    })

    function getDateStringRepr(date) {
        const repr = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        return repr
    }

    function toggleCalendarVisibility() {
        const calendar = document.querySelector('.calendar');
        calendar.classList.toggle('big')
    }
    
    return (
        <div className='calendar-container'>
            <div className='calendar-nav'>
                <button onClick={() => changeWeek('prev')}> Previous week </button>
                <button onClick={() => changeWeek('next')}> Next week </button>
                <button onClick={toggleCalendarVisibility}>Toggle Size</button>
            </div>
            <div className='calendar'>
                {weekdays}
            </div>
        </div>
    )
}