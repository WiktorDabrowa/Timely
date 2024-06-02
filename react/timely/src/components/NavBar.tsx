import { Link } from "react-router-dom";
import { useState } from "react";

const paths = [
    {slug:'me', path: '/home', caption: 'My Time'},
    {slug:'people', path: '/home/people', caption: 'People'},
    {slug:'activities', path: '/home/activities', caption: 'Activities'},
    {slug:'find-the-time', path: '/home/find-the-time', caption: 'Find the time'},
]

type Tab = 'me' | 'people' | 'activities' | 'find-the-time' | string

export default function Navbar() {
    const [currentTab, setCurrentTab] = useState<Tab>('me')
    const navItems = paths.map((item, i) => {
        const isOpen = item.slug === currentTab;
        return (
            <li 
                key={i}
                className={isOpen ? "navbar-list-item open" : "navbar-list-item"}
                onClick={() => setCurrentTab(item.slug)}
                >
                <Link to={item.path}>{item.caption}</Link>
            </li>
        )
    })

    return (
        <nav className='navbar'>
            <div className="navbar-logo">
                Timely
            </div>
            <ul className='navbar-list'>
                {navItems}
            </ul>
        </nav>
    )
}