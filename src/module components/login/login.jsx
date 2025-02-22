import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '../Loader/loader';
import './login.css';

export default function Login() {
    const [userData, setUserData] = useState({
        name:'',
        password:''
    });
    const [showLoading,setShowLoading] = useState(false);
    const navigate = useNavigate();

    function handleLogin(){
        if(userData.name.length==0){
            alert('Enter User Name');
            return;
        }else if(userData.password.length==0){
            alert('Enter Password');
            return;
        }else if(userData.name != 'demouser' && userData.password != 'demopass'){
            alert('Provided credentials are wrong');
            return;
        }else{
            setShowLoading(true);
            localStorage.setItem('AI_Lesson_Planner_UserName','userdemo');
            setTimeout(()=>{
                setShowLoading(false);
            },1000);
            setTimeout(()=>{
                navigate('/');        
            },1100);
        }

    }

    return (
    <div id='mainLogin'>
        <div id='logoDiv_log'>
            <div>
                <img src="logoL.jpeg" alt="error" />
            </div>
            <div>
                <span>AI Powered Lesson Planner</span>
            </div>
        </div>
        <div id='loginDivContainer'>
            <div id='userImgLogin'>
                <img src="dummy.png" alt="error" />
            </div>
            <div id='loginInputsDiv' style={{marginTop:'1rem'}}>
                <div>
                    <p>User Name: </p>
                    <Input placeholder='User name' onChange={(e)=>setUserData((prev)=>({...prev, name:e.target.value}))} />
                </div>
                <div>
                    <p>Password: </p>
                    <Input 
                        type="password" 
                        placeholder='Password' 
                        onChange={(e)=>setUserData((prev)=>({...prev, password:e.target.value}))} 
                        onKeyPress = {(e)=>e.key === "Enter"?handleLogin():null}
                    />
                </div>
            </div>
            <div id='loginBtn'>
                <Button onClick={handleLogin}>Login</Button>
            </div>
        </div>
        {showLoading? <Loader/>: null}
    </div>
  )
}
