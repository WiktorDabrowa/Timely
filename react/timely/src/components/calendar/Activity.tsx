export default function Activity({activity, style}) {

    

    return (
        <div className='card activity' style={style}>
            {activity.activity.name}
        </div>
    )
}