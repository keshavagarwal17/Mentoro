import { useState } from "react";

const TrimText = (props)=>{
    const text = props.text;
    const [showFull,setShowFull] = useState(false);
    const maxLength = 350;
    return (
        <div>
            {text.length<=maxLength && text}
            {
                text.length>maxLength && (
                    showFull?
                    <div>
                        <span>{text}</span> 
                        <span style={{color:"#267ad9",cursor:"pointer"}} onClick={()=>setShowFull(false)}> show less</span>
                    </div>:
                    <div>
                        <span>{text.substr(0,maxLength)}</span> 
                        <span style={{color:"#267ad9",cursor:"pointer"}} onClick={()=>setShowFull(true)}> show more</span>
                    </div>
                )
            }
        </div>
    );
}

export default TrimText;