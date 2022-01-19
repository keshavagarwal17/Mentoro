import './Slots.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { message,Spin } from 'antd';
import { AxiosPost,AxiosGet } from '../Request/Request';
import { dayName, FormatFromMinute } from '../../Shared/algo';
import { LoadingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';


const Slots = (props) =>{
    const [slots,setSlots] = useState([]);
    const userId = useSelector((state) => state.auth.userId)
    const [loading,setLoading] = useState(true);
    const {date,month,year} = props.selectedDate;
    const behost = process.env.REACT_APP_BEHOST;

    const getDay = (date) =>{
        const formatDate =  new Date(year, month-1, date);
        return formatDate.getDay();
    }

    const dateObj = (obj,a) =>{
        let {date,month,year} = obj;
        const hour = parseInt(a/60);
        const min = a%60;
        month--;
        return new Date(year,month,date,hour,min,0,0);
    }

    const handlePayment = async(a,b)=>{
        if(!userId){
            message.error("You Are Not Logged in!!");
            return;
        }
        const amount = props.sessionDetail.price;
        const response = await axios.post(behost + "payment/order",{amount});
        const userRes = await axios.get(behost + "profile/get/" + userId);
        const {order_id} = response.data;
        var options = {
            "key": process.env.REACT_APP_KEY_ID,
            "amount": amount*100, 
            "currency": "INR",
            "name": "Mentoro",
            "description": "Transaction",
            "order_id": order_id,
            "handler": async (response) => {
                const result = await axios.post(behost + "payment/validate",{
                    razorpayOrderId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature
                })
                if(result.data.valid){
                    let data = {
                        mentorId: props.sessionDetail.mentor._id,
                        userId,
                        startTime: dateObj(props.selectedDate,a),
                        endTime: dateObj(props.selectedDate,b),
                        title: props.sessionDetail.title
                    }
                    //add event on calender
                    AxiosPost(behost + "calendar/add-event",data,(res)=>{
                        data = {
                            amount,
                            session: props.sessionDetail._id,
                            mentor: props.sessionDetail.mentor._id,
                            sessionSchedule: {
                                ...props.selectedDate,
                                startTime: a,
                                endTime: b
                            },
                            razorpayOrderId: order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            evnetId: res.data.evnetId
                        }
                        
                        // book slot in db
                        AxiosPost(behost+"request/book",data,()=>{
                            
                        });
                    })

                }else{
                    message.error("OOPS!! Something Went Wrong")
                }
            },
            "modal": {
                "ondismiss": function(){
                    // console.log('Checkout form closed');
                }
            },
            "prefill": {
                "name": userRes.data.name,
                "email": userRes.data.email
            }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
                console.log(response.error.code);
                console.log(response.error.description);
                console.log(response.error.source);
                console.log(response.error.step);
                console.log(response.error.reason);
                console.log(response.error.metadata.order_id);
                console.log(response.error.metadata.payment_id);
                message(response.error.reason);
        });
        rzp1.open();
    }

    useEffect(()=>{
        const findSlot = async()=>{
            setLoading(true);
            const mentor = props.sessionDetail.mentor;
            const {availability} = mentor;
            const dayIndex = getDay(date);
            let duration = props.sessionDetail.duration;
            let mentorSlot = availability[dayName[dayIndex]];
            let temSlot = [];
            let isAvailable = [];
            for(let i=0;i<95;i++){
                isAvailable[i] = false;
            }
            for(let i=0;i<mentorSlot.length;i++){
                let {startTime,endTime} = mentorSlot[i];
                while(startTime + 15 <= endTime){
                    isAvailable[startTime/15] = true;
                    startTime +=15;
                }
            }
            // temSlot.push({startTime:(startTime),endTime:(startTime + duration)})
            AxiosGet(behost + "request/find/" + mentor._id + `?date=${date}&month=${month}&year=${year}`,(res)=>{
                let schedules = res.data;
                for(let i=0;i<schedules.length;i++){
                    let {startTime,endTime} = schedules[i].sessionSchedule;
                    while(startTime + 15 <= endTime){
                        isAvailable[startTime/15] = false;
                        startTime +=15;
                    }
                }
                let slice = duration/15;
                let j;
                for(let i=0;i<95;i+=j){
                    j = 0;
                    while((i+j)<95 && (j<slice) && isAvailable[i+j]){
                        j++;
                    }
                    if(j==slice){
                        temSlot.push({startTime:(15*i),endTime:(15*i + duration)})
                    }
                    while((i+j < 95) && !isAvailable[i+j]) j++;
                }
                setSlots(temSlot);
                setLoading(false);
            })
        }
        findSlot();
    },[date,month,year])
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        <div>
            {loading && <Spin indicator={antIcon} />}
            {!loading && slots.length===0 && <p>OOPS!! No Slots Available</p>}
            {slots.length>0 && <div className='time-slot-in-calender'>
                    <h3>Time Slot</h3>
                    <h6>Time is in 24 hour format</h6>
                    <h5>Date: {date}-{month}-{year}</h5>
                    {slots.map((slot,index)=>{
                        return (
                            <div key={index}>
                                <button onClick={()=>handlePayment(slot.startTime,slot.endTime)}>{FormatFromMinute(slot.startTime)} - {FormatFromMinute(slot.endTime)}</button>
                            </div>
                        );
                    })}
            </div>}
        </div>
    );
}

export default Slots;