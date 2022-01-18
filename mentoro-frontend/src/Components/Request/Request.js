import { getUserId } from "../../Shared/local";
import axios from 'axios'

export const AxiosPost = async(url,data,callback)=>{
    const res = await axios.post(url,data,{
        headers:{
            Authorization:getUserId()
        }
    })
    callback(res);
}

export const AxiosPut = async(url,data,callback)=>{
    const res = await axios.put(url,data,{
        headers:{
            Authorization:getUserId()
        }
    })
    callback(res);
}


export const AxiosGet = async(url,callback)=>{
    const res = await axios.get(url,{
        headers:{
            Authorization:getUserId()
        }
    })
    callback(res);
}