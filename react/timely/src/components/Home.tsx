import { useState, useEffect} from "react";
import { makeRequest } from "./utils";
import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";

export default function Home() {

    const [isLoading, setIsLoading] = useState<boolean>(true)

    return (
        <div className='home'>
            <Navbar></Navbar>
            <div className='content-main'>
                <Outlet context={ setIsLoading }></Outlet>
            </div>
            {isLoading && <div className="loading"><div className='loader'/></div>}
        </div>
    )
}