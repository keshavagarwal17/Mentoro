import "./Card.css";
import { Button, Tooltip } from 'antd';
import { EditOutlined,DeleteOutlined } from '@ant-design/icons';
import TrimText from "../../../Components/TrimText/TrimText";

const Card = (props)=>{
    return (
        <div className="creator-session-card">
            <div className="creator-session-card-header">
                <h5>{props.data.title} ({props.data.duration} Minute)</h5>
                <div>
                    <span>{props.data.price} Rs</span>
                    <Tooltip title="Edit this session">
                        <Button style={{backgroundColor:"#6C63FF",border:"none",marginLeft:"20px"}} type="primary" shape="circle" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="Delete this session">
                        <Button style={{marginLeft:"20px"}} type="danger" shape="circle" icon={<DeleteOutlined />} />
                    </Tooltip>
                </div>
            </div>
            <TrimText text={props.data.description} />
        </div>
    );
}

export default Card;