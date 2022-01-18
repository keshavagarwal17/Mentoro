import { useEffect, useState } from 'react';
import { AxiosGet } from '../../../Components/Request/Request';
import './Invitation.css';
import Loader from '../../../Components/Loader/Loader';
import MeetCard from '../../../Components/MeetCard/MeetCard';
import { ReactComponent as EmptySVG } from "./empty.svg";
import { useLocation } from 'react-router-dom';
import { isUpcoming } from '../../../Shared/algo';

const Invitation = ()=>{
    const behost = process.env.REACT_APP_BEHOST;
    const [loading,setLoading] = useState(true);
    const [upcomingMeet,setUpcomingMeet] = useState([]);
    const [pastMeet,setPastMeet] = useState([]);
    const [showUpcoming,setShowUpcoming] = useState(true);
    const {pathname} = useLocation();
    const isMentor = (pathname !== "/your-meet")

    const cancelEvent = (curMeet)=>{
        const temMeet = upcomingMeet.filter((meet,index)=> meet._id!=curMeet._id)
        setUpcomingMeet(temMeet);
        setPastMeet([
            ...pastMeet,
            curMeet
        ])
    }

    useEffect(()=>{
        let url = "";
        if(isMentor){
            url = behost + "request/mentor/get-all"
        }else{
            url = behost + "request/user/get-all"
        }
        AxiosGet(url,(res)=>{
            let upcoming = [],past = [];
            for(let i=0;i<res.data.length;i++){
                if(!res.data[i].isCancel && isUpcoming(res.data[i].sessionSchedule)){
                    upcoming.push(res.data[i]);
                }else{
                    past.push(res.data[i]);
                }
            }
            setUpcomingMeet(upcoming);
            setPastMeet(past);
            setLoading(false);
        })
    },[])

    return (
        <>
            {loading?<Loader />:
                    <div className='all-invitations'>
                        <span onClick={()=>setShowUpcoming(true)} className={'toggle-invite-link' + (showUpcoming?"-active":"")}>Upcoming Meet</span>
                        <span onClick={()=>setShowUpcoming(false)} className={'toggle-invite-link' + (!showUpcoming?"-active":"")}>Past Meet</span>
                    <div>
                        {
                            showUpcoming && (
                                upcomingMeet.length>0?upcomingMeet.map((meet,index)=> <MeetCard pastEvent={false} cancelEvent={cancelEvent} isMentor={isMentor} key={index} data={meet}/>):
                                <div className='empty-div'>
                                    <EmptySVG /> <br />
                                    You do not have any upcoming meet
                                </div>
                            )
                        }
                        {
                            !showUpcoming && (
                                pastMeet.length>0?pastMeet.map((meet,index)=> <MeetCard pastEvent={true} isMentor={isMentor} key={index} data={meet}/>):
                                <div className='empty-div'>
                                    <EmptySVG /><br />
                                    You do not have any past meet
                                </div>
                            )
                        }
                    </div>
                </div>
            }
        </>
    );
}

export default Invitation;