import axios from 'axios';
import { useEffect, useState } from 'react';
import './Dashboard.css';
import Loader from '../../Components/Loader/Loader'
import Card from '../../Components/CreatorCard/Card';

const Dashboard = ()=>{
    const behost = process.env.REACT_APP_BEHOST;
    const [users,setUser] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const getAllCreators = async()=>{
            const res = await axios.get(behost + "profile/all");
            setUser(res.data.users);
            setLoading(false);
        }
        getAllCreators();
    })

    return (
        <div>
            {
                loading?<Loader />:
                <div className='all-creator-card'>
                    {
                        users.map((user,index)=><Card key={index} user={user}/>)
                    }
                </div>
            }
        </div>
    );
}

export default Dashboard;