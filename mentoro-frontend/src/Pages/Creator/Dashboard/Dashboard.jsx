import './Dashboard.css';
import Card from './Card'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loader from '../../../Components/Loader/Loader';

const CreatorDashboard = ()=>{
    const behost = process.env.REACT_APP_BEHOST;
    const userId = useSelector((state) => state.auth.userId)
    const [session,setSession] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        const getSessions = async()=>{
            const res = await axios.get(behost+"session/get/" + userId)
            setSession(res.data.session);
            setLoading(false);
        }
        getSessions();
    })
    return (
        <div className='creator-dashboard'>
            <div className='creator-dashboard-decoration-container'>
                <div className='taglines'>
                    <h4>Mentoro</h4>
                    <p>A place where you can create your session, see your scheduled session, view pending request and many more...</p>
                </div>
                <div className='img-block'>
                    <img src="/assets/creator-dashboard.svg" alt="" />
                </div>
            </div>
            <h3 className='your-session'>Your Session</h3>
            {
                loading?<Loader />:
                (
                    session.length===0?<p>You haven't create any session yet.</p> : 
                    session.map((data,index)=><Card data={data} key={index}/>)
                )
            }
        </div>
    );
}

export default CreatorDashboard; 