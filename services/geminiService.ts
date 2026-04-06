
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { QuizQuestion, StudyGuideContent, CareerRecommendation, CodeReviewResult, MindmapNode, MindmapResponse, Flashcard, ResumeAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Optimized system rules for speed and brevity
const SYSTEM_RULES = "You are A Student Assistant, an ultra-fast academic AI. Responses must be IMMEDIATE, CONCISE, and ACCURATE. Do not fluff. Prioritize speed and density of information.";

const FAST_MODEL = "gemini-3-flash-preview";
const PRO_MODEL = "gemini-3-pro-preview"; 
const IMAGE_MODEL = "gemini-2.5-flash-image";

const FAST_CONFIG = {
    thinkingConfig: { thinkingBudget: 0 },
    temperature: 0.7, // Balanced for speed/creativity
};

const PRO_CONFIG = {
    thinkingConfig: { thinkingBudget: 1024 } // Reduced budget for faster "Pro" responses
};

export const getChatbotResponseStream = async (message: string, onChunk: (text: string) => void) => {
    const response = await ai.models.generateContentStream({
        model: FAST_MODEL,
        contents: message,
        config: { 
            systemInstruction: SYSTEM_RULES,
            ...FAST_CONFIG
        }
    });
    
    let fullText = "";
    for await (const chunk of response) {
        const text = chunk.text;
        if (text) {
            fullText += text;
            onChunk(fullText);
        }
    }
};

export const generateStudyGuide = async (topic: string): Promise<StudyGuideContent | null> => {
  try {
    // Optimized prompt for speed
    const response = await ai.models.generateContent({
        model: FAST_MODEL,
        contents: `Create a concise study guide for: "${topic}". keep summaries short.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    examQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["summary", "keyPoints", "examQuestions"]
            },
            ...FAST_CONFIG
        }
    });
    return JSON.parse(response.text) as StudyGuideContent;
  } catch (error) { 
    console.error("Study Guide Gen Error:", error);
    return null; 
  }
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[] | null> => {
  try {
    const response = await ai.models.generateContent({
        model: FAST_MODEL,
        contents: `Generate 5 MCQs for: "${topic}". Short questions.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        answer: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ["MCQ"] }
                    },
                    required: ["question", "options", "answer", "explanation", "type"]
                }
            },
            ...FAST_CONFIG
        }
    });
    return JSON.parse(response.text) as QuizQuestion[];
  } catch (error) { 
    console.error("Quiz Gen Error:", error);
    return null; 
  }
};

export const generateVisualConcept = async (topic: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: IMAGE_MODEL,
            contents: {
                parts: [{ text: `A clear, simple educational diagram for: "${topic}". White background.` }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "16:9"
                }
            }
        });
        
        const parts = response.candidates?.[0]?.content?.parts;
        if (parts) {
            for (const part of parts) {
                if (part.inlineData) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Image Generation Error:", error);
        return null;
    }
};

export const generateMindmap = async (topic: string): Promise<MindmapResponse | null> => {
    try {
        // Removed strict responseSchema to prevent validation timeouts on recursive structures.
        // Using a clear prompt for JSON generation is faster and more robust here.
        const prompt = `
        Generate a hierarchical mindmap for the topic: "${topic}".
        Return strictly valid JSON in this structure:
        {
          "root": {
            "name": "Main Topic",
            "description": "Brief description",
            "children": [
              { "name": "Subtopic", "description": "Brief description", "children": [] }
            ]
          },
          "explanations": [
            { "point": "Core Concept", "detail": "Concise explanation (max 15 words)" }
          ]
        }
        IMPORTANT:
        1. Keep tree depth to maximum 3 levels.
        2. Keep descriptions very short.
        3. Max 5 items in "explanations".
        `;

        const response = await ai.models.generateContent({
            model: FAST_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                // Strict schema removed for speed and flexibility
                ...FAST_CONFIG
            }
        });
        
        const text = response.text;
        if (!text) return null;
        return JSON.parse(text) as MindmapResponse;
    } catch (error) {
        console.error("Mindmap Gen Error:", error);
        return null;
    }
};

export const simulateCodeExecution = async (code: string, language: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: FAST_MODEL,
        contents: `Act as a ${language} compiler. Run this code. Return ONLY output. No fluff.\n\nCode:\n${code}`,
        config: FAST_CONFIG
    });
    return response.text?.trim() || "No output.";
};

export const debugCode = async (code: string, errorMsg: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: PRO_MODEL,
        contents: `Fix this code based on the error. Return ONLY the fixed code.\n\nCode:\n${code}\n\nError:\n${errorMsg}`,
        config: PRO_CONFIG
    });
    return response.text || "";
};

