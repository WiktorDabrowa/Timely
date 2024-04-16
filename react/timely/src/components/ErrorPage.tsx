import { useRouteError } from "react-router-dom"
import { Link } from "react-router-dom"

type Error = {
    status: Number,
    statusText: string,
    data: string,
    internal: boolean,
}

export default function ErrorPage() {
    const error = useRouteError() as Error
    console.log(error)

    return (
        <div>
            {error.statusText}
            message:
            {error.data}
            <Link to='/'>Go Home</Link>
        </div>
    )
}