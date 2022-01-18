import { useEffect, useState } from 'react';
import './Calender.css';
import { dayName } from '../../Shared/algo';

const Calender = (props)=>{

    let curYear = new Date().getFullYear(),curMonth = new Date().getMonth() + 1 ;
    const [year,setYear] = useState(curYear);
    const [month,setMonth] = useState(curMonth);
    const [loading,setLoading] = useState(true);
    const today  = new Date();
    const todayDate = today.getDate();
    const [activeDays,setActiveDays] = useState([])
    const [activeDate,setActiveDate] = useState({});

    const getDay = (date) =>{
        const formatDate =  new Date(year, month-1, date);
        return formatDate.getDay();
    }

    const goNext = ()=>{
        if(month==12){
            setMonth(1);
            setYear(year + 1);
        }else{
            setMonth(month + 1);
        }
    }

    const goBack = () => {
        if(month==1){
            setMonth(12);
            setYear(year - 1);
        }else{
            setMonth(month - 1);
        }
    }

    useEffect(()=>{
        const mentor = props.mentor;
        const {availability} = mentor;
        let temArray = [];
        for(let i=0;i<7;i++){
            if(availability[dayName[i]].length > 0){
                temArray[i]  = true;
            }else{
                temArray[i] =false;
            }
        }
        setActiveDays(temArray)
        setLoading(false);
    },[])

    const isLeapYear = () =>{
        if(year%400==0) return true;
        if(year%100!=0 && year%4==0) return true;
        return false;
    }

    const getNumOfDay = ()=>{
        if(month==2){
            if(isLeapYear()) return 29;
            return 28;
        }else if(month==1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
            return 31;
        }
        return 30;
    }

    const weekDay = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

    const day = getNumOfDay();
    const cur_day  = getDay(1);

    const isActive = (date)=>{
        if(month==curMonth && year==curYear && date < todayDate) return false;
        const d = getDay(date);
        return activeDays[d];
    }

    const isBackEligible = ()=>{
        if(month==curMonth && year==curYear) return false;
        return true;
    }

    const isNextEligible = () =>{
        if(curYear==year) return true;
        if(curMonth > month) return true;
        return false;
    }

    const findSlot = (date)=>{
        setActiveDate({
            date,
            month,
            year
        })
        props.setSlotDate({
            date,
            month,
            year
        })
    }

    const isActivate = (date)=>{
        return (date=== activeDate.date && month=== activeDate.month && year===activeDate.year)
    }

    return (
        <>
        {!loading && 
            <div className='calender-box'>
                <p>{isBackEligible() && <button onClick={goBack} className='back-btn'> &lt;-- </button>}{months[month-1]} {year} {isNextEligible() && <button onClick={goNext} className='next-btn'> --&gt; </button>}</p>
                <div className="calender">
                    {
                        weekDay.map((day,index)=>(
                            <div key={index} className='day-name'>
                                {day}
                            </div>
                        ))
                    }
                    {
                        [...Array(cur_day)].map((el, index) => <p key={index} className='day'></p>)
                    }
                    {
                        [...Array(day)].map((el, index) => isActive(index+1)?<p key={index} onClick={()=>{findSlot(index+1)}} className={'active-day day' + (isActivate(index+1)?" active":"")}>{index+1}</p>:<strike key={index} className='day'>{index+1}</strike>)
                    }
                </div>
            </div>
        }
        </>
    )
}

export default Calender;