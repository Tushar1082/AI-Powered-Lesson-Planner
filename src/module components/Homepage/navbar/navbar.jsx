import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

export default function Navbar({setScrollToPlan}) {
    const userName = localStorage.getItem("AI_Lesson_Planner_UserName");
  return (
    <div id='mainNavbar'>
        <div id='logoDiv_nav'>
            <div>
                <img src="logoL.jpeg" alt="error" />
            </div>
            <div>
                <span>AI Powered Lesson Planner</span>
            </div>
        </div>
        <div id='navbarContent_nav'>
            <div>
                <img 
                    src="dummy.png" 
                    alt="error"
                    style={{
                        borderRadius: "50%",
                        height: "35px",
                        objectFit: "cover" 
                    }} 
                />
                <span style={{fontWeight:"bold"}}>{userName}</span>
            </div>
            <div onClick={()=>window.location.href="/"}>
                <img src="home.png" alt="error" />
                <span>Home</span>
            </div>
            <div onClick={()=>{setScrollToPlan(true)}}>
                <img src="ai.png" alt="error" />
                <span>Generate AI Lesson</span>
            </div>
            <div>
                <Link to="/previewsLessonPlans" style={{display:'flex',gap:'10px', alignItems:'center'}}>
                    <img src="previewsPlan.png" alt="error" />
                    <span>Previews Plans</span>
                </Link>
            </div>
        </div>
    </div>
  )
}
