import './PickYourSlot.css';
import Calender from '../../Components/Calender/Calender';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../../Components/Loader/Loader';
import Slots from '../../Components/Slots/Slots';

const PickYourSlot = ()=>{
    let [searchParams, setSearchParams] = useSearchParams();
    let sessionId = searchParams.get("session");
    let mentorId = searchParams.get("mentor");
    const behost = process.env.REACT_APP_BEHOST;
    const [sessionDetail,setSession] = useState();
    const [loading,setLoading] = useState(true);
    const [selectedDate,setSlotDate] = useState({})

    useEffect(()=>{
        const getSessionDetail = async()=>{
            const res = await axios.get(behost+"session/get-session/" + sessionId);
            setSession(res.data.session);
            setLoading(false);
        }
        getSessionDetail();
    },[])

    return (
        <>
        {
            loading?<Loader />:
            <div className='pick-slot'>
            {!loading && <div>
                <h3>Pick Your Slot for {sessionDetail.title}.</h3>
                <h6>pick your slot wisely because you will not be able to change the slot after booking.</h6>
                <h5>Time: {sessionDetail.duration} Minute</h5>
                <h5>Cost: {sessionDetail.price} Rs.</h5>
                <div className='pick-slot-img-container'>
                    <img src="/assets/pick-slot.svg" alt="" />
                </div>
            </div>}
            <Calender mentor = {sessionDetail.mentor} setSlotDate={setSlotDate}/>
            {selectedDate.date && <Slots selectedDate={selectedDate} sessionDetail={sessionDetail}/>}
        </div>
        }
        </>
    );
}

export default PickYourSlot;