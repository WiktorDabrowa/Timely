import { Link } from "react-router-dom";

export default function Introduction() {
    // TODO if localStorage not empty -> navigate to home
    return (
        <>
            <main>
                Hello, welcome to Timely!
                <div className="">
                    <Link to='/login'>Log In</Link>
                    <Link to='/register'>Create Account!</Link>
                </div>
                {/* Web app description and screenshots */}
            </main>
        </>
    )
}