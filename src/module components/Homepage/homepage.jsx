import React,{useState} from 'react';
import Navbar from './navbar/navbar';
import UserInputForm from './userInputForm/userInputForm';
import LessonPlan from './lessonPlan/lessonPlan';
import Footer from './footer/footer';
import "./homepage.css";

export default function homepage() {
  const [lessonPlan, setLessonPlan] = useState(null);
  const [scrollToPlan, setScrollToPlan] = useState(false);

  function HeroSection() {
    return (
      <div id="hero">
        <h1 id="heroTitle">Smart Lesson Planning with AI ✨</h1>
        <p id="heroSubtitle">
          Create structured, AI-powered lesson plans in seconds!
        </p>
        <div id="heroButtons">
          <button id="generateLessonBtn" onClick={()=>setScrollToPlan(true)}>Generate Lesson Plan</button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Navbar setScrollToPlan={setScrollToPlan}/>
      <HeroSection/>
        <UserInputForm setLessonPlan={setLessonPlan} scrollToPlan={scrollToPlan} setScrollToPlan={setScrollToPlan}/>
        {lessonPlan?
          <>
            <div id='generatedResultHead'>
              <h1 style={{fontSize:''}}>Generated Result:</h1>
            </div>
            <LessonPlan lessonPlan={lessonPlan}/>
          </>
        :null}
        <Footer/>
    </>
  )
}
