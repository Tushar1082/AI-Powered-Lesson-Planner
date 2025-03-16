import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Loader from '@/module components/Loader/loader';
import './lessonPlan.css';

export default function LessonPlan({lessonPlan}) {
    const [planData, setPlanData] = useState({
        topic:"",
        subject:"",
        gradeLevel: "",
        mainTopic:"",
        subTopics:[],
        materialsNeed:[],
        learningObjectives:[],
        lessonOutline:[{
            activities:"",
            duration:"",
            guide: "",
            remarks:""
        }],
    });
    const [showLoading, setShowLoading] = useState(false);
    const pdfRef = useRef();

      // Function to generate PDF
    const generatePDF = () => {
        const input = pdfRef.current;
        setShowLoading(true);
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save("lesson_plan.pdf");
        });
        const previousLessons = localStorage.getItem('AI_Lesson_Planner_lessonPlan');

        // Parse previous lessons if they exist, otherwise start with an empty array
        const parsedLessons = previousLessons ? JSON.parse(previousLessons).LessonPlans : [];
        
        parsedLessons.push(planData); // Add the new lesson plan
        
        localStorage.setItem('AI_Lesson_Planner_lessonPlan', JSON.stringify({ LessonPlans: parsedLessons }));
        
        console.log("Lesson Plan saved to localStorage!");
        setShowLoading(false);
    };
    
    const scrollToLessonPlan = () => {
        if (pdfRef.current) {
          pdfRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleChangeSubTopic = (idx, value)=>{
        let data = planData.subTopics;
        data[idx] = value;
        setPlanData({...planData,subTopics:data});
    }
    const handleChangeMaterialNeed = (idx, value)=>{
        let data = planData.materialsNeed;
        data[idx] = value;
        setPlanData({...planData,materialsNeed:data});
    }
    const handleChangeLearningObj = (idx, value)=>{
        let data = planData.learningObjectives;
        data[idx] = value;
        setPlanData({...planData,learningObjectives:data});
    }
    const handleLessonOutlineChange = (idx, field, value) => {
        const updatedLessonOutline = [...planData.lessonOutline];
        updatedLessonOutline[idx][field] = value;
        setPlanData({ ...planData, lessonOutline: updatedLessonOutline });
    };
    
    useEffect(()=>{
        console.log(lessonPlan);
        if(lessonPlan){
            setPlanData({
                topic: lessonPlan.topic,
                subject: lessonPlan.subject,
                gradeLevel: lessonPlan.gradeLevel,
                mainTopic: lessonPlan.mainConcept,
                subTopics: lessonPlan.subTopics,
                materialsNeed: lessonPlan.materialsNeeded,
                learningObjectives: lessonPlan.learningObjectives,
                lessonOutline: lessonPlan.lessonOutline
            });
            scrollToLessonPlan();
        }else{
            setPlanData(null);
        }
    },[])
    
  return (
    <div id='mainDiv_LP'>
        { planData && planData?.lessonOutline.length>0 && <div id='mainLessonPlan' ref={pdfRef}>
            <div id='topicHeading_LP'>
                <p style={{whiteSpace:"nowrap"}}>Lesson Topic:</p>
                <input 
                    value={planData?.topic} 
                    placeholder='Topic Name...' 
                    onChange={(e)=>setPlanData((prev)=>({...prev, topic:e.target.value}))}
                />
            </div>
        {/* Summary  */}
            <div>
                <div id='summaryHeading_LP'>
                    <p>Summary</p>
                </div>
                <div id='summaryData_LP'>
                    <table border="1">
                        <tbody>
                            <tr>
                                <th>Date</th>
                                <td>{new Date().toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <th>Subject</th>
                                <td>
                                    <input type="text" value={planData.subject} onChange={(e)=>setPlanData((prev)=>({...prev, subject:e.target.value}))} placeholder='Subject Name...'/>
                                </td>
                            </tr>
                            <tr>
                                <th>Grade Level</th>
                                <td>
                                    <input 
                                    type="text" 
                                    placeholder='Grade Level..'
                                    value= {planData.gradeLevel}
                                    onChange={(e)=>setPlanData((prev)=>({...prev, gradeLevel:e.target.value}))}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Main Topic</th>
                                <td>
                                <input 
                                    type="text" 
                                    placeholder='Main Topic..'
                                    value= {planData.mainTopic}
                                    onChange={(e)=>setPlanData((prev)=>({...prev, mainTopic:e.target.value}))}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Subtopics or Key Concepts</th>
                                <td>
                                    {/* <ul> */}
                                    <div>
                                    {
                                        planData.subTopics.map((elm,idx)=>(
                                            <div id={idx} style={{display:'flex', gap:'5px', alignItems:"start"}}>
                                                <span>•</span>
                                                <input onChange={(e)=>handleChangeSubTopic(idx,e.target.value)} value={elm} />
                                            </div>
                                        ))
                                    }
                                    </div>
                                    {/* </ul> */}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Material Needed */}
            <div id='materialNeed_LP'>
                <div id='materialNeedHead_LP'>
                    <p>Material Needed</p>
                </div>
                <div id='materialNeedCon_LP'>
                    {/* <div>
                        <span>•</span>
                        <input type="text" value="Chart of the photosynthesis process" />
                    </div> */}
                    {planData?.materialsNeed.map((elm,idx)=>(
                        <div key={idx}>
                            <span>•</span>
                            <p contentEditable style={{width:'100%'}} onChange={(e)=>handleChangeMaterialNeed(idx,e.target.value)}>{elm}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Learning Objectives */}
            <div id='learningObj_LP'>
                <div id='learningObjHead_LP'>
                    <p>Learning Objectives</p>
                </div>
                <div id='learningObjCon_LP'>
                    {/* <div>
                        <span>•</span>
                        <input type="text" value="Understand the concept of photosynthesis." />
                    </div> */}

                    {planData?.learningObjectives.map((elm,idx)=>(
                        <div key={idx}>
                            <span>•</span>
                            <p contentEditable style={{width:'100%'}} onChange={(e)=>handleChangeLearningObj(idx,e.target.value)}>{elm}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* lesson Outline */}
            <div>
                <div id='lessonOutlineHead_LP'>
                    <p>Lesson Outline</p>
                </div>
                <div id='lessonOutlineCon_LP'>
                    <table>
                        <thead>
                            <th>Activity</th>
                            <th>Duration</th>
                            <th>Guide</th>
                            <th>Remarks</th>
                        </thead>

                        <tbody>
                            {
                                planData?.lessonOutline.map((elm,idx)=>(
                                    <tr id={idx}>
                                        <td
                                            contentEditable
                                            onInput={(e) => handleLessonOutlineChange(idx, "activities", e.target.innerText)}
                                        >
                                            {elm.activities}
                                        </td>
                                        <td
                                            contentEditable
                                            onInput={(e) => handleLessonOutlineChange(idx, "duration", e.target.innerText)}
                                        >
                                            {elm.duration}
                                        </td>
                                        <td
                                            contentEditable
                                            onInput={(e) => handleLessonOutlineChange(idx, "guide", e.target.innerText)}
                                        >
                                            {elm.guide}
                                        </td>
                                        <td
                                            contentEditable
                                            onInput={(e) => handleLessonOutlineChange(idx, "remarks", e.target.innerText)}
                                        >
                                            {elm.remarks}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
        }
            <div id='savePdfBtnDiv_LP' onClick={generatePDF}>
                <Button>Save As Pdf</Button>
            </div>
            {showLoading? <Loader/>:null}
    </div>
  )
}
