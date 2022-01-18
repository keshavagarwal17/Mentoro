import "./SessionCard.css";
import TrimText from "../TrimText/TrimText";

const Card = (props)=>{
    return (
        <div className="creator-detail-session-card">
            <div className="creator-detail-session-card-header">
                <h5>{props.data.title} ({props.data.duration} Minute)</h5>
                <div className="creator-detail-session-card-price">
                    <span>{props.data.price} Rs</span>
                </div>
            </div>
            <TrimText text={props.data.description} />
            <p className="book-now-btn">
                <button onClick={()=>props.callBack(props.data._id)} className="book-now-btn">Book Now</button>
            </p>
        </div>
    );
}

export default Card;