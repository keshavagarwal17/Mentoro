import './Availability.css';
import { useEffect, useState } from 'react';
import { PlusOutlined,DeleteOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { useSelector } from 'react-redux';
import { AxiosPost } from '../../../Components/Request/Request';
import { message } from 'antd';
import axios from 'axios';
import { FormatFromMinute } from '../../../Shared/algo';
import Loader from '../../../Components/Loader/Loader';
import { dayName } from '../../../Shared/algo';

const Availability = ()=>{
    const { Option } = Select;
    const userId = useSelector((state) => state.auth.userId)
    const behost = process.env.REACT_APP_BEHOST;
    const [loading,setLoading] = useState(true);
    const [loadingBtn,setLoadingBtn] = useState(false);
    const [error,setError] = useState({})
    const [slots,setSlot] = useState({
        Sunday:[],
        Monday:[],
        Tuesday:[],
        Wednesday:[],
        Thursday:[],
        Friday:[],
        Saturday:[],
    });

    useEffect(()=>{
        const getAvail = async()=>{
            const res = await axios.get(behost + "profile/availability/" + userId);
            setSlot(res.data.availability);
            setLoading(false);
        }
        getAvail();
    },[])

    const saveData = async()=>{
        const data = slots;
        for(let i=0;i<7;i++){
            let tem = data[dayName[i]];
            for(let j=0;j<tem.length;j++){
                if(tem[j].startTime==="" || tem[j].endTime===""){
                    setError({
                        ...error,
                        [dayName[i]]:"Please Fill All the Field"
                    })
                    return;
                }
                if(tem[j].startTime >= tem[j].endTime){
                    setError({
                        ...error,
                        [dayName[i]]:"Start time must be less than end time."
                    })
                    return;
                }
            }

            data[dayName[i]].sort((a,b)=>a.startTime < b.startTime ? -1:1);

            tem = data[dayName[i]];
            for(let j=1;j<tem.length;j++){
                if(tem[j].startTime < tem[j-1].endTime){
                    setError({
                        ...error,
                        [dayName[i]]:"Time Interval is collapsed."
                    })
                    return;
                }
            }
        }
        const url = behost + "profile/update";
        setLoadingBtn(true);
        AxiosPost(url,{availability:data},(res)=>{
            setLoadingBtn(false);
            message.success('Availability Updated Successfully!');
        })
    }

    const options = [],option2 = [];

    for(let i=0;i<95;i++){
        let min = 15*i;
        options.push(<Option key={min} value={min}>{FormatFromMinute(min)}</Option>)
        option2.push(<Option key={min + 15} value={min + 15}>{FormatFromMinute(min + 15)}</Option>)
    }

    const addSlot = (name)=>{
        setError({});
        setSlot({
            ...slots,
            [name]:[...(slots[name]),{startTime:"",endTime:""}]
        })
    }

    const deleteSlot = (name,index)=>{
        setError({})
        let temSlot = slots[name];
        temSlot.splice(index,1);
        setSlot({
            ...slots,
            [name]:temSlot
        })
    }

    const handleChangeSelect = (day,index,time,value)=>{
        setError({});
        let temSlot = slots[day];
        temSlot[index][time] = value;
        setSlot({
            ...slots,
            [day]:temSlot
        })
    }

    return (
        <div className='availability'>
            <h3>Set Your Availability</h3>
            {loading?<Loader />:<div className='avail-container'>
                <div className='avail-day-container'>
                    {
                        dayName.map((name,index)=>{
                            return (
                                <div key={index} className='avail-day'>
                                    <div className='dayName'>
                                        {name}
                                    </div>
                                    <div>
                                        {
                                            slots[name].map((slot,i2)=>{
                                                return (
                                                    <div key={"slot-timing" + i2} className='slot-timing'>
                                                        <Select value={slots[name][i2].startTime ?slots[name][i2].startTime:null } onChange={(e)=>handleChangeSelect(name,i2,"startTime",e)} placeholder="From">
                                                            {options}
                                                        </Select>
                                                        <Select value={slots[name][i2].endTime?slots[name][i2].endTime:null} onChange={(e)=>handleChangeSelect(name,i2,"endTime",e)} placeholder="To  ">
                                                            {option2}
                                                        </Select>
                                                        <button onClick={()=>deleteSlot(name,i2)}><DeleteOutlined /></button>
                                                    </div>
                                                );
                                            })
                                        }
                                        {error[name] && <p className='error'>{error[name]}</p>}
                                        <button className='add-slot-button' onClick={()=>addSlot(name)}><PlusOutlined /> Add Slot</button>
                                    </div>
                                </div>
                            );
                        })
                    }
                    <button onClick={saveData} className='save-btn'>{loadingBtn?"Loading...":"Save"}</button>
                </div>
                <div className='avail-img-container'>
                    <img src="/assets/avail.svg" alt="" />
                </div>
            </div>}
        </div>
    );
}

export default Availability;