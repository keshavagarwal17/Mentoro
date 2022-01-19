import "./Card.css";
import { Link } from "react-router-dom";

const Card = (props)=>{
    const user = props.user;
    return (
        <div className="creator-cards">
            <Link to={"/mentor/"+user._id}>
            <img src={user.imageUrl} alt={user.name} />
            <div className="creator-info">
                <h3>{user.name}</h3>
                <h5>{user.role}</h5>
                <h5>{user.companyName}</h5>
                <h5>{user.expertise }</h5>
            </div>
            </Link>
        </div>
    );
}

export default Card;