import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Detail.css'
import Loader from '../../Components/Loader/Loader';
import axios from 'axios';
import SessionCard from '../../Components/SessionCard/SessionCard'
import TrimText from '../../Components/TrimText/TrimText';
import { useNavigate } from 'react-router-dom';

const Detail = () =>{
    const navigate = useNavigate();
    const {id} = useParams();
    const behost = process.env.REACT_APP_BEHOST;
    const [user,setUser] = useState();
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        const getInfo = async()=>{
            const res = await axios.get(behost+"session/get/" + id);
            setUser(res.data);
            setLoading(false);
        }
        getInfo();
    },[])

    const pickYourSlot = (sessionId)=>{
        navigate("/pick-your-slot?mentor=" + id + "&session=" + sessionId)
    }

    return (
        <div>
            {
                loading?
                <Loader />:
                <div className='mentor-page'>
                    <div className='mentor-profile-section'>
                        <div>
                            <img src={user.imageUrl} alt={user.name} />
                        </div>
                        <div>
                            <h3>{user.name}</h3>
                            <p>{user.role},{user.companyName}</p>
                            <i><b>About</b></i>
                            <TrimText text={user.about}></TrimText>
                            <div className='expertise-section'>
                                <i><b>Expertise</b></i>
                                <p>{user.expertise}</p>
                            </div>
                        </div>
                    </div>
                    <div className='mentor-all-session'>
                        <h2 className='session-heading'>Sessions</h2>
                        {
                            user.session.map((session,index)=> <SessionCard callBack={pickYourSlot} data={session} key={index}/>)
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default Detail;