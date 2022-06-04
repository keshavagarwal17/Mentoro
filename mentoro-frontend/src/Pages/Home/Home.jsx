import './Home.css'
import { ReactComponent as DashboardSVG } from "./dashboard.svg";
import { Link } from 'react-router-dom';

const Home = ()=>{
    return (
        <div className='home'>
            <div className='home-page-lines'>
                <h3>A Place To Find Your Mentor</h3>
                <h5>Take Tips From the Industry Expert To Boost Your Career.</h5>
                <button><Link to="/dashboard">Explore Now</Link></button>
            </div>
            <DashboardSVG />
        </div>
    );
}

export default Home;