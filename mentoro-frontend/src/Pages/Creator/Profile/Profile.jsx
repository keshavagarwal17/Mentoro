import './Profile.css';
import 'antd/dist/antd.css';
import { useLocation } from 'react-router-dom';
import { useEffect,useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Loader from '../../../Components/Loader/Loader';
import { message } from 'antd';
import { AxiosPost } from '../../../Components/Request/Request';

const Profile = () =>{
    const location = useLocation();
    const userId = useSelector((state) => state.auth.userId)
    const [loading,setLoading] = useState(true);
    const [profile,setProfile] = useState({});
    const [loadingBtn,setLoadingBtn] = useState(false);
    const behost = process.env.REACT_APP_BEHOST;

    useEffect(()=>{
        const getProfile = async()=>{
            let user;
            if(location.state && location.state.user){
                user = location.state.user;
            }else{
                const response = await axios.get(behost + "profile/get/" + userId);
                user = response.data;
            }
            setProfile({
                ...user,
                isImageUrl: true
            });
            setLoading(false);
        }
        getProfile();
    },[])

    const handleChangeInput = (e)=>{
        setProfile({
            ...profile,
            [e.target.name]:e.target.value
        })
    }

    const deleteImage = ()=>{
        setProfile({
            ...profile,
            imageUrl:"/assets/user.jpg",
            isImageUrl: true,
            profileImg: null
        })
    }

    const handleChangeImage = (e)=>{
        const file = e.target.files[0];
        if(file){
            setProfile({
                ...profile,
                profileImg: file,
                isImageUrl: false
            })
        }
    }

    const isDefaultImage = ()=>{
        return profile.imageUrl==="/assets/user.jpg"
    }

    const updateProfile = async()=>{
        if(!profile.name){
            message.error("Name is Required!!");
            return;
        }
        setLoadingBtn(true);
        if(!profile.isImageUrl){
            var formData = new FormData();
            formData.append("file",profile.profileImg);
            formData.append("upload_preset","bsedbvqy");
            const response = await axios.post("https://api.cloudinary.com/v1_1/keshav-agarwal/image/upload",formData);
            profile.imageUrl = (response.data.secure_url);
        }
        const data = {
            name: profile.name,
            companyName: profile.companyName,
            role: profile.role,
            about: profile.about,
            imageUrl: profile.imageUrl,
            email: profile.email,
            expertise: profile.expertise,
        }
        const url = behost + "profile/update";
        AxiosPost(url,data,(res)=>{
            message.success('Profile Updated Successfully!');
            setLoadingBtn(false);
        })
    }

    return (
        <>
        {
            loading?<Loader />:
            <div className='creator-profile-page'>
                <h2>Complete Your Profile</h2>
                <div className="complete-profile">
                    <div className='profile-img-section'>
                        {profile.isImageUrl?<img src={profile.imageUrl} alt="" />:<img src={URL.createObjectURL(profile.profileImg)} alt="" />}
                        <div className='profile-pic-btn'>
                            <label className='change-img-btn'>
                                <input value="" onChange={handleChangeImage} type="file" accept="image/*"></input>
                                Change Photo
                            </label>
                            {(!isDefaultImage()  || !profile.isImageUrl) && <button className='delete-img-btn' onClick={deleteImage}>
                                Delete Picture
                            </button>}
                        </div>
                    </div>
                    <div className='creator-profile-ip'>
                        <div>
                            <h4>Name</h4>
                            <input value={profile.name} onChange={handleChangeInput} type="text" name="name" placeholder='Write Your Name'></input>
                        </div>
                        <div>
                            <h4>Company Name</h4>
                            <input value={profile.companyName} onChange={handleChangeInput} type="text" name="companyName" placeholder='Write Your Company Name'></input>
                        </div>
                        <div>
                            <h4>Role</h4>
                            <input value={profile.role} onChange={handleChangeInput} type="text" name="role" placeholder='Write Your Current Role'></input>
                        </div>
                        <div>
                            <h4>Expertise</h4>
                            <input value={profile.expertise} onChange={handleChangeInput} type="text" name="expertise" placeholder='Write Your Expertise'></input>
                        </div>
                        <div>
                            <h4>About</h4>
                            <textarea value={profile.about} onChange={handleChangeInput} name="about" cols="30" rows="10"></textarea>
                        </div>
                        <div>
                            <button className='update-profile-btn' onClick={updateProfile}>{loadingBtn?"Loading...":"Update Profile"}</button>
                        </div>
                    </div>
                </div>
            </div>
        }
        </>
    );
}

export default Profile;