import { Data, UserActivity } from '../../types/activities';
import Weekday from './Weekday';
import { ReactNode, useState } from 'react';

const WEEK_IN_MILISECONDS = 24 * 60 * 60 * 7 * 1000
const DAY_IN_MILISECONDS = WEEK_IN_MILISECONDS/7;


export default function Calendar({data}: {data: Data}) {
    
    const [thisMonday, setThisMonday] = useState(getClosestPreviousMonday());
    const today = new Date();
    today.setHours(0,0,0);
    const newMonday = new Date();
    newMonday.setTime(thisMonday.getTime() + WEEK_IN_MILISECONDS);

    let tasksForThisWeek = getTasksForThisWeek(thisMonday);
    

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
            const activityEndDate = new Date(activity.activity.start_time)
            const begins_this_week =  mondayDate <= activityStartDate && activityStartDate <= nextMonday;
            const ends_this_week = mondayDate <= activityEndDate && activityEndDate <= nextMonday;
            if (begins_this_week || ends_this_week) {
                return activity
            }
        });
        const sortedActivities = sortActivitiesByDay(thisWeekTasks);
        const weekActivities =  addOverflowingTasks(sortedActivities)
        return weekActivities; 
    }

    function sortActivitiesByDay(activities: Array<UserActivity>) {
        // Maps activities to days of week
        let activitiesByDay = {
            1: [], 
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            0: [],
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
        for (let i = 0; i<=6; i++) {
            const activities = tasks[i];
            activities.forEach((activity) => {
                const startDay = new Date(activity.activity.start_time).getDate();
                const endDay = new Date(activity.activity.end_time).getDate();
                startDay !== endDay && tasksOverflowingWeekday.push(activity);
            })
        }
        return tasksOverflowingWeekday;
    }

    function addOverflowingTasks(weekActivities) {
        // adds tasks that overflow a day to all of the days that it occurs on
        const tasksOverflowwingWeekday = getTasksOverflowingWeekday(weekActivities);
        tasksOverflowwingWeekday.forEach((activity) => {
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
                if (i === 7) {
                    i = 0
                } 
                weekActivities[i].push(activity);
                if (i === 0) {
                    break
                }
            }
        });

        return weekActivities
    }

    function moduloOverflowsDay(startTime, modulo) {
        const date = new Date();
        date.setTime(startTime.getTime() + modulo*24*60*60*1000);
        const truthy = date.getDate() !== startTime.getDate()
        return truthy
    }

    function areTheSameDay(date1: Date, date2: Date): boolean {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        )
    }

    function getWeekdays(): Array<ReactNode> {
        let weekdays = []
        for (let i = 1; i<=7; i++) {
            const date = new Date();
            date.setTime(thisMonday.getTime() + (i-1)*DAY_IN_MILISECONDS);
            const is_today = areTheSameDay(today, date);
            i ===  7 ? i=0 : i=i
            weekdays.push(
                <Weekday 
                    key={i}
                    data={tasksForThisWeek[i]}
                    day={date}
                    is_today={is_today}/>
            )
            if (i===0) {
                break
            }
        }
        return weekdays
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
                {getWeekdays()}
            </div>
        </div>
    )
}