import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import './userInputForm.css';
import { generateLessonPlan } from '../lessonPlanGenerator/generateLessonPlan';
import Loader from '@/module components/Loader/loader';

export default function UserInputForm({setLessonPlan, scrollToPlan, setScrollToPlan}) {
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState({
        topicName: "",
        gradeLevel:'',
        mainTopic: "",
        subTopics:[],
        materials:[],
        learningObj:[],
        assessment:''
    });
    const [newMaterialItem, setNewMaterialItem] = useState('');
    const [newLearningObjItem, setNewLearningObjItem] = useState('');
    const [showBtnLoading,setShowBtnLoading] = useState(false);
    const [showToast, setShowToast] = useState({bool:'', message:''});

    const customToastRef = useRef();
    const inputFormRef = useRef();

    function checkLogined() {
        const userName = localStorage.getItem('AI_Lesson_Planner_UserName');
        if (!userName) {
            navigate('/login');
        }
    }

    useEffect(() => {
        checkLogined();
    }, []);
    // ---------------------------------------------- Functions to handle Data Manipulation on Main Topics -------------------------------------------- 
    const handleMainTopicChange = (value) =>{
        setUserInput((prev)=>({...prev, mainTopic:value.trim()}));
    }

    
    // ---------------------------------------------- Functions to handle Data Manipulation on sub Topics --------------------------------------------
    const handleAddSubTopic = () => {
        let updatedSubTopics = userInput.subTopics;
        updatedSubTopics.push("");
    
        setUserInput({
            ...userInput,
            subTopics: updatedSubTopics
        });
    };

    const handleDeleteSubTopic = (subTopicIdx) => {
        setUserInput((prev)=>{
            const filterData = userInput.subTopics.filter((_,idx)=> idx !== subTopicIdx);
            return {...prev, subTopics: filterData};
        });
    };

    const handleSubTopicChange = (subTopicIdx, value) => {
        setUserInput((prev) => {
            let updatedTopics = userInput.subTopics;
            updatedTopics[subTopicIdx] = value.trim();
            return { ...prev, subTopics: updatedTopics };
        });
    };
    
    // ---------------------------------------------- Functions to handle Data Manipulation on materials needed section --------------------------------------------
  
    const editMaterialItem = (index, value) => {
        const data = userInput.materials;
        data[index] = value.trim();
        setUserInput((prev)=>({...prev, materials:data}));
    };
  
    const removeMaterial = (index) => {
      const data = userInput.materials;
      const filterData = data.filter((_, i) => i !== index);

      setUserInput((prev)=>({...prev, materials:filterData}));
    };

    // ---------------------------------------------- Functions to handle Data Manipulation on materials needed section --------------------------------------------
    const editLearningObjItem = (index, value) => {
        const data = userInput.learningObj;
        data[index] = value.trim();
        setUserInput((prev)=>({...prev, learningObj:data}));
    };
  
    const removeLearningObj = (index) => {
      const data = userInput.learningObj;
      const filterData = data.filter((_, i) => i !== index);

      setUserInput((prev)=>({...prev, learningObj:filterData}));
    };

    async function handleSubmit(){
        setShowBtnLoading(true);
        try {
            if(userInput.topicName.length==0){
                setShowToast({bool:true, message: "Please Provide Topic Name..."});
            }else if(userInput.gradeLevel.length == 0){
                setShowToast({bool:true, message: "Please Provide Grade Level..."});
            }else if(userInput.mainTopic.length == 0){
                setShowToast({bool:true, message: "Please Provide Main Topics Names..."});
            }else if(userInput.materials.length == 0){
                setShowToast({bool:true, message: "Please Provide Materials Needs..."});
            }else if(userInput.learningObj.length == 0){
                setShowToast({bool:true, message: "Please Provide Learing Objectives..."});
            }else if(userInput.assessment.length == 0){
                setShowToast({bool:true, message: "Please Provide Assessments..."});
            }else{
                const generatedPlan = await generateLessonPlan(userInput);
                const size = Object.keys(generatedPlan).length;

                if(size == 0){
                    setShowToast({bool:true, message: "Something went wrong... Try again later!"});
                    console.log("No response from API");
                    return;
                }  
                setLessonPlan(generatedPlan);
            }
        } catch (error) {
            console.log(error);
            setShowToast({bool:true, message: "Error, Please! Try again later..."});
        } finally{
            setShowBtnLoading(false);
        } 
    }
    const scrollToLessonPlan = () => {
        if (inputFormRef.current) {
          inputFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    useEffect(()=>{
        const toastDiv = customToastRef.current;

        if(toastDiv){
            if(showToast.bool){
                setTimeout(()=>{
                    toastDiv.style.animation = "downToTopToast 0.3s ease-out";
                    
                    setTimeout(()=>{
                        setShowToast({bool:false, message:''});
                    },270)
                },2000);
            }
        }
    },[showToast]);
    useEffect(()=>{
        if(scrollToPlan){
            scrollToLessonPlan();
            setScrollToPlan(false);
        }
    },[scrollToPlan]);
    return (
        <div>
            <div id='userInputForm' ref={inputFormRef}>
                <div id='inputHeading'>
                    <h1>Provide Details to Plan Lesson</h1>
                </div>
                <div id='topicDiv'>
                    <p>Lesson Topic: </p>
                    <Input placeholder="Topic" value={userInput.topicName} onChange={(e) => setUserInput({ ...userInput, topicName: e.target.value.trim() })} />
                </div>
                                                {/* Code to get grade level from user */}
                <div id="gradeLevelDiv">
                    <p>Grade Level: </p>
                    <Select 
                        value={userInput.gradeLevel} 
                        onValueChange={(value) => setUserInput((prev) => ({ ...prev, gradeLevel: value }))}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Grade Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Grade Level</SelectLabel>
                                {[...Array(12)].map((_, i) => (
                                    <SelectItem key={i} value={`Grade ${i + 1}`}>
                                        {`Grade ${i + 1}`}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                                                    {/* Code to add, manage, and delete main topics and subtopics provided by the user */}
                <div id='mainTopicsDiv'>
                    <div id='mainTopicDiv'>
                        <div id='mainTopicDivHeading'>
                                <p>Main Topic Name: </p>
                                <Input value={userInput.mainTopic} onChange={(e) => handleMainTopicChange(e.target.value)} placeholder = "Give Main Topic.."/>
                        </div>
                        <div>
                            <div id='subTopicsHeading'>
                                <p>Sub Topics List:</p>
                            </div>
                            {
                                userInput.subTopics.length>0?
                                userInput.subTopics.map((subTopic,idx)=>(
                                    <div className='inputDiv' key={idx} style={{marginBottom:'1rem'}}>
                                        <span>{idx + 1}.</span>
                                        <Input type="text" placeholder='Give Sub Topic..' value={subTopic} onChange={(e) => handleSubTopicChange(idx,e.target.value)} />
                                        <Button style={{borderRadius:"40px"}} onClick={() => handleDeleteSubTopic(idx)}>Delete</Button>
                                    </div>
                                )):
                                <div style={{textAlign:'center'}}>
                                    <p>Empty...</p>
                                </div>
                            }
                            <div className='addItemBtnDiv' style={{ marginTop: '10px' }}>
                                <Button onClick={handleAddSubTopic}>Add Sub Topic</Button>
                            </div>
                        </div>
                    </div>
                </div>
                                                    {/* Code to add, manage, and delete materials needs provided by the user */}
                <div id="materialsMain">
                    <h2 id='materialsHeading'>Materials Needed</h2>
                    <div id='materialsCon'>
                        <div id='materialsInputDiv'>
                            <input
                            type="text"
                            value={newMaterialItem}
                            onChange={(e)=>setNewMaterialItem(e.target.value)}
                            placeholder="Enter material"
                            />
                            <button 
                                onClick={()=>{
                                    if(newMaterialItem.trim().length == 0){
                                        alert("Please Provide Materials Needs");
                                        return;
                                    }
                                    setUserInput((prev)=>({...prev, materials:[...userInput.materials,newMaterialItem]})), setNewMaterialItem("")
                                }}
                            >Add</button>
                        </div>
                        <div>
                            { userInput.materials.length>0?
                            userInput.materials.map((material, index) => (
                            <div key={index} id="materialItem">
                                <div><span>{index+1}.</span></div>
                                <div>
                                    <input 
                                        type="text" 
                                        value={material} 
                                        style={{padding:'5px 10px', border:'none'}}
                                        onChange={(e)=>editMaterialItem(index, e.target.value)}
                                    />
                                </div>
                                <div className='crossBtn'>
                                    <img src="cross.png" alt="error" onClick={() => removeMaterial(index)} />
                                </div>
                            </div>
                            ))
                            :
                            <div>
                                <p style={{fontSize:'large', fontWeight:'500'}}>Empty...</p>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                                                    {/* Code to add, manage, and delete learning objectives provided by the user */}
                
                 <div id="learningObjMain">
                    <h2 id='learningObjHeading'>Learning Objectives</h2>
                    <div id='learningObjCon'>
                        <div id='learningObjInputDiv'>
                            <input
                            type="text"
                            value={newLearningObjItem}
                            onChange={(e)=>setNewLearningObjItem(e.target.value)}
                            placeholder="Enter Learning Objective"
                            />
                            <button 
                                onClick={()=>
                                    {
                                        if(newLearningObjItem.trim().length==0){
                                            alert("Please Provide Learning Objective");
                                            return;
                                        }
                                        setUserInput((prev)=>({...prev, learningObj:[...userInput.learningObj,newLearningObjItem]})), 
                                        setNewLearningObjItem("")
                                    }}
                            >Add</button>
                        </div>
                        <div>
                            { userInput.learningObj.length>0?
                            userInput.learningObj.map((learnObj, index) => (
                            <div key={index} id="learningObjItem">
                                <div><span>•</span></div>
                                <div>
                                    <input 
                                        type="text" 
                                        value={learnObj} 
                                        style={{padding:'5px 10px', border:'none'}}
                                        onChange={(e)=>editLearningObjItem(index, e.target.value)}
                                    />
                                </div>
                                <div className='crossBtn'>
                                    <img src="cross.png" alt="error" onClick={() => removeLearningObj(index)} />
                                </div>
                            </div>
                            ))
                            :
                            <div>
                                <p style={{fontSize:'large', fontWeight:'500'}}>Empty...</p>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                                                    {/* Code to record lesson outline provideed by the user */}
                <div>
                    <div id='lessonOutlineHeading'>
                        <p>Lesson Outline</p>
                    </div>
                    <div id='lessonOutInputBox'>
                        <Textarea placeholder="Give your lesson outline..." value={userInput.lessonOutline} onChange={(e)=>setUserInput((prev)=>({...prev,lessonOutline:e.target.value.trim()}))} />
                    </div>
                </div>
                                                    {/* Code to record Assessment provideed by the user */}
                <div>
                    <div id='assessmentHeading'>
                        <p>Assessment</p>
                    </div>
                    <div id='assessmentInputBox'>
                        <Textarea placeholder="Give your Assessment.." value={userInput.assessment} onChange={(e)=>setUserInput((prev)=>({...prev,assessment:e.target.value.trim()}))} />
                    </div>
                </div>
                
                <div id='formSubmitBtnDiv'>
                    {
                    showBtnLoading?
                    <Button disabled id='formSubmitBtn' style={{padding:'10px 40px'}}>
                        <Loader2 className="animate-spin" />
                        Please wait
                    </Button>
                    :
                    <Button id='formSubmitBtn' onClick={handleSubmit}>Generate Lesson Plan</Button>
                    }
                </div>

                {/* Custom toast */}
                { showToast.bool && <div id='customToast' ref={customToastRef}>
                    <div>
                        <p>{showToast.message}</p>
                    </div>
                    <div onClick={()=>setShowToast({bool:false, message:''})}>
                        <img src="crossWhite.png" alt="error" />
                    </div>
                </div>}
            </div>
            {showBtnLoading? <Loader/>: null}
        </div>
    );
}