export const searchWeb = async (query: string): Promise<{ text: string, sources: { title: string; uri: string }[] }> => {
    const response = await ai.models.generateContent({
        model: FAST_MODEL,
        contents: query,
        config: { 
            tools: [{ googleSearch: {} }],
            ...FAST_CONFIG
        },
    });
    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
    return { text: response.text, sources };
};

export const getChatbotResponse = async (message: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: FAST_MODEL,
        contents: message + " (Keep response under 50 words)",
        config: { systemInstruction: SYSTEM_RULES, ...FAST_CONFIG }
    });
    return response.text;
};

export const reviewCode = async (code: string, language: string): Promise<CodeReviewResult | null> => {
    // Reduced complexity for speed
    const response = await ai.models.generateContent({
        model: FAST_MODEL, // Switched to FAST_MODEL for speed, unless deep reasoning needed
        contents: `Review this ${language} code. Concise feedback.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                    categories: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                severity: { type: Type.STRING, enum: ["high", "medium", "low"] },
                                feedback: { type: Type.STRING }
                            },
                            required: ["name", "severity", "feedback"]
                        }
                    }
                },
                required: ["summary", "score", "categories"]
            },
            ...FAST_CONFIG
        }
    });
    try { return JSON.parse(response.text); } catch { return null; }
};

export const getCareerRecommendations = async (level: string, interests: string): Promise<CareerRecommendation[]> => {
    const response = await ai.models.generateContent({
        model: FAST_MODEL, // Switched to FAST_MODEL
        contents: `Recommend 3 career paths for education: '${level}', interests: '${interests}'. Concise.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        careerPath: { type: Type.STRING },
                        description: { type: Type.STRING },
                        recommendedCourses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        whyItFits: { type: Type.STRING }
                    },
                    required: ["careerPath", "description", "recommendedCourses", "whyItFits"]
                }
            },
            ...FAST_CONFIG
        }
    });
    try { return JSON.parse(response.text); } catch { return []; }
};

export const analyzeResume = async (text: string): Promise<ResumeAnalysis | null> => {
    try {
        const response = await ai.models.generateContent({
            model: FAST_MODEL, // Switched to FAST_MODEL
            contents: `ATS scan this resume. Concise results.\n\nResume:\n${text}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                        keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["score", "improvements", "keywords"]
                },
                ...FAST_CONFIG
            }
        });
        return JSON.parse(response.text) as ResumeAnalysis;
    } catch (error) {
        console.error("Resume Analysis Error:", error);
        return null;
    }
};

export const generateAptitudeQuestions = async (chapter: string, level: string): Promise<QuizQuestion[]> => {
    const response = await ai.models.generateContent({
        model: FAST_MODEL,
        contents: `5 aptitude MCQs for '${chapter}', difficulty '${level}'. Short explanations.`,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        answer: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ["MCQ"] }
                    },
                    required: ["question", "options", "answer", "explanation", "type"]
                }
            },
            ...FAST_CONFIG 
        }
    });
    try { return JSON.parse(response.text); } catch { return []; }
};

export const generateEnglishChallenge = async (): Promise<any> => {
    const response = await ai.models.generateContent({
        model: FAST_MODEL,
        contents: "One English phrase completion challenge. JSON.",
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    phrase: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    answer: { type: Type.STRING },
                    hint: { type: Type.STRING }
                },
                required: ["phrase", "options", "answer", "hint"]
            },
            ...FAST_CONFIG 
        }
    });
    try { return JSON.parse(response.text); } catch { return null; }
};

export const generateAISchedule = async (subjects: string[]): Promise<any> => {
    try {
        const response = await ai.models.generateContent({
            model: FAST_MODEL,
            contents: `Weekly schedule for: ${subjects.join(', ')}. JSON map: Day -> Time -> Subject.`,
            config: {
                responseMimeType: "application/json",
                ...FAST_CONFIG
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Schedule Gen Error:", error);
        return {};
    }
};

export const generateFlashcards = async (text: string): Promise<Flashcard[]> => {
    try {
        const response = await ai.models.generateContent({
            model: FAST_MODEL,
            contents: `5 flashcards from text. JSON.\n\n${text}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            front: { type: Type.STRING },
                            back: { type: Type.STRING }
                        },
                        required: ["front", "back"]
                    }
                },
                ...FAST_CONFIG
            }
        });
        return JSON.parse(response.text) as Flashcard[];
    } catch (error) {
        console.error("Flashcard Gen Error:", error);
        return [];
    }
};

export const connectLiveMentor = (name: string, callbacks: any) => {
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Zephyr'}},
            },
            systemInstruction: `You are ${name}, a fast, encouraging live AI mentor. Keep answers short and conversational.`,
        },
    });
};

export const connectInterviewCoach = (role: string, callbacks: any) => {
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Puck'}},
            },
            systemInstruction: `You are a mock interviewer for a ${role} position. Short questions. If answer is wrong say "this is not that".`,
        },
    });
};

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
