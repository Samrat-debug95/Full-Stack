const { GoogleGenAI, Type } = require("@google/genai"); // Zod hata kar Type import kiya

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// Zod ki jagah Gemini ka native Schema format
const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: { 
            type: Type.NUMBER, 
            description: "A score between 0 to 100 indicate how well the candidate profile match the job description" 
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in the interview along with their intention, and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical question can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral questions that can be asked in the interview along with their intention, and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer: { type: Type.STRING }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGap: {
            type: Type.ARRAY,
            description: "List of Skills gap in candidate profile along with their preparation plan",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The skill which the candidate lacking" },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"], description: "The severity of skill gap" }
                },
                required: ["skill", "severity"]
            }
        },
        preperationPlan: {
            type: Type.ARRAY,
            description: "A day-wise preparation plan for the candidate to follow in order to prepare for this interview effectively",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER, description: "The number of days required for preparing this skill gap, starting from 1" },
                    focus: { type: Type.STRING, description: "The main focus of this day in the preparation plan" },
                    tasks: {
                        type: Type.ARRAY,
                        description: "List of tasks to be done",
                        items: { type: Type.STRING }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        title:{
            type:Type.STRING,
            description:"The title of the job for which the interview report genrrated"
        }
    },
    // Yeh batana zaroori hai ki saari fields required hain
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGap", "preperationPlan"]
};

async function generateInterviewReport(resume, selfDescription, jobDescription) {

    const prompt = `
        Analyze the candidate's resume against the job description.

        Return ONLY valid JSON matching the provided schema.

        Resume: ${resume}

        Self Description: ${selfDescription}

        Job Description: ${jobDescription}

    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Note: Ensure this model version is correct as per your API access
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema // Ab API perfectly schema samajh jayega
        }
    });

    const text = response.candidates[0].content.parts[0].text;
    console.log("AI Response:\n", text);

    return JSON.parse(text);
}

module.exports = generateInterviewReport;