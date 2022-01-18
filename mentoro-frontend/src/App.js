import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter as Router, Routes,Route,Navigate } from "react-router-dom";
import Home from './Pages/Home/Home';
import Profile from './Pages/Creator/Profile/Profile';
import Creator from './Pages/Creator/Creator/Creator';
import Create from './Pages/Creator/Create/Create';
import CreatorDashboard from './Pages/Creator/Dashboard/Dashboard'
import Dashboard from './Pages/Dashboard/Dashboard'
import Detail from './Pages/Detail/Detail';
import Availability from './Pages/Creator/Availability/Availability';
import PickYourSlot from './Pages/PickYourSlot/PickYourSlot';
import Wallet from './Pages/Creator/Wallet/Wallet';
import Invitation from './Pages/Creator/Invitation/Invitation';
import { useSelector } from 'react-redux';

const App = () => {
  const userId = useSelector((state) => state.auth.userId)
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route exact path="/creator" element = {userId?<Creator />:<Navigate to="/" replace />} />
          <Route exact path='/creator/profile' element={userId?<Profile/>:<Navigate to="/" replace />}/>
          <Route exact path="/creator/create" element = {userId?<Create />:<Navigate to="/" replace />} />
          <Route exact path="/creator/all-invitation" element = {userId?<Invitation />:<Navigate to="/" replace />} />
          <Route exact path="/your-meet" element = {userId?<Invitation />:<Navigate to="/" replace />} />
          <Route exact path="/creator/availability" element = {userId?<Availability />:<Navigate to="/" replace />} />
          <Route exact path="/creator/wallet" element = {userId?<Wallet />:<Navigate to="/" replace />} />
          <Route exact path="/dashboard" element = {<Dashboard />} />
          <Route exact path="/mentor/:id" element = {<Detail />} />
          <Route exact path="/creator/dashboard" element = {userId?<CreatorDashboard />:<Navigate to="/" replace />} />
          <Route exact path="/pick-your-slot" element = {<PickYourSlot />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
