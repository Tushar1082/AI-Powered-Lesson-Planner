
export const generateLessonPlan = async (userInputs) => {
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${import.meta.env.VITE_REACT_GEMINI_API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: `
          You have given below a user data to create enhanced and correct lesson plan for a teacher: -
          Topic: ${userInputs.topicName}
          Grade Level: ${userInputs.gradeLevel}
          Main Concept & Subtopics: ${userInputs.mainTopic}
          Materials Needed: ${userInputs.materials}
          Learning Objectives: ${userInputs.learningObj}
          Lesson Outline: ${userInputs.lessonOutline}
          Assessment: ${userInputs.assessment}
          generated enhanced plain you have to return in a json format. This json output must have following keys with their values: -
          1. topic -- The name of the topic, exactly as provided by the user.
          2. gradeLevel -- The grade level, exactly as provided by the user.
          3. subject -- The name of subject according to topic provied by the user.
          4. mainConcept -- An enhanced main topic based on the user’s input.
          5. subTopics -- An **array of strings**, each representing an improved subtopic related to the main concept.
          6. materialsNeeded --  An **array of strings**, listing all necessary materials.
          7. learningObjectives -- TAn **array of strings**, outlining the key learning objectives.
          8. lessonOutline --  An **array of objects**, where each object represents a part of the lesson plan. Each object must contain the following keys:  
              - **activities**: Description of the activity  
              - **duration**: Duration of the activity in minutes  
              - **guide**: Teaching instructions  
              - **remarks**: Additional notes or tips  
          9. assessment -- An **array of objects**, where each object must contain the following keys:  
              - **quiz**: An array of quiz questions  
              - **shortAnswer**: An array of short-answer questions  
              - **handsOn**: An array of hands-on activities 
          ` },
        ],
      },
    ],
  };
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return "Error generating lesson plan. Please check your API key and request format.";
    }
    // "No response from API"
    // console.log(data);
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const cleanedJson = rawText.replace(/```json|```/g, "").trim();
    const lessonPlan = JSON.parse(cleanedJson);
    return lessonPlan;

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    return "Error generating lesson plan. Please try again.";
  }
};