import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Create.css';
import { AxiosPost } from '../../../Components/Request/Request';
import { Select } from 'antd';
const {Option} = Select;

const Create = () =>{
    const behost = process.env.REACT_APP_BEHOST;
    const [loadingBtn,setLoadingBtn] = useState(false);
    const navigate = useNavigate();
    const options = [];
    for(let i=15;i<=150;i+=15){
        options.push(
            <Option key={i} value={i}>{i} Minute</Option>
        )
    }
    const formElements = [
        {
            label:"Session Title",
            name: "title",
            placeholder: "Write a title about this session(for e.g. Mock Interview)",
            type: "text",
            isTextArea: false,
            required: true
        },
        {
            label:"Price(INR)",
            name: "price",
            placeholder: "Write price for this session",
            type: "number",
            isTextArea: false,
            required: true
        },
        {
            label:"Description",
            name: "description",
            placeholder: "Write description about this session",
            type: "text",
            isTextArea: true,
        },
    ]

    const [session,setSession] = useState({
        title: "",
        price: "",
        duration:"",
        description: ""
    })

    const handleChangeInput = (e)=>{
        setSession({
            ...session,
            [e.target.name]:e.target.value
        })
    }

    const renderElement = ()=>{
        return formElements.map((element,index)=>{
            return (
                <div key={index}>
                    <h4 className='label'>{element.label}</h4>
                    {
                        element.isTextArea?
                        <textarea value={session[element.name]} onChange={handleChangeInput} type={element.type} name={element.name} placeholder={element.placeholder} rows="10"></textarea>:
                        <input required={element.required} value={session[element.name]} onChange={handleChangeInput} type={element.type} name={element.name} placeholder={element.placeholder}></input>
                    }
                </div>
            )
        })
    }

    const createSession = async(e)=>{
        e.preventDefault();
        setLoadingBtn(true);
        AxiosPost(behost+"session/create",session,(res)=>{
            setLoadingBtn(false);
            navigate("/creator/dashboard")
        })
    }

    const handleChange = (e)=>{
        setSession({
            ...session,
            ["duration"]:e
        })
    }

    return (
        <div className='create-session'>
            <h3 className='heading'>Create A Session</h3>
            <form onSubmit={createSession}>
                <div className='create-session-flex'>
                    <div className='create-session-inp-div'>
                        {renderElement()}
                        <div>
                            <h4 className='label'>Duration</h4>
                            <Select placeholder="Write the time duration for this session" style={{width:"90%",marginBottom:"10px"}} onChange={handleChange}>
                                {options}
                            </Select>
                        </div>
                    </div>
                    <div className='create-session-img-div'>
                        <img src="/assets/create-session.svg" alt="" />
                    </div>
                </div>
                <button type='submit'>{loadingBtn?"Loading...":"Create Session"}</button>
            </form>
        </div>
    );
}

export default Create;