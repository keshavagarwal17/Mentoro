import { useEffect, useState } from 'react';
import './Wallet.css';
import { message,Popconfirm } from 'antd';
import { useSelector } from 'react-redux';
import Loader from '../../../Components/Loader/Loader';
import axios from 'axios';
import { AxiosGet, AxiosPost } from '../../../Components/Request/Request';
import { isUpcoming } from '../../../Shared/algo';

const Wallet = ()=>{
    const [profile,setProfile] = useState({});
    const [data,setData] = useState({});
    const [loading,setLoading] = useState(true);
    const [loadingBtn,setLoadingBtn] = useState(false);
    const [remAmount,setRemAmount] = useState(0);
    const behost = process.env.REACT_APP_BEHOST;
    const userId = useSelector((state) => state.auth.userId)
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showPopConfirm = () => {
        setVisible(true);
    };
    
    const handleTransferMoney = async() => {
        setConfirmLoading(true);
        if(!data.ifscCode || !data.accountNumber || !data.beneficiaryName){
            message.error("Please Provide Your Account Details");
            setProfile(data);
            setConfirmLoading(false);
            setVisible(false);
            return;
        }
        const curDate = new Date();
        const updatedDay = new Date(data.bankInfoUpdated);
        const diff = Math.abs(curDate - updatedDay);
        const days = parseInt(diff/(1000*3600*24));
        if(days<10){
            message.error("You have updated your bank info in last 10 days,so you can't transfer money now.",10)
            setConfirmLoading(false);
            setVisible(false);
            return;
        }
        AxiosPost(behost + "payment/transfer",{},()=>{
            setConfirmLoading(false);
            setVisible(false);
            message.success("Amount Transfer Successfully!!")
        })
    };
    
    const handleCancelTransfer = () => {
        setVisible(false);
    };

    useEffect(()=>{
        const fetchData = async()=>{
            const response = await axios.get(behost + "profile/get/" + userId);
            const {ifscCode,accountNumber,beneficiaryName,bankInfoUpdated,totalEarning,transferredMoney} = response.data;
            setProfile({ifscCode,accountNumber,beneficiaryName,bankInfoUpdated,totalEarning,transferredMoney});
            setData({ifscCode,accountNumber,beneficiaryName,bankInfoUpdated,totalEarning,transferredMoney});
            AxiosGet(behost+"request/mentor/get-all",(res)=>{
                let reserveAmount = 0;
                for(let i=0;i<res.data.length;i++){
                    if(!res.data[i].isCancel && isUpcoming(res.data[i].sessionSchedule)){
                        reserveAmount += res.data[i].amount;
                    }
                }
                setRemAmount(totalEarning - transferredMoney - reserveAmount);
                setLoading(false);
            })
        }
        fetchData();
    },[])

    const formElements = [
        {
            label:"Branch IFSC Code",
            name:"ifscCode",
            placeholder:"Enter Your Branch IFSC Code"
        },
        {
            label:"Account Number",
            name:"accountNumber",
            placeholder:"Enter Your Account Number"
        },
        {
            label:"Beneficiary Name",
            name:"beneficiaryName",
            placeholder:"Enter Beneficiary Name"
        }
    ]

    const handleChangeInput = (e)=>{
        setProfile({
            ...profile,
            [e.target.name]:e.target.value
        })
    }

    const updateBankInfo = async(e)=>{
        e.preventDefault();
        setLoadingBtn(true);
        const url = behost + "profile/update";
        const curDate = new Date();
        setProfile({
            ...profile,
            bankInfoUpdated: curDate
        })
        setData({
            ...profile,
            bankInfoUpdated: curDate
        })
        AxiosPost(url,{...profile,bankInfoUpdated:curDate},(res)=>{
            message.success('Bank Information Updated Successfully!');
            setLoadingBtn(false);
        })
    }

    const renderElement = ()=>{
        return formElements.map((element,index)=>{
            return (
                <div key={index}>
                    <h4 className='label'>{element.label}</h4>
                    {
                        <input required value={profile[element.name]} onChange={handleChangeInput} name={element.name} placeholder={element.placeholder}></input>
                    }
                </div>
            )
        })
    }

    return (
        <>
            {loading?<Loader />:
                <div className='user-wallet'>
                    <div className='wallet-img-input'>
                        <div className='wallet-inp'>
                            <form onSubmit={updateBankInfo}>
                                {renderElement()}
                                <button type='submit' className='update-bank-info'>{loadingBtn?"Loading...":"Update Bank Info"}</button>
                            </form>
                        </div>
                        <div className='wallet-img'>
                            <img src="/assets/wallet.svg" alt="" />
                        </div>
                    </div>
                    <div className='acc-stats'>
                        <h4>Your Wallet</h4>
                        <div className='money-cards-par'>
                            <div className='money-card-1'>
                                Total Earning
                                <p className='wallet-amount'>{profile.totalEarning} Rs</p>
                            </div>
                            <div className='money-card-2'>
                                Money You Already Transferred
                                <p className='wallet-amount'>{profile.transferredMoney} Rs</p>
                            </div>
                            <div className='money-card-3'>
                                Money Available for Transfer
                                <p className='wallet-amount'>{remAmount} Rs</p>
                                {remAmount>0 && 
                                    <Popconfirm
                                        title="Are you sure you want to transfer this money into your account?"
                                        visible={visible}
                                        onConfirm={handleTransferMoney}
                                        okButtonProps={{ loading: confirmLoading }}
                                        onCancel={handleCancelTransfer}
                                    >
                                        <button onClick={showPopConfirm}>Transfer Now</button>
                                    </Popconfirm>
                                }
                            </div>
                        </div>
                    </div>
                    <ul>
                        <h5>Terms & Conditions</h5>
                        <li>you can only transfer money upto yesterday meeting. we reserve the money for upcoming session incase you cancel the meeting.</li>
                        <li>you can transfer money only after atleast 10 days of updating your bank information.</li>
                        <li>you will receive 90% of the total amount, you will transfer.</li>
                    </ul>
                </div>
            }
        </>
    );
}

export default Wallet;