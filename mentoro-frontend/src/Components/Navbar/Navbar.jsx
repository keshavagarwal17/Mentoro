import "./Navbar.css";
import { SearchOutlined,HomeOutlined,UserOutlined,LogoutOutlined,WalletOutlined,PlusSquareOutlined,CalendarOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux'
import axios from "axios";
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { logIn,logOut } from "../../Store/Reducers/auth";
import { Link, useLocation } from "react-router-dom";
import { Popover,Button } from "antd";
import { useEffect, useState } from "react";

const Navbar = () =>{
    const behost = process.env.REACT_APP_BEHOST;
    const {pathname} = useLocation();
    const isCreator = (pathname.length>=8 && pathname.substr(0,8)==="/creator");
    const userId = useSelector((state) => state.auth.userId)
    const dispatch = useDispatch();
    const [user,setUser] = useState({});

    useEffect(()=>{
        const fetchUser = async()=>{
            const response = await axios.get(behost + "profile/get/" + userId);
            setUser(response.data);
        }
        if(isCreator){
            fetchUser();
        }
    },[userId])

    const handleCreatorLogout = ()=>{
        dispatch(logOut())
    }

    const content = (
        <div>
          <div>
            <Link className="profile-nav-link" to="/creator/profile"><UserOutlined /> Update Profile</Link>
          </div>
          <div>
            <Link className="profile-nav-link" to="/creator/all-invitation">All Invitation</Link>
          </div>
          <div>
            <Link className="profile-nav-link" to="/">Back To Home</Link>
          </div>
          <div>
            <Button style={{width:"100%"}} type="primary" icon={<LogoutOutlined />} onClick={handleCreatorLogout} danger>Logout</Button>
          </div>
        </div>
    );
    
    const responseSuccessGoogle = async (response) => {
        const res = await axios({
          method: "POST",
          url: behost + "auth/login",
          data: { tokenId: response.tokenId },
          withCredentials: true
        })
        dispatch(logIn(res.data.id));
    }
    
    const responseErrorGoogle = (response) => {
        console.log("OOPS Error while google authentication ", response)
    }

    return (
        <>
            {   
                isCreator?
                <div className="navbar">
                    <h2 className="logo">Mentoro</h2>
                    <div className="loggedin-link">
                        <Link to="/creator/dashboard"> <HomeOutlined /> Dashboard</Link>
                        <Link to="/creator/create"> <PlusSquareOutlined /> Create-Session</Link>
                        <Link to="/creator/availability"> <CalendarOutlined /> Availability</Link>
                        <Link to="/creator/wallet"><WalletOutlined /> Wallet</Link>
                        <Popover placement="bottomRight" title={user && user.name} content={content}>
                            <img style={{cursor:"pointer"}} className="nav-profile-img" src={user.imageUrl} alt="" />
                        </Popover>
                    </div>
                </div>
                :
                <div className="navbar">
                <h2 className="logo">Mentoro</h2>
                {!userId && <GoogleLogin
                    clientId={process.env.REACT_APP_CLIENT_ID}
                    render={renderProps => (
                        <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="login-btn">Join With Google</button>
                    )}
                    onSuccess={responseSuccessGoogle}
                    onFailure={responseErrorGoogle}
                />}
                {
                    userId && 
                    <div className="loggedin-link">
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/creator">Creator</Link>
                        <Link to="/your-meet">Your Meet</Link>
                        <button className="logout-btn" onClick={()=>dispatch(logOut())}>Logout</button>
                    </div>
                }
            </div>
            }
        </>
    );
}

export default Navbar;