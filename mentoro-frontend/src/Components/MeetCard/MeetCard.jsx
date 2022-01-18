import './MeetCard.css';
import { Button,Modal,Input, message,Popconfirm } from 'antd';
import { useState } from 'react';
import { AxiosPost,AxiosPut } from '../Request/Request';
import { FormatFromMinute } from '../../Shared/algo';

const MeetCard = (props)=>{
    const [data,setData] = useState(props.data)
    const behost = process.env.REACT_APP_BEHOST;
    const [isModalVisible,setModalVisibility] = useState(false)
    const [inpValue,setValue] = useState(props.data.sessionLink);
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showPopConfirm = () => {
        setVisible(true);
    };
    
    const handleDeleteMeet = async() => {
        setConfirmLoading(true);
        AxiosPost(behost + "payment/refund",{id:data._id},(res)=>{
            AxiosPut(behost + "request/cancel/" + data._id,{},()=>{
                props.cancelEvent({...data,isCancel:true});
                setConfirmLoading(false);
                setVisible(false);
                message.success("Meeting Cancelled Successfully!!")
            })
        })
    };
    
    const handleCancelDeleteMeet = () => {
        setVisible(false);
    };

    const handleOk = async()=>{
        setData({
            ...data,
            ["sessionLink"]:inpValue
        })
        setModalVisibility(false)
        AxiosPost(behost + "request/update-link",{link:inpValue,requestId:data._id},(tem)=>{
            message.success("Session Link Updated Successfully!!")
        })
    }

    const handleCancel = ()=>{
        setModalVisibility(false);
    }

    return (
        <div className='meet-card'>
            <Modal title="Meeting Link" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input type="text" value={inpValue} onChange={(e)=>setValue(e.target.value)}/>
            </Modal>
            <div className='meet-card-container'>
                <div>
                    <h4>{data.session.title} ({data.session.duration} Min)</h4>
                    <h5>Amount: {data.amount}</h5>
                </div>
                <div>
                    <strong>Schedule: {FormatFromMinute(data.sessionSchedule.startTime)}-{FormatFromMinute(data.sessionSchedule.endTime)} &nbsp; {data.sessionSchedule.date}-{data.sessionSchedule.month}-{data.sessionSchedule.year}</strong>
                    {props.isMentor && !props.pastEvent && 
                        <Popconfirm
                            title="Are you sure you want to cancel this meet? this action can't be reversed."
                            visible={visible}
                            onConfirm={handleDeleteMeet}
                            okButtonProps={{ loading: confirmLoading }}
                            onCancel={handleCancelDeleteMeet}
                        >
                            <Button danger onClick={showPopConfirm}>Cancel This Meet</Button>
                        </Popconfirm>
                    }
                    {props.isMentor && !props.pastEvent && <Button type="primary" style={{marginLeft:"10px"}} onClick={()=>setModalVisibility(true)}>Update Meet Link</Button>}
                    {data.isCancel && <p className='cancelled'>Cancelled</p>}
                </div>
            </div>
            <strong>Meeting Link: {data.sessionLink?data.sessionLink:"Not Provided"}</strong>
            {props.isMentor && <p>Booked By: {data.user.name} ({data.user.email})</p>}
            {!props.isMentor && <p>Mentored By: {data.mentor.name} ({data.mentor.email})</p>}
            {props.isMentor && data.isCancel && <h6 className='cancelled'>you cancelled this event</h6>}
            {!props.isMentor && data.isCancel && <h6 className='cancelled'>mentor of this meeting cancelled this event,you will receive the refund in few days.</h6>}
        </div>
    );
}

export default MeetCard;