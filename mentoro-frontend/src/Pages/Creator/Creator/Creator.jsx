import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import{ Navigate} from "react-router-dom"

const Creator = ()=>{
    const userId = useSelector((state) => state.auth.userId)
    const [loading,setLoading] = useState(true);
    const [profile,setProfile] = useState();
    const behost = process.env.REACT_APP_BEHOST;
    useEffect(()=>{
        const getProfile = async()=>{
            const response = await axios.get(behost + "profile/get/" + userId);
            setProfile(response.data)
            setLoading(false);
        }
        getProfile();
    })
    return (
        <>
            {loading?<p>Loading....</p>:
            profile.about?<Navigate to="dashboard" replace />:<Navigate to="profile" replace state={profile}/>}
        </>
    );
}

export default Creator;