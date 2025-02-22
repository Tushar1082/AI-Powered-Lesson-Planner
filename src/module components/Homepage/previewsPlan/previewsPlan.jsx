import React, { useEffect, useState } from "react";
import "./previewsPlan.css";
export default function PreviewsPlan() {
    const [prevPlan, setPrevPlan] = useState(null);

    useEffect(() => {
        const rawData = localStorage.getItem("AI_Lesson_Planner_lessonPlan");
        if (rawData) {
            setPrevPlan(JSON.parse(rawData));
        }
    }, []);

    return (
        <div id="previews-container">
            <h1 id="previews-title">📚 Previous Lesson Plans</h1>
            {prevPlan && prevPlan.LessonPlans.length > 0 ? (
                <div id="lesson-list">
                    {prevPlan.LessonPlans.map((plan, index) => (
                        <div id="lesson-card" key={index}>
                            <div id="lesson-header">
                                <h2 id="lesson-topic">{plan.topic}</h2>
                                <span id="lesson-grade">{plan.gradeLevel}</span>
                            </div>
                            <div id="lesson-info">
                                <span id="lesson-subject">📖 {plan.subject}</span>
                            </div>
                            <div id="lesson-details">
                                <div>
                                    <h3>📌 <strong>Main Topic:</strong> {plan.mainTopic}</h3>
                                </div>
                                <div id="subtopics">
                                    <h3>📌 Subtopics</h3>
                                    <ul>{plan.subTopics.map((sub, i) => <li key={i}>• {sub}</li>)}</ul>
                                </div>
                                <div id="materials">
                                    <h3>📦 Materials Needed</h3>
                                    <ul>{plan.materialsNeed.map((mat, i) => <li key={i}>🛠 {mat}</li>)}</ul>
                                </div>
                                <div id="objectives">
                                    <h3>🎯 Learning Objectives</h3>
                                    <ul>{plan.learningObjectives.map((obj, i) => <li key={i}>✅ {obj}</li>)}</ul>
                                </div>
                                <div id="outline">
                                    <h3>📋 Lesson Outline</h3>
                                    {plan.lessonOutline.map((item, i) => (
                                        <div id="outline-item" key={i}>
                                            <strong>🕒 {item.activities} ({item.duration} mins)</strong>
                                            <p>{item.guide}</p>
                                            <em>{item.remarks}</em>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div id="empty-message">
                    <h2>😔 No Previous Lesson Plans Available</h2>
                </div>
            )}
        </div>
    );
}
