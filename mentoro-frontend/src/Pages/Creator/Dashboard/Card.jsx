import "./Card.css";
import { Button, Tooltip, Popconfirm, message,Switch } from 'antd';
import { EditOutlined,DeleteOutlined } from '@ant-design/icons';
import TrimText from "../../../Components/TrimText/TrimText";
import { useState } from "react";
import { AxiosDelete, AxiosPut } from "../../../Components/Request/Request";
import {  useNavigate } from "react-router-dom";

const Card = (props)=>{
    const [confirmLoading, setConfirmLoading] = useState(false);
    const behost = process.env.REACT_APP_BEHOST;
    const navigate = useNavigate();

    const handleToggle = async(value)=>{
        setConfirmLoading(true);
        AxiosPut(behost + "session/update/" + props.data._id,{public:value},(res)=>{
            setConfirmLoading(false);
            props.updateSession({
                ...props.data,
                public:value
            })
            message.success(value?"Now This Session Will be visible to everyone":"No one except you can see this session now.");
        })
    }

    return (
        <div className="creator-session-card">
            <div className="creator-session-card-header">
                <h5>{props.data.title} ({props.data.duration} Minute)</h5>
                <div>
                    <span>{props.data.price} Rs</span>
                    <Tooltip title="Edit this session">
                        <Button onClick={()=> navigate("/creator/create?id=" + props.data._id)} style={{backgroundColor:"#6C63FF",border:"none",marginLeft:"20px"}} type="primary" shape="circle" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title={props.data.public?"Make this session private":"Make this session public"}>
                        <Switch loading={confirmLoading} style={{marginLeft:"20px"}} onChange={handleToggle} defaultChecked={props.data.public}/>
                    </Tooltip>
                </div>
            </div>
            <TrimText text={props.data.description} />
        </div>
    );
}

export default Card